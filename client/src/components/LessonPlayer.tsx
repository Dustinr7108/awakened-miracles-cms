import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import VideoPlayer from "./VideoPlayer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Lesson, LessonProgress } from "@shared/schema";

interface LessonPlayerProps {
  lessons: Lesson[];
  userProgress: LessonProgress[];
  courseId: string;
  enrollment: any;
}

export default function LessonPlayer({ lessons, userProgress, courseId }: LessonPlayerProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const lastSavedSecond = useRef(0);
  const { toast } = useToast();

  const currentLesson = lessons[currentLessonIndex];
  const currentProgress = userProgress.find(p => p.lessonId === currentLesson?.id);

  // Reset progress tracking when switching lessons
  useEffect(() => {
    setWatchTime(0);
    lastSavedSecond.current = 0;
  }, [currentLessonIndex]);

  // Update lesson progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async ({ lessonId, watchTime, completed }: { lessonId: string; watchTime: number; completed: boolean }) => {
      return await apiRequest('POST', '/api/progress/lesson', {
        lessonId,
        watchTime,
        completed
      });
    },
    onSuccess: (data, variables) => {
      // Always invalidate course progress
      queryClient.invalidateQueries({ queryKey: ['/api/progress/course', courseId] });
      
      // Only invalidate enrollments on lesson completion to reduce backend load
      if (variables.completed) {
        queryClient.invalidateQueries({ queryKey: ['/api/my-enrollments'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle video progress updates
  const handleVideoProgress = (currentTime: number, duration: number) => {
    setWatchTime(currentTime);
    
    // Update progress every 10 seconds of watch time (throttled)
    const currentSecondBucket = Math.floor(currentTime / 10) * 10;
    if (currentSecondBucket > lastSavedSecond.current && currentTime > 0 && currentLesson) {
      lastSavedSecond.current = currentSecondBucket;
      updateProgressMutation.mutate({
        lessonId: currentLesson.id,
        watchTime: Math.floor(currentTime),
        completed: false
      });
    }
  };

  // Handle lesson completion
  const handleLessonComplete = () => {
    if (currentLesson) {
      updateProgressMutation.mutate({
        lessonId: currentLesson.id,
        watchTime: Math.floor(watchTime),
        completed: true
      });

      toast({
        title: "Lesson completed!",
        description: `You've finished "${currentLesson.title}"`,
      });

      // Auto-advance to next lesson if available
      if (currentLessonIndex < lessons.length - 1) {
        setTimeout(() => {
          setCurrentLessonIndex(currentLessonIndex + 1);
        }, 2000);
      }
    }
  };

  const getLessonProgress = (lesson: Lesson) => {
    const progress = userProgress.find(p => p.lessonId === lesson.id);
    return progress;
  };

  const isLessonUnlocked = (lessonIndex: number) => {
    // First lesson is always unlocked
    if (lessonIndex === 0) return true;
    
    // Check if previous lesson is completed OR is a resource-only lesson (no video)
    const previousLesson = lessons[lessonIndex - 1];
    const previousProgress = userProgress.find(p => p.lessonId === previousLesson.id);
    
    // If previous lesson has no video URL, consider it always accessible/completed
    const isResourceOnlyLesson = !previousLesson.videoUrl;
    
    return previousProgress?.completed || isResourceOnlyLesson;
  };

  if (!lessons.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Lessons Available</h3>
          <p className="text-muted-foreground">This course content is coming soon.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Video Player */}
      <div>
        <VideoPlayer
          src={currentLesson.videoUrl || 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'}
          onProgress={handleVideoProgress}
          onComplete={handleLessonComplete}
          className="aspect-video"
          data-testid="lesson-video"
        />
        
        {/* Current Lesson Info */}
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2" data-testid="current-lesson-title">
            {currentLesson.title}
          </h3>
          {currentLesson.description && (
            <p className="text-muted-foreground mb-4" data-testid="current-lesson-description">
              {currentLesson.description}
            </p>
          )}
          
          {/* Progress for current lesson */}
          {currentProgress && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span>Watch time</span>
                  <span>{Math.floor((currentProgress.watchTime || 0) / 60)}m {(currentProgress.watchTime || 0) % 60}s</span>
                </div>
                <Progress 
                  value={currentProgress.completed ? 100 : (currentLesson.duration && currentLesson.duration > 0) ? Math.min((currentProgress.watchTime || 0) / (currentLesson.duration * 60) * 100, 100) : 0} 
                  className="h-2"
                />
              </div>
              {currentProgress.completed && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lesson List */}
      <Card>
        <CardHeader>
          <CardTitle>Course Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              const progress = getLessonProgress(lesson);
              const isUnlocked = isLessonUnlocked(index);
              const isCurrent = index === currentLessonIndex;
              
              return (
                <Button
                  key={lesson.id}
                  variant={isCurrent ? "default" : "ghost"}
                  className={`w-full justify-start h-auto p-4 ${!isUnlocked ? 'opacity-50' : ''}`}
                  onClick={() => isUnlocked && setCurrentLessonIndex(index)}
                  disabled={!isUnlocked}
                  data-testid={`lesson-${index}`}
                >
                  <div className="flex items-center w-full">
                    <div className="mr-3">
                      {!isUnlocked ? (
                        <Lock className="h-5 w-5" />
                      ) : progress?.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <PlayCircle className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {lesson.duration} minutes
                        {progress?.completed && " • Completed"}
                        {progress && !progress.completed && ` • ${Math.floor((progress.watchTime || 0) / 60)}m watched`}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}