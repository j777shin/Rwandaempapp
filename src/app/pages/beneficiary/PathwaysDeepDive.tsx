import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Route, ExternalLink, RefreshCw, Briefcase } from "lucide-react";
import { api } from "@/app/lib/api";

export function PathwaysDeepDive() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

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

  return (
    <div className="p-8 space-y-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pathways Deep Dive</h1>
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
            Advanced Learning Progress
          </CardTitle>
          <CardDescription>
            Continue building your skills for employment readiness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Overall Completion</span>
              <span>{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-primary">
                {externalProgress?.modules_completed || 0}
              </p>
              <p className="text-sm text-muted-foreground">Modules Completed</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-foreground">
                {(externalProgress?.total_modules || 10) - (externalProgress?.modules_completed || 0)}
              </p>
              <p className="text-sm text-muted-foreground">Remaining</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(externalProgress?.url, "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Continue Learning
            </Button>
            <Button onClick={handleSync} disabled={syncing} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync Progress"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">Employment Track Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            The employment track deep dive focuses on advanced skills that prepare you
            for the job market. Complete all modules to maximize your readiness.
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Advanced technical skill modules</li>
            <li>Job readiness and interview preparation</li>
            <li>Industry-specific knowledge</li>
            <li>Workplace communication and soft skills</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
