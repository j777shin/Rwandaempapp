import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, BarChart3, Building2, Briefcase, Loader2 } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api } from "@/app/lib/api";

export function Phase2Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [chatbotData, setChatbotData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, chatbot] = await Promise.all([
          api.adminGetPhase2Dashboard(),
          api.adminGetChatbotAnalytics(),
        ]);
        setDashboardData(dash);
        setChatbotData(chatbot);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = {
    blue: "#00A1DE",
    green: "#00A651",
    yellow: "#FAD201",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>Failed to load dashboard: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const emp = dashboardData?.employment_track || {};
  const ent = dashboardData?.entrepreneurship_track || {};
  const stageData = (chatbotData?.stage_completion || []).map((s: any) => ({
    stage: `Stage ${s.stage}`,
    completed: s.completed,
    remaining: s.total - s.completed,
  }));

  const readinessData = Object.entries(chatbotData?.readiness_distribution || {}).map(([level, count]) => ({
    level,
    count: count as number,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00A1DE] to-[#00A651] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Phase 2 Dashboard</h1>
              <p className="text-muted-foreground">Employment & Entrepreneurship Track Analytics</p>
            </div>
          </div>
          <Badge variant="outline" className="border-[#00A651] text-[#00A651]">Phase 2 - Track Phase</Badge>
        </div>

        <Tabs defaultValue="employment" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="employment" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Employment Track
            </TabsTrigger>
            <TabsTrigger value="entrepreneurship" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Entrepreneurship Track
            </TabsTrigger>
          </TabsList>

          {/* Employment Track Tab */}
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-[#00A1DE]" />
                  <div>
                    <CardTitle>Employment Track Analytics</CardTitle>
                    <CardDescription>{emp.total?.toLocaleString() || 0} beneficiaries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Total in Track</p>
                      <p className="text-3xl font-bold text-[#00A1DE]">{emp.total?.toLocaleString() || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Hired</p>
                      <p className="text-3xl font-bold text-[#00A651]">{emp.hired?.toLocaleString() || 0}</p>
                      <p className="text-xs text-muted-foreground">
                        {((emp.hire_rate || 0) * 100).toFixed(1)}% hire rate
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Not Yet Hired</p>
                      <p className="text-3xl font-bold text-muted-foreground">
                        {((emp.total || 0) - (emp.hired || 0)).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Entrepreneurship Track Tab */}
          <TabsContent value="entrepreneurship">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-[#00A651]" />
                    <div>
                      <CardTitle>Entrepreneurship Track Analytics</CardTitle>
                      <CardDescription>{ent.total?.toLocaleString() || 0} beneficiaries</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total in Track</p>
                        <p className="text-3xl font-bold text-[#00A651]">{ent.total?.toLocaleString() || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Reports Completed</p>
                        <p className="text-3xl font-bold text-[#00A1DE]">{ent.reports_completed?.toLocaleString() || 0}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                        <p className="text-3xl font-bold text-[#FAD201]">
                          {ent.avg_score?.toFixed(1) ?? "N/A"}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Self-Employed</p>
                        <p className="text-3xl font-bold text-[#00A651]">{ent.self_employed?.toLocaleString() || 0}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Stage Completion */}
                    <div>
                      <h3 className="font-semibold mb-4 text-[#00A651]">Stage Completion</h3>
                      {stageData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={stageData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="stage" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="completed" fill={COLORS.green} name="Completed" />
                            <Bar dataKey="remaining" fill={COLORS.yellow} name="Remaining" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No stage data yet</p>
                      )}
                    </div>

                    {/* Readiness Distribution */}
                    <div>
                      <h3 className="font-semibold mb-4 text-[#00A1DE]">Readiness Distribution</h3>
                      {readinessData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={readinessData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="level" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill={COLORS.blue} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No readiness data yet</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
