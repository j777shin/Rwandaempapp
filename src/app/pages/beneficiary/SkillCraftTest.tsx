import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { BookOpen, ExternalLink, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import { api } from "@/app/lib/api";

export function SkillCraftTest() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await api.getSkillcraftStatus();
      setStatus(data);
    } catch (err) {
      console.error("Failed to load SkillCraft status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      const result = await api.startSkillcraft();
      await loadStatus();
    } catch (err) {
      console.error("Failed to start SkillCraft:", err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.syncSkillcraft();
      await loadStatus();
    } catch (err) {
      console.error("Failed to sync SkillCraft:", err);
    } finally {
      setSyncing(false);
    }
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

  const score = status?.score;
  const hasStarted = !!status?.skillcraft_user_id;
  const isCompleted = score !== null && score !== undefined;

  return (
    <div className="p-8 space-y-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">SkillCraft Test</h1>
        <p className="text-muted-foreground">
          Complete the SkillCraft assessment to evaluate your skills and readiness
        </p>
      </div>

      {/* Status Card */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BookOpen className="w-6 h-6 text-primary" />
            Assessment Status
          </CardTitle>
          <CardDescription>Your SkillCraft test progress and results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isCompleted ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : hasStarted ? (
                <Clock className="w-8 h-8 text-yellow-600" />
              ) : (
                <BookOpen className="w-8 h-8 text-neutral-400" />
              )}
              <div>
                <p className="font-semibold text-foreground">
                  {isCompleted ? "Test Completed" : hasStarted ? "Test In Progress" : "Not Started"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isCompleted
                    ? `Last synced: ${status?.last_sync ? new Date(status.last_sync).toLocaleDateString() : "N/A"}`
                    : "Complete the test to receive your score"}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={
                isCompleted
                  ? "bg-green-50 text-green-700 border-green-300"
                  : hasStarted
                  ? "bg-yellow-50 text-yellow-700 border-yellow-300"
                  : "bg-neutral-50 text-neutral-600 border-neutral-300"
              }
            >
              {isCompleted ? "Completed" : hasStarted ? "In Progress" : "Not Started"}
            </Badge>
          </div>

          {/* Score Display */}
          {isCompleted && (
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Your Score</p>
              <p className="text-5xl font-bold text-primary">{score}</p>
              <p className="text-sm text-muted-foreground mt-1">out of 100</p>
              <Progress value={score} className="mt-4 h-3" />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {!hasStarted && (
              <Button onClick={handleStart} className="bg-primary hover:bg-primary/90">
                <ExternalLink className="w-4 h-4 mr-2" />
                Start SkillCraft Test
              </Button>
            )}
            {hasStarted && (
              <>
                <Button
                  variant="outline"
                  onClick={() => window.open(status?.external_status?.url, "_blank")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open SkillCraft Platform
                </Button>
                <Button onClick={handleSync} disabled={syncing} variant="outline">
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Syncing..." : "Sync Score"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">About SkillCraft</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            SkillCraft is a comprehensive skill assessment platform that evaluates your readiness
            for employment and entrepreneurship opportunities.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Evaluates technical and soft skills</li>
            <li>Provides personalized skill gap analysis</li>
            <li>Results contribute to your eligibility score</li>
            <li>Completion is required for Phase 1</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
