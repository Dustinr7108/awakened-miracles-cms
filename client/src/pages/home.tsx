import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, Trophy, Play } from "lucide-react";
import { Link } from "wouter";
import type { Course, Enrollment } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/my-enrollments'],
  });

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  if (enrollmentsLoading || coursesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const enrolledCourseIds = new Set((enrollments as any)?.map((e: Enrollment & { course: Course }) => e.courseId) || []);
  const enrolledCourses = enrollments || [];
  const availableCourses = (courses as any)?.filter((course: Course) => !enrolledCourseIds.has(course.id)) || [];

  const completedCourses = enrolledCourses.filter((e: Enrollment & { course: Course }) => (e.progress || 0) >= 100).length;
  const totalHours = enrolledCourses.reduce((acc: number, e: Enrollment & { course: Course }) => acc + e.course.duration, 0);
  const currentCourse = enrolledCourses.find((e: Enrollment & { course: Course }) => (e.progress || 0) > 0 && (e.progress || 0) < 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-4" data-testid="welcome-title">
            Welcome back, {(user as any)?.firstName || 'Student'}
          </h1>
          <p className="text-xl text-muted-foreground">
            Continue your spiritual growth journey
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-primary h-8 w-8" />
              </div>
              <div className="text-2xl font-bold mb-2" data-testid="completed-courses">{completedCourses}</div>
              <div className="text-muted-foreground">Courses Completed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-accent h-8 w-8" />
              </div>
              <div className="text-2xl font-bold mb-2" data-testid="total-hours">{totalHours}</div>
              <div className="text-muted-foreground">Hours of Content</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-secondary h-8 w-8" />
              </div>
              <div className="text-2xl font-bold mb-2" data-testid="certificates-earned">{completedCourses}</div>
              <div className="text-muted-foreground">Certificates Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Course Progress */}
        {currentCourse && (
          <Card className="mb-12">
            <CardContent className="p-8">
              <h3 className="font-semibold text-lg mb-4" data-testid="current-course-title">
                Currently Studying: {currentCourse.course.title}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium" data-testid="current-course-progress">
                  {currentCourse.progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentCourse.progress}%` }}
                ></div>
              </div>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/course/${currentCourse.courseId}`} data-testid="continue-learning">
                  <Play className="mr-2 h-4 w-4" />
                  Continue Learning
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My Courses */}
        {(enrolledCourses as any).length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold mb-6">My Courses</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(enrolledCourses as any).map((enrollment: Enrollment & { course: Course }) => (
                <CourseCard 
                  key={enrollment.id} 
                  course={enrollment.course} 
                  isEnrolled={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommended Courses */}
        {availableCourses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold">Recommended for You</h2>
              <Button asChild variant="outline">
                <Link href="/courses" data-testid="browse-all-courses">
                  Browse All Courses
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.slice(0, 3).map((course: Course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(enrolledCourses as any).length === 0 && (
          <Card className="text-center p-12">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold mb-2">Start Your Journey</h3>
            <p className="text-muted-foreground mb-6">
              You haven't enrolled in any courses yet. Explore our comprehensive curriculum and begin your transformation.
            </p>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/courses" data-testid="explore-courses">
                Explore Courses
              </Link>
            </Button>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
