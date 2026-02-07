import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [courseTitle, setCourseTitle] = useState<string>("");
  const [enrollmentComplete, setEnrollmentComplete] = useState(false);

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => apiRequest('POST', '/api/enroll', { courseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-enrollments'] });
      setEnrollmentComplete(true);
      // Clear pending course info
      localStorage.removeItem('pendingCourseId');
      localStorage.removeItem('pendingCourseTitle');
    },
    onError: (error: any) => {
      toast({
        title: "Enrollment Failed",
        description: error.message || "An error occurred during enrollment",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const pendingCourseId = localStorage.getItem('pendingCourseId');
    const pendingCourseTitle = localStorage.getItem('pendingCourseTitle');

    if (pendingCourseId && pendingCourseTitle) {
      setCourseTitle(pendingCourseTitle);
      // Automatically enroll the user
      enrollMutation.mutate(pendingCourseId);
    } else {
      // No pending enrollment, redirect to courses
      toast({
        title: "No Pending Enrollment",
        description: "Redirecting to courses...",
      });
      setTimeout(() => setLocation('/courses'), 2000);
    }
  }, []);

  if (enrollMutation.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
              <h1 className="text-2xl font-bold mb-2">Processing Your Enrollment</h1>
              <p className="text-muted-foreground">
                Please wait while we activate your course access...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (enrollmentComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4" data-testid="success-title">
                Payment Successful!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                You've been successfully enrolled in <strong>{courseTitle}</strong>
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => {
                    const courseId = localStorage.getItem('pendingCourseId');
                    localStorage.removeItem('pendingCourseId');
                    localStorage.removeItem('pendingCourseTitle');
                    setLocation(`/courses/${courseId}`);
                  }}
                  className="w-full"
                  data-testid="start-learning-button"
                >
                  Start Learning
                </Button>
                <Button 
                  onClick={() => setLocation('/dashboard')}
                  variant="outline"
                  className="w-full"
                  data-testid="go-to-dashboard"
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-16 w-16 text-primary mx-auto mb-6 animate-spin" />
            <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
