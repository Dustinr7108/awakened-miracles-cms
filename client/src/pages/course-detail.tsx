import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/Header";
import LessonPlayer from "@/components/LessonPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Clock, 
  Star, 
  Users, 
  Tag, 
  CheckCircle,
  Lock
} from "lucide-react";
import { Link } from "wouter";
import type { Course, Enrollment, Lesson } from "@shared/schema";

export default function CourseDetail() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['/api/courses', id],
  });

  const { data: enrollment } = useQuery({
    queryKey: ['/api/my-enrollments'],
    select: (enrollments: (Enrollment & { course: Course })[]) => 
      enrollments?.find(e => e.courseId === id),
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ['/api/courses', id, 'lessons'],
    enabled: !!enrollment,
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ['/api/progress/course', id],
    enabled: !!enrollment,
  });

  const enrollMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/enroll', { courseId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-enrollments'] });
      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in the course. You can now access all lessons.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Enrollment Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-2xl"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-accent text-accent-foreground';
      case 'intermediate':
        return 'bg-secondary text-secondary-foreground';
      case 'advanced':
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Lesson Player */}
            <div className="mb-8">
              {enrollment ? (
                <LessonPlayer
                  lessons={lessons}
                  userProgress={userProgress}
                  courseId={id!}
                  enrollment={enrollment}
                />
              ) : (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Course Preview</h3>
                    <p className="text-muted-foreground">Enroll to access full course content</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Badge className={getLevelColor((course as any).level)}>
                    {(course as any).level.charAt(0).toUpperCase() + (course as any).level.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    <span data-testid="course-duration">{(course as any).duration} Hours</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="mr-1 h-4 w-4 text-yellow-400" />
                    <span data-testid="course-rating">{parseFloat((course as any).rating || '0').toFixed(1)}</span>
                  </div>
                </div>

                <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-4" data-testid="course-title">
                  {(course as any).title}
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed" data-testid="course-description">
                  {(course as any).description}
                </p>
              </div>

              {/* Course Progress */}
              {enrollment && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Your Progress</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span data-testid="progress-percentage">{(enrollment as any).progress}%</span>
                      </div>
                      <Progress value={(enrollment as any).progress} className="h-2" />
                    </div>
                    {((enrollment as any).progress || 0) >= 100 && (
                      <div className="flex items-center mt-4 text-green-600">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        <span className="font-medium">Course Completed!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold mb-2" data-testid="course-price">
                    ${parseFloat(course.price).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">One-time payment</div>
                </div>

                {enrollment ? (
                  <div className="space-y-4">
                    <div className="text-center text-green-600 font-medium">
                      ✓ Enrolled
                    </div>
                    <Button asChild className="w-full">
                      <Link href="/dashboard" data-testid="go-to-dashboard">
                        Go to Dashboard
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      onClick={() => {
                        // Store course info for post-payment enrollment
                        localStorage.setItem('pendingCourseId', id!);
                        localStorage.setItem('pendingCourseTitle', (course as any).title);
                        // Build Stripe payment link with return URL
                        const currentUrl = window.location.origin;
                        const successUrl = `${currentUrl}/payment-success`;
                        const cancelUrl = `${currentUrl}/courses/${id}`;
                        // Redirect to Stripe payment link with success/cancel URLs
                        window.location.href = `https://buy.stripe.com/6oU5kF2zwfZq8T3dvQ67S01?success_url=${encodeURIComponent(successUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;
                      }}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      data-testid="enroll-button"
                    >
                      Enroll Now
                    </Button>
                    <div className="text-xs text-center text-muted-foreground">
                      30-day money-back guarantee
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Course Features */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm">{course.duration} hours of content</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm">Tag of completion</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-sm">Community access</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">About the Instructor</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="font-semibold text-primary">SA</span>
                  </div>
                  <div>
                    <div className="font-medium">Spiritual Academy</div>
                    <div className="text-sm text-muted-foreground">Certified Instructor</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Expert spiritual counselor with over 15 years of experience in holistic healing and consciousness development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
