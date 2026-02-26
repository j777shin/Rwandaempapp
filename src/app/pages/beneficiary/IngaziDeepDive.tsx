import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/app/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Route, RefreshCw, CheckCircle2, BookOpen, ChevronDown, Play, Briefcase } from "lucide-react";
import { api } from "@/app/lib/api";

const ELEARNING_URL = "http://localhost:3000";

interface CourseProgress {
  course_name: string;
  order_number: number;
  completed: boolean;
}

interface IngaziProgress {
  pathway_name: string;
  order_number: number;
  courses: Record<string, CourseProgress>;
}

export function IngaziDeepDive() {
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
      const data = await api.getIngaziStatus();
      setStatus(data);
    } catch (err) {
      console.error("Failed to load Ingazi status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.syncIngazi();
      await loadStatus();
    } catch (err) {
      console.error("Failed to sync:", err);
    } finally {
      setSyncing(false);
    }
  };

  const openIngazi = (ingaziId: string, ingaziName: string) => {
    setIframeUrl(`${ELEARNING_URL}/pathway/${ingaziId}`);
    setIframeTitle(ingaziName);
    setIframeOpen(true);
  };

  const handleIframeClose = async () => {
    setIframeOpen(false);
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

  const completionRate = status?.completion_rate ?? 0;
  const externalProgress = status?.external_progress;
  const courseProgress: Record<string, IngaziProgress> = status?.course_progress || {};

  // Sort ingazi paths by order_number
  const sortedPaths = Object.entries(courseProgress).sort(
    ([, a], [, b]) => (a.order_number || 0) - (b.order_number || 0)
  );

  // Count totals across all paths
  const allCourses = sortedPaths.flatMap(([, pw]) => Object.values(pw.courses));
  const totalCourses = allCourses.length;
  const completedCourses = allCourses.filter((c) => c.completed).length;

  return (
    <div className="p-8 space-y-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">eLearning- Ingazi</h1>
        <p className="text-muted-foreground">
          Phase 2 Employment Track: Continue your advanced learning journey
        </p>
      </div>

      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
        <Briefcase className="w-3 h-3 mr-1" /> Employment Track
      </Badge>

      {/* Progress Card */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Route className="w-6 h-6 text-primary" />
            Learning Progress
          </CardTitle>
          <CardDescription>Your eLearning- Ingazi completion status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {completionRate >= 100 ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <BookOpen className="w-8 h-8 text-blue-600" />
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {completionRate >= 100
                    ? "All Courses Completed"
                    : "Learning In Progress"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {completedCourses} of {totalCourses || externalProgress?.total_modules || 0} courses completed
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                completionRate >= 100
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-blue-50 text-blue-700 border-blue-300"
              }
            >
              {completionRate >= 100 ? "Completed" : `${completionRate}%`}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Completion</span>
              <span>{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          {/* Sync Button */}
          <div className="flex gap-3">
            <Button onClick={handleSync} disabled={syncing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Progress"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Courses List */}
      {sortedPaths.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Courses</h2>
          {sortedPaths.map(([pathId, path]) => {
            const courses = Object.entries(path.courses).sort(
              ([, a], [, b]) => (a.order_number || 0) - (b.order_number || 0)
            );
            const pwCompleted = courses.filter(([, c]) => c.completed).length;

            return (
              <Card key={pathId} className="border-border bg-white">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{path.pathway_name}</CardTitle>
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
                          onClick={() => openIngazi(pathId, path.pathway_name)}
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
      {sortedPaths.length === 0 && (
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
            <SheetTitle>{iframeTitle || "eLearning- Ingazi"}</SheetTitle>
          </SheetHeader>
          <iframe
            src={iframeUrl}
            className="w-full h-[calc(100vh-60px)]"
            title="eLearning- Ingazi"
            allow="fullscreen"
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
