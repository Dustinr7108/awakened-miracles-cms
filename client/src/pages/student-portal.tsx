import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Play, FileText, LogOut, Download } from "lucide-react";
import type { Course, Lesson } from "@shared/schema";

export default function StudentPortal() {
  const [, setLocation] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Check server-side session authentication
  const { data: sessionData, isLoading: sessionLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/student-portal/session"],
    retry: false,
  });

  // All hooks must be called before any conditional returns
  const { data: courses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: !!sessionData?.authenticated,
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/student-portal/lessons", selectedCourse],
    enabled: !!selectedCourse && !!sessionData?.authenticated,
  });

  useEffect(() => {
    if (!sessionLoading && !sessionData?.authenticated) {
      setLocation("/student-login");
    }
  }, [sessionData, sessionLoading, setLocation]);

  const handleLogout = async () => {
    await fetch("/api/student-portal/logout", { method: "POST" });
    setLocation("/");
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const sortedCourses = courses?.sort((a, b) => {
    const numA = parseInt(a.id.replace('course', ''));
    const numB = parseInt(b.id.replace('course', ''));
    return numA - numB;
  });

  const sortedLessons = lessons?.sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Awakened Miracles</h1>
              <p className="text-sm text-gray-500">Student Portal</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Student!</h2>
          <p className="text-gray-600">Access your Applied Spiritual Counseling course materials below.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Course Modules
                </CardTitle>
                <CardDescription>Select a course to view lessons</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-2">
                    {sortedCourses?.map((course, index) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course.id);
                          setSelectedLesson(null);
                        }}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedCourse === course.id
                            ? "bg-purple-100 border-2 border-purple-500"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                        }`}
                        data-testid={`button-course-${course.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{course.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.shortDescription || course.level}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {!selectedCourse ? (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center p-8">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Course</h3>
                  <p className="text-gray-500">Choose a course module from the left to view its lessons and materials.</p>
                </div>
              </Card>
            ) : selectedLesson ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{selectedLesson.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedLesson.duration ? `${selectedLesson.duration} minutes` : "Course Material"}
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedLesson(null)}
                      data-testid="button-back-to-lessons"
                    >
                      Back to Lessons
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {selectedLesson.videoUrl ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                          src={selectedLesson.videoUrl}
                          controls
                          className="w-full h-full"
                          data-testid="video-player"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="flex gap-3">
                        <Button asChild variant="outline" className="gap-2">
                          <a href={selectedLesson.videoUrl} download data-testid="button-download-video">
                            <Download className="w-4 h-4" />
                            Download Video
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose max-w-none">
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedLesson.description}</p>
                    </div>
                  )}
                  {selectedLesson.description && selectedLesson.videoUrl && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Lesson Description</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{selectedLesson.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">
                    {sortedCourses?.find(c => c.id === selectedCourse)?.title}
                  </CardTitle>
                  <CardDescription>
                    {sortedCourses?.find(c => c.id === selectedCourse)?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {sortedLessons && sortedLessons.length > 0 ? (
                    <div className="space-y-3">
                      {sortedLessons.map((lesson, index) => (
                        <button
                          key={lesson.id}
                          onClick={() => setSelectedLesson(lesson)}
                          className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-purple-50 border-2 border-transparent hover:border-purple-200 transition-all"
                          data-testid={`button-lesson-${lesson.id}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              {lesson.videoUrl ? (
                                <Play className="w-5 h-5 text-purple-600" />
                              ) : (
                                <FileText className="w-5 h-5 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-500">
                                {lesson.duration ? `${lesson.duration} min` : "Reading material"}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No lessons available for this course yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
