import {
  users,
  courses,
  enrollments,
  lessons,
  lessonProgress,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type Enrollment,
  type InsertEnrollment,
  type Lesson,
  type InsertLesson,
  type LessonProgress,
  type InsertLessonProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;

  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course>;

  // Enrollment operations
  enrollUser(enrollment: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]>;
  getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined>;
  updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<Enrollment>;

  // Lesson operations
  getCourseLessons(courseId: string): Promise<Lesson[]>;
  getLessonById(lessonId: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  // Progress operations
  updateLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress>;
  getUserLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined>;
  getUserCourseProgress(userId: string, courseId: string): Promise<LessonProgress[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId,
        stripeSubscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isPublished, true))
      .orderBy(asc(courses.createdAt));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({ ...course, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  // Enrollment operations
  async enrollUser(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getUserEnrollments(userId: string): Promise<(Enrollment & { course: Course })[]> {
    return await db
      .select({
        id: enrollments.id,
        userId: enrollments.userId,
        courseId: enrollments.courseId,
        progress: enrollments.progress,
        completedAt: enrollments.completedAt,
        enrolledAt: enrollments.enrolledAt,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment;
  }

  async updateEnrollmentProgress(userId: string, courseId: string, progress: number): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({
        progress,
        completedAt: progress >= 100 ? new Date() : null,
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
      .returning();
    return updatedEnrollment;
  }

  // Lesson operations
  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(and(eq(lessons.courseId, courseId), eq(lessons.isPublished, true)))
      .orderBy(asc(lessons.order));
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  // Progress operations
  async updateLessonProgress(progress: InsertLessonProgress): Promise<LessonProgress> {
    const [existingProgress] = await db
      .select()
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, progress.userId),
          eq(lessonProgress.lessonId, progress.lessonId)
        )
      );

    let updatedProgress: LessonProgress;
    
    if (existingProgress) {
      [updatedProgress] = await db
        .update(lessonProgress)
        .set({
          ...progress,
          completedAt: progress.completed ? new Date() : null,
        })
        .where(eq(lessonProgress.id, existingProgress.id))
        .returning();
    } else {
      [updatedProgress] = await db
        .insert(lessonProgress)
        .values({
          ...progress,
          completedAt: progress.completed ? new Date() : null,
        })
        .returning();
    }

    // Update overall course progress
    const lesson = await this.getLessonById(progress.lessonId);
    if (lesson) {
      await this.updateCourseProgress(progress.userId, lesson.courseId);
    }

    return updatedProgress;
  }

  private async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    // Get all lessons for the course
    const courseLessons = await this.getCourseLessons(courseId);
    
    // Get all progress for this user in this course
    const userProgressRecords = await this.getUserCourseProgress(userId, courseId);
    
    // Calculate overall progress percentage
    const completedLessons = userProgressRecords.filter(p => p.completed).length;
    const totalLessons = courseLessons.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    // Update enrollment progress
    await this.updateEnrollmentProgress(userId, courseId, progressPercentage);
  }

  async getUserLessonProgress(userId: string, lessonId: string): Promise<LessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
    return progress;
  }

  async getUserCourseProgress(userId: string, courseId: string): Promise<LessonProgress[]> {
    return await db
      .select({
        id: lessonProgress.id,
        userId: lessonProgress.userId,
        lessonId: lessonProgress.lessonId,
        completed: lessonProgress.completed,
        watchTime: lessonProgress.watchTime,
        completedAt: lessonProgress.completedAt,
      })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
      .where(and(eq(lessonProgress.userId, userId), eq(lessons.courseId, courseId)));
  }


  async getLessonById(lessonId: string): Promise<Lesson | undefined> {
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    return lesson;
  }
}

export const storage = new DatabaseStorage();
