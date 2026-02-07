import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { 
  CreditCard, 
  Shield, 
  Check, 
  ArrowLeft,
  Clock,
  Tag,
  Users,
  Star
} from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Course } from "@shared/schema";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  type: 'course' | 'bundle' | 'subscription';
  courseId?: string;
  course?: Course;
}

function CheckoutForm({ type, courseId, course }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
        redirect: 'if_required',
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // If payment succeeds without redirect, handle enrollment
        if (type === 'course' && courseId) {
          await apiRequest('POST', '/api/enroll', { courseId });
        }
        
        queryClient.invalidateQueries({ queryKey: ['/api/my-enrollments'] });
        toast({
          title: "Payment Successful",
          description: type === 'subscription' ? "You are now subscribed!" : "Thank you for your purchase!",
        });
        setLocation('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/30 p-4 rounded-lg">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-lg font-semibold"
        data-testid="complete-payment-button"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Complete Payment
          </>
        )}
      </Button>
      
      <div className="flex items-center justify-center text-sm text-muted-foreground">
        <Shield className="mr-2 h-4 w-4" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
}

export default function Checkout() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [clientSecret, setClientSecret] = useState("");

  // Parse URL parameters
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const type = searchParams.get('type') || 'course';
  const courseId = searchParams.get('courseId');

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

  // Fetch course data if needed
  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['/api/courses', courseId],
    enabled: !!courseId && type === 'course',
  });

  // Create payment intent
  const createPaymentMutation = useMutation({
    mutationFn: async () => {
      if (type === 'subscription') {
        const response = await apiRequest('POST', '/api/create-subscription');
        return response.json();
      } else {
        const amount = getAmount();
        const response = await apiRequest('POST', '/api/create-payment-intent', { 
          amount, 
          courseId: type === 'course' ? courseId : undefined
        });
        return response.json();
      }
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
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
        title: "Payment Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize payment on mount
  useEffect(() => {
    if (isAuthenticated && !clientSecret && !createPaymentMutation.isPending) {
      createPaymentMutation.mutate();
    }
  }, [isAuthenticated, clientSecret]);

  const getAmount = () => {
    switch (type) {
      case 'course':
        return course ? parseFloat(course.price) : 129;
      case 'bundle':
        return 999;
      case 'subscription':
        return 49;
      default:
        return 129;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'course':
        return course ? course.title : 'Individual Course';
      case 'bundle':
        return 'Complete Course Bundle';
      case 'subscription':
        return 'Monthly Access';
      default:
        return 'Course Purchase';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'course':
        return course ? course.shortDescription || course.description : 'Single course access';
      case 'bundle':
        return 'All 12 courses + bonus materials';
      case 'subscription':
        return 'Monthly access to all courses';
      default:
        return 'Course access';
    }
  };

  const getFeatures = () => {
    const baseFeatures = [
      'Lifetime access',
      'Tag of completion',
      'Community access'
    ];

    switch (type) {
      case 'course':
        return course ? [
          `${course.duration} hours of content`,
          ...baseFeatures
        ] : baseFeatures;
      case 'bundle':
        return [
          'All 12 courses',
          '100+ hours of content',
          'All certificates',
          '1-on-1 mentorship call',
          'Bonus materials',
          'Priority support'
        ];
      case 'subscription':
        return [
          'Access to all courses',
          'New content monthly',
          'Cancel anytime',
          'Community access',
          'Email support'
        ];
      default:
        return baseFeatures;
    }
  };

  if (isLoading || (type === 'course' && courseLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-2xl"></div>
              <div className="h-96 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret && !createPaymentMutation.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center p-12">
            <h2 className="text-2xl font-bold mb-4">Payment Setup Failed</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't initialize the payment process. Please try again.
            </p>
            <Button asChild>
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const amount = getAmount();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/courses" data-testid="back-to-courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Link>
          </Button>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold" data-testid="checkout-title">
            Complete Your Purchase
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Course/Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg" data-testid="product-title">
                    {getTitle()}
                  </h3>
                  <p className="text-muted-foreground" data-testid="product-description">
                    {getDescription()}
                  </p>
                  {type === 'bundle' && (
                    <Badge className="mt-2 bg-primary/10 text-primary border-primary">
                      Save 35%
                    </Badge>
                  )}
                </div>

                {/* Course Image */}
                {course && (
                  <div className="relative">
                    <img 
                      src={course.imageUrl || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=200&fit=crop'} 
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 flex items-center bg-white/90 px-2 py-1 rounded">
                      <Star className="text-yellow-400 mr-1 h-3 w-3" />
                      <span className="text-xs font-medium">
                        {parseFloat(course.rating || '0').toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Features */}
              <div>
                <h4 className="font-medium mb-3">What's included:</h4>
                <ul className="space-y-2">
                  {getFeatures().map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="text-primary mr-2 h-4 w-4 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="subtotal">${amount.toFixed(2)}</span>
                </div>
                {type === 'bundle' && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Regular price</span>
                    <span className="line-through">$1,548.00</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span data-testid="total">
                    ${amount.toFixed(2)}
                    {type === 'subscription' && <span className="text-sm font-normal">/month</span>}
                  </span>
                </div>
              </div>

              {/* Money-back guarantee */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center text-sm">
                  <Shield className="text-primary mr-2 h-4 w-4" />
                  <span className="font-medium">30-day money-back guarantee</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Not satisfied? Get a full refund within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              {clientSecret ? (
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: 'hsl(151, 25%, 50%)',
                        colorBackground: 'hsl(0, 0%, 100%)',
                        colorText: 'hsl(220, 9%, 15%)',
                        colorDanger: 'hsl(356, 91%, 54%)',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        borderRadius: '0.75rem',
                      }
                    }
                  }}
                >
                  <CheckoutForm 
                    type={type as 'course' | 'bundle' | 'subscription'} 
                    courseId={courseId || undefined}
                    course={course}
                  />
                </Elements>
              ) : (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Setting up payment...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-6">Trusted by thousands of students worldwide</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-3xl">💳</div>
            <div className="text-3xl">🔒</div>
            <div className="text-3xl">✅</div>
          </div>
        </div>
      </div>
    </div>
  );
}
