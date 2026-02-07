import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Clock, Trophy, Play, Award } from "lucide-react";
import { Link } from "wouter";
import type { Course, Enrollment } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/student-login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['/api/my-enrollments'],
  });

  if (isLoading || enrollmentsLoading) {
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

  const completedCourses = (enrollments as any)?.filter((e: Enrollment & { course: Course }) => (e.progress || 0) >= 100) || [];
  const inProgressCourses = (enrollments as any)?.filter((e: Enrollment & { course: Course }) => (e.progress || 0) > 0 && (e.progress || 0) < 100) || [];
  const totalHours = (enrollments as any)?.reduce((acc: number, e: Enrollment & { course: Course }) => acc + ((e.course as any).duration * ((e.progress || 0) / 100)), 0) || 0;
  const currentCourse = inProgressCourses[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-4" data-testid="dashboard-title">
            Your Learning Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your progress and continue your spiritual growth journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-primary/5">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-primary h-8 w-8" />
              </div>
              <div className="text-2xl font-bold mb-2" data-testid="completed-courses-count">
                {(completedCourses as any).length}
              </div>
              <div className="text-muted-foreground">Courses Completed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-accent/5">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-accent h-8 w-8" />
              </div>
              <div className="text-2xl font-bold mb-2" data-testid="study-hours">
                {Math.round(totalHours)}
              </div>
              <div className="text-muted-foreground">Hours Studied</div>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary/5">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="text-secondary h-8 w-8" />
              </div>
              <div className="text-2xl font-bold mb-2" data-testid="certificates-count">
                {(completedCourses as any).length}
              </div>
              <div className="text-muted-foreground">Certificates Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Course Progress */}
        {currentCourse && (
          <Card className="mb-12">
            <CardContent className="p-8">
              <h3 className="font-semibold text-lg mb-4" data-testid="current-course-section">
                Currently Studying: {(currentCourse.course as any).title}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium" data-testid="current-progress">
                  {(currentCourse as any).progress}%
                </span>
              </div>
              <Progress value={(currentCourse as any).progress} className="mb-4" />
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/course/${currentCourse.courseId}`} data-testid="continue-course-button">
                  <Play className="mr-2 h-4 w-4" />
                  Continue Learning
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Course Sections */}
        <div className="space-y-12">
          {/* In Progress Courses */}
          {inProgressCourses.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6" data-testid="in-progress-section">
                Continue Learning ({inProgressCourses.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inProgressCourses.map((enrollment: Enrollment & { course: Course }) => (
                  <div key={enrollment.id} className="relative">
                    <CourseCard course={enrollment.course} isEnrolled={true} />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      {enrollment.progress}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-bold mb-6" data-testid="completed-section">
                Completed Courses ({completedCourses.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((enrollment: Enrollment & { course: Course }) => (
                  <div key={enrollment.id} className="relative">
                    <CourseCard course={enrollment.course} isEnrolled={true} />
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Award className="mr-1 h-3 w-3" />
                      Complete
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {(!enrollments || enrollments.length === 0) && (
            <Card className="text-center p-12">
              <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">No Courses Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start your spiritual counseling journey by enrolling in your first course.
              </p>
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/courses" data-testid="browse-courses-button">
                  Browse Courses
                </Link>
              </Button>
            </Card>
          )}
        </div>

        {/* Achievement Badge */}
        {completedCourses.length >= 3 && (
          <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Dedicated Learner</h3>
              <p className="text-muted-foreground">
                Congratulations! You've completed {completedCourses.length} courses. You're on the path to mastery.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
