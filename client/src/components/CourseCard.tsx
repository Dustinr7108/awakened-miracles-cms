import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Play } from "lucide-react";
import { Link } from "wouter";
import type { Course } from "@shared/schema";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
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

export default function CourseCard({ course, isEnrolled }: CourseCardProps) {
  return (
    <Card className="rounded-2xl shadow-lg border border-border overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative">
        <img 
          src={course.imageUrl || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=300&fit=crop'} 
          alt={course.title} 
          className="w-full h-48 object-cover" 
        />
        <Badge className={`absolute top-4 left-4 ${getLevelColor(course.level)}`}>
          {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
        </Badge>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white/20 backdrop-blur-sm rounded-full w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            data-testid={`play-preview-${course.id}`}
          >
            <Play className="text-white h-6 w-6" />
          </Button>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-primary font-medium">
            <Clock className="mr-1 h-4 w-4" />
            <span data-testid={`course-duration-${course.id}`}>{course.duration} Hours</span>
          </div>
          <div className="flex items-center">
            <Star className="text-yellow-400 mr-1 h-4 w-4" />
            <span className="text-sm font-medium" data-testid={`course-rating-${course.id}`}>
              {parseFloat(course.rating || '0').toFixed(1)}
            </span>
          </div>
        </div>
        <h3 className="font-serif text-xl font-semibold mb-3 group-hover:text-primary transition-colors" data-testid={`course-title-${course.id}`}>
          {course.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`course-description-${course.id}`}>
          {course.shortDescription || course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg" data-testid={`course-price-${course.id}`}>
            ${parseFloat(course.price).toFixed(0)}
          </span>
          {isEnrolled ? (
            <Button asChild className="px-4 py-2 bg-accent text-accent-foreground rounded-full hover:bg-accent/90 transition-colors font-medium text-sm">
              <Link href={`/course/${course.id}`} data-testid={`continue-course-${course.id}`}>
                Continue
              </Link>
            </Button>
          ) : (
            <Button asChild className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium text-sm">
              <Link href={`/course/${course.id}`} data-testid={`enroll-course-${course.id}`}>
                Enroll Now
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
