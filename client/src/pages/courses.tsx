import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Course, Enrollment } from "@shared/schema";

export default function Courses() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  const { data: enrollments } = useQuery({
    queryKey: ['/api/my-enrollments'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const enrolledCourseIds = new Set((enrollments as any)?.map((e: Enrollment & { course: Course }) => e.courseId) || []);

  const filteredCourses = (courses as any)?.filter((course: Course) => {
    const matchesFilter = activeFilter === 'all' || course.level === activeFilter;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const filterButtons = [
    { id: 'all', label: 'All Courses' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-4" data-testid="page-title">
            Spiritual Counseling Courses
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive courses designed to deepen your understanding and enhance your counseling practice.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted border-none"
              data-testid="course-search"
            />
          </div>
        </div>

        {/* Course Filters */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {filterButtons.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              variant={activeFilter === filter.id ? "default" : "secondary"}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
              }`}
              data-testid={`filter-${filter.id}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="courses-grid">
            {filteredCourses.map((course: Course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isEnrolled={enrolledCourseIds.has(course.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-muted-foreground mb-4" data-testid="no-courses-message">
              No courses found matching your criteria.
            </div>
            <Button 
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              variant="outline"
              data-testid="clear-filters"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Course Stats */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div data-testid="total-courses">
              <div className="text-3xl font-bold text-primary mb-2">{(courses as any)?.length || 0}</div>
              <div className="text-muted-foreground">Total Courses</div>
            </div>
            <div data-testid="enrolled-count">
              <div className="text-3xl font-bold text-primary mb-2">{(enrollments as any)?.length || 0}</div>
              <div className="text-muted-foreground">Enrolled</div>
            </div>
            <div data-testid="total-hours">
              <div className="text-3xl font-bold text-primary mb-2">
                {(courses as any)?.reduce((acc: number, course: Course) => acc + course.duration, 0) || 0}+
              </div>
              <div className="text-muted-foreground">Hours of Content</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
