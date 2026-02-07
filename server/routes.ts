import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
// import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { insertCourseSchema, insertEnrollmentSchema, insertLessonProgressSchema } from "@shared/schema";
import { z } from "zod";

// Stripe is optional - payments won't work without it

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // Object storage routes disabled (not using Replit storage)

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });


  // Enrollment routes
  app.post('/api/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const { courseId } = req.body;
      const userId = req.user.claims.sub;

      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(userId, courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      const enrollment = await storage.enrollUser({ userId, courseId });
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling user:", error);
      res.status(500).json({ message: "Failed to enroll user" });
    }
  });

  app.get('/api/my-enrollments', isAuthenticated, async (req: any, res) => {
    try {
      const enrollments = await storage.getUserEnrollments(req.user.claims.sub);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  // Progress tracking
  app.post('/api/progress/lesson', isAuthenticated, async (req: any, res) => {
    try {
      const progressData = insertLessonProgressSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });

      // Verify user is enrolled in the course containing this lesson
      const lesson = await storage.getLessonById(progressData.lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      const enrollment = await storage.getEnrollment(req.user.claims.sub, lesson.courseId);
      if (!enrollment) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }

      const progress = await storage.updateLessonProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  app.get('/api/progress/course/:courseId', isAuthenticated, async (req: any, res) => {
    try {
      const progress = await storage.getUserCourseProgress(req.user.claims.sub, req.params.courseId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Get lessons for a course (authenticated users only)
  app.get('/api/courses/:courseId/lessons', isAuthenticated, async (req: any, res) => {
    try {
      // Verify user is enrolled in the course
      const enrollment = await storage.getEnrollment(req.user.claims.sub, req.params.courseId);
      if (!enrollment) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }
      
      const lessons = await storage.getCourseLessons(req.params.courseId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching course lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, courseId } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          courseId: courseId || '',
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;

      if (user.claims.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.claims.stripeSubscriptionId);
        res.json({
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
        });
        return;
      }

      if (!user.claims.email) {
        throw new Error('No user email on file');
      }

      let customer;
      if (user.claims.stripeCustomerId) {
        customer = await stripe.customers.retrieve(user.claims.stripeCustomerId);
      } else {
        customer = await stripe.customers.create({
          email: user.claims.email,
          name: `${user.claims.first_name || ''} ${user.claims.last_name || ''}`.trim(),
        });
        await storage.updateUserStripeInfo(user.claims.sub, customer.id);
      }

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Spiritual Academy Monthly Access',
            },
            unit_amount: 4900, // $49.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.claims.sub, customer.id, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      console.error("Subscription error:", error);
      res.status(400).json({ error: { message: error.message } });
    }
  });

  // Webhook for handling completed payments
  app.post('/api/webhook/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const courseId = paymentIntent.metadata?.courseId;
      
      if (courseId) {
        // Handle course enrollment after successful payment
        // You would need to identify the user from the payment intent
        console.log('Payment succeeded for course:', courseId);
      }
    }

    res.json({ received: true });
  });

  // Student Portal Routes (password-protected with server-side session)
  app.post('/api/student-portal/verify', (req: any, res) => {
    const { password } = req.body;
    const correctPassword = process.env.STUDENT_PORTAL_PASSWORD;

    if (!correctPassword) {
      console.error("STUDENT_PORTAL_PASSWORD not set");
      return res.status(500).json({ message: "Portal not configured" });
    }

    if (password === correctPassword) {
      // Store student portal access in server-side session
      req.session.studentPortalAccess = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ message: "Invalid password" });
    }
  });

  // Check student portal session status
  app.get('/api/student-portal/session', (req: any, res) => {
    if (req.session?.studentPortalAccess) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  // Logout from student portal
  app.post('/api/student-portal/logout', (req: any, res) => {
    if (req.session) {
      req.session.studentPortalAccess = false;
    }
    res.json({ success: true });
  });

  // Middleware to check student portal access
  const isStudentAuthenticated = (req: any, res: any, next: any) => {
    if (req.session?.studentPortalAccess) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized - please login to student portal" });
  };

  // Get all lessons for student portal (protected by student session)
  app.get('/api/student-portal/lessons/:courseId', isStudentAuthenticated, async (req, res) => {
    try {
      const lessons = await storage.getCourseLessons(req.params.courseId);
      res.json(lessons);
    } catch (error) {
      console.error("Error fetching course lessons:", error);
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
