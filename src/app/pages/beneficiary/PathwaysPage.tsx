import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Route, RefreshCw, CheckCircle2, BookOpen, ChevronDown, Play } from "lucide-react";
import { api } from "@/app/lib/api";

const ELEARNING_URL = "http://localhost:3000";

interface CourseProgress {
  course_name: string;
  order_number: number;
  completed: boolean;
}

interface PathwayProgress {
  pathway_name: string;
  order_number: number;
  courses: Record<string, CourseProgress>;
}

export function PathwaysPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [iframeOpen, setIframeOpen] = useState(false);
  const [iframeUrl, setIframeUrl] = useState("");
  const [iframeTitle, setIframeTitle] = useState("");

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await api.getPathwaysStatus();
      setStatus(data);
    } catch (err) {
      console.error("Failed to load Pathways status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await api.enrollPathways();
      await loadStatus();
    } catch (err) {
      console.error("Failed to enroll:", err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.syncPathways();
      await loadStatus();
    } catch (err) {
      console.error("Failed to sync:", err);
    } finally {
      setSyncing(false);
    }
  };

  const openPathway = (pathwayId: string, pathwayName: string) => {
    setIframeUrl(`${ELEARNING_URL}/pathway/${pathwayId}`);
    setIframeTitle(pathwayName);
    setIframeOpen(true);
  };

  const handleIframeClose = async () => {
    setIframeOpen(false);
    // Auto-sync progress when closing the learning iframe
    await handleSync();
  };

  if (loading) {
    return (
      <div className="p-8 bg-background">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-48 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isEnrolled = !!status?.pathways_user_id;
  const completionRate = status?.completion_rate ?? 0;
  const externalProgress = status?.external_progress;
  const courseProgress: Record<string, PathwayProgress> = status?.course_progress || {};

  // Sort pathways by order_number
  const sortedPathways = Object.entries(courseProgress).sort(
    ([, a], [, b]) => (a.order_number || 0) - (b.order_number || 0)
  );

  // Count totals across all pathways
  const allCourses = sortedPathways.flatMap(([, pw]) => Object.values(pw.courses));
  const totalCourses = allCourses.length;
  const completedCourses = allCourses.filter((c) => c.completed).length;

  return (
    <div className="p-8 space-y-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pathways eLearning</h1>
        <p className="text-muted-foreground">
          Complete online learning modules to build your skills for employment and entrepreneurship
        </p>
      </div>

      {/* Progress Card */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Route className="w-6 h-6 text-primary" />
            Learning Progress
          </CardTitle>
          <CardDescription>Your Pathways eLearning completion status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {completionRate >= 100 ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : isEnrolled ? (
                <BookOpen className="w-8 h-8 text-blue-600" />
              ) : (
                <Route className="w-8 h-8 text-neutral-400" />
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {completionRate >= 100
                    ? "All Courses Completed"
                    : isEnrolled
                    ? "Learning In Progress"
                    : "Not Enrolled"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isEnrolled
                    ? `${completedCourses} of ${totalCourses || externalProgress?.total_modules || 0} courses completed`
                    : "Enroll to start your learning journey"}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                completionRate >= 100
                  ? "bg-green-50 text-green-700 border-green-300"
                  : isEnrolled
                  ? "bg-blue-50 text-blue-700 border-blue-300"
                  : "bg-neutral-50 text-neutral-600 border-neutral-300"
              }
            >
              {completionRate >= 100 ? "Completed" : isEnrolled ? `${completionRate}%` : "Not Enrolled"}
            </Badge>
          </div>

          {/* Progress Bar */}
          {isEnrolled && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Overall Completion</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!isEnrolled && (
              <Button onClick={handleEnroll} className="bg-primary hover:bg-primary/90">
                <BookOpen className="w-4 h-4 mr-2" />
                Enroll in Pathways
              </Button>
            )}
            {isEnrolled && (
              <Button onClick={handleSync} disabled={syncing} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync Progress"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pathways & Courses List */}
      {isEnrolled && sortedPathways.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Courses</h2>
          {sortedPathways.map(([pathwayId, pathway]) => {
            const courses = Object.entries(pathway.courses).sort(
              ([, a], [, b]) => (a.order_number || 0) - (b.order_number || 0)
            );
            const pwCompleted = courses.filter(([, c]) => c.completed).length;

            return (
              <Card key={pathwayId} className="border-border bg-white">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{pathway.pathway_name}</CardTitle>
                        <CardDescription>
                          {pwCompleted} of {courses.length} courses completed
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={courses.length > 0 ? (pwCompleted / courses.length) * 100 : 0}
                          className="w-24 h-2"
                        />
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-2">
                      {courses.map(([courseId, course]) => (
                        <div
                          key={courseId}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => openPathway(pathwayId, pathway.pathway_name)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                course.completed
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {course.completed ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                course.order_number
                              )}
                            </div>
                            <span className="font-medium text-sm">{course.course_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={
                                course.completed
                                  ? "bg-green-50 text-green-700 border-green-300"
                                  : "bg-gray-50 text-gray-500 border-gray-300"
                              }
                            >
                              {course.completed ? "Completed" : "Not Started"}
                            </Badge>
                            {!course.completed && <Play className="w-4 h-4 text-primary" />}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      )}

      {/* Fallback when no course data yet */}
      {isEnrolled && sortedPathways.length === 0 && (
        <Card className="border-border bg-white">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-3">
              No course data available yet. Click "Sync Progress" to fetch your courses from the learning platform.
            </p>
            <Button onClick={handleSync} disabled={syncing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Progress"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* E-Learning Iframe Sheet */}
      <Sheet open={iframeOpen} onOpenChange={(open) => { if (!open) handleIframeClose(); }}>
        <SheetContent side="right" className="w-full sm:max-w-[90vw] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>{iframeTitle || "Pathways eLearning"}</SheetTitle>
          </SheetHeader>
          <iframe
            src={iframeUrl}
            className="w-full h-[calc(100vh-60px)]"
            title="Pathways eLearning"
            allow="fullscreen"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
