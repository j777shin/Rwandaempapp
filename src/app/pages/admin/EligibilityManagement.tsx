import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Users, CheckCircle2, XCircle, TrendingUp, Loader2 } from "lucide-react";
import { Slider } from "@/app/components/ui/slider";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";
import { api } from "@/app/lib/api";

export function EligibilityManagement() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cutoffScore, setCutoffScore] = useState([13]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.adminGetEligibilityStats();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load eligibility data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
              <p>Failed to load data: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const distribution = (data?.distribution || []).map((bucket: any) => ({
    range: bucket.range,
    count: bucket.count,
  }));

  // Parse range strings to calculate pass/fail based on cutoff
  const chartData = distribution.map((item: any) => {
    const rangeParts = item.range.split("-");
    const low = parseFloat(rangeParts[0]);
    return {
      ...item,
      passed: low >= cutoffScore[0] ? item.count : 0,
      failed: low < cutoffScore[0] ? item.count : 0,
    };
  });

  const totalCandidates = data?.total_scored || 0;
  const passedCandidates = chartData.reduce((sum: number, item: any) => sum + item.passed, 0);
  const failedCandidates = totalCandidates - passedCandidates;
  const passRate = totalCandidates > 0 ? ((passedCandidates / totalCandidates) * 100).toFixed(1) : "0";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="space-y-6">
          {/* Header */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Eligibility Score Management</CardTitle>
              <CardDescription>
                View score distribution and adjust eligibility cutoff
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Scored
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCandidates.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {data?.avg_score?.toFixed(2) ?? "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Passing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{passedCandidates.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{passRate}% of total</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Not Passing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{failedCandidates.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">{(100 - parseFloat(passRate)).toFixed(1)}% of total</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Score Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {data?.min_score?.toFixed(1) ?? "?"} - {data?.max_score?.toFixed(1) ?? "?"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Min - Max</p>
              </CardContent>
            </Card>
          </div>

          {/* Cutoff Adjuster */}
          <Card>
            <CardHeader>
              <CardTitle>Adjust Eligibility Cutoff Score</CardTitle>
              <CardDescription>
                Move the slider to dynamically adjust the minimum eligibility score
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg">Cutoff Score: <span className="text-2xl font-bold text-primary">{cutoffScore[0]}</span></Label>
                  <Badge variant="outline" className="text-base px-4 py-1">
                    {passedCandidates.toLocaleString()} candidates pass
                  </Badge>
                </div>
                <Slider
                  value={cutoffScore}
                  onValueChange={setCutoffScore}
                  min={Math.floor(data?.min_score || 0)}
                  max={Math.ceil(data?.max_score || 20)}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{Math.floor(data?.min_score || 0)}</span>
                  <span>{Math.ceil(data?.max_score || 20)}</span>
                </div>
              </div>

              {cutoffScore[0] < (data?.avg_score || 13) * 0.7 && (
                <Alert className="border-red-500 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertTitle>Low Cutoff Score</AlertTitle>
                  <AlertDescription>
                    A cutoff well below average may result in selecting candidates with insufficient readiness
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Score Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>
                Distribution of candidates by score range with pass/fail visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="range"
                      label={{ value: "Score Range", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Number of Candidates", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const d = payload[0].payload;
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
                              <p className="font-semibold">Score Range: {d.range}</p>
                              <p className="text-primary">Passing: {d.passed.toLocaleString()}</p>
                              <p className="text-red-500">Failing: {d.failed.toLocaleString()}</p>
                              <p className="font-semibold mt-2">Total: {d.count.toLocaleString()}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="passed" stackId="a" fill="#10b981" name="Passing" />
                    <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Not Passing" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No score data available</p>
              )}
            </CardContent>
          </Card>

          {/* Cumulative Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Score Distribution</CardTitle>
              <CardDescription>
                Overall distribution curve showing candidate concentration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="range"
                      label={{ value: "Score Range", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Number of Candidates", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                      name="Candidates"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No score data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
