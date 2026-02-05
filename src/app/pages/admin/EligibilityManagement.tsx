import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Users, CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import { Slider } from "@/app/components/ui/slider";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";

// Mock data - distribution of eligibility scores
const generateScoreDistribution = () => {
  const distribution = [];
  for (let i = 0; i <= 100; i += 5) {
    // Generate a realistic distribution with more scores in the 60-80 range
    let count;
    if (i >= 60 && i <= 80) {
      count = Math.floor(Math.random() * 800) + 600;
    } else if (i >= 40 && i < 60) {
      count = Math.floor(Math.random() * 500) + 300;
    } else if (i > 80 && i <= 95) {
      count = Math.floor(Math.random() * 400) + 200;
    } else {
      count = Math.floor(Math.random() * 200) + 50;
    }
    distribution.push({
      score: i,
      count: count,
      range: `${i}-${i + 4}`
    });
  }
  return distribution;
};

export function EligibilityManagement() {
  const [cutoffScore, setCutoffScore] = useState([70]);
  const scoreDistribution = generateScoreDistribution();
  
  // Calculate statistics based on cutoff
  const totalCandidates = scoreDistribution.reduce((sum, item) => sum + item.count, 0);
  const passedCandidates = scoreDistribution
    .filter(item => item.score >= cutoffScore[0])
    .reduce((sum, item) => sum + item.count, 0);
  const failedCandidates = totalCandidates - passedCandidates;
  const passRate = ((passedCandidates / totalCandidates) * 100).toFixed(1);
  
  // Prepare data with pass/fail coloring
  const chartData = scoreDistribution.map(item => ({
    ...item,
    passed: item.score >= cutoffScore[0] ? item.count : 0,
    failed: item.score < cutoffScore[0] ? item.count : 0,
  }));

  const handleApplyCutoff = () => {
    // In production, this would update the backend
    alert(`Eligibility cutoff score updated to ${cutoffScore[0]}`);
  };

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
          <Card className="border-l-4 border-l-[#00A1DE]">
            <CardHeader>
              <CardTitle className="text-2xl">Eligibility Score Management</CardTitle>
              <CardDescription>
                Adjust the eligibility score cutoff and view the impact on candidate selection
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-[#00A1DE]">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalCandidates.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">All registered</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#00A651]">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A651]" />
                  Passing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#00A651]">{passedCandidates.toLocaleString()}</div>
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

            <Card className="border-l-4 border-l-[#FAD201]">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#FAD201]" />
                  Current Cutoff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#FAD201]">{cutoffScore[0]}</div>
                <p className="text-xs text-muted-foreground mt-1">Minimum score</p>
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
                  <Label className="text-lg">Cutoff Score: <span className="text-2xl font-bold text-[#00A1DE]">{cutoffScore[0]}</span></Label>
                  <Badge variant="outline" className="text-base px-4 py-1">
                    {passedCandidates.toLocaleString()} candidates pass
                  </Badge>
                </div>
                <Slider
                  value={cutoffScore}
                  onValueChange={setCutoffScore}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              {cutoffScore[0] < 50 && (
                <Alert className="border-red-500 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertTitle>Low Cutoff Score</AlertTitle>
                  <AlertDescription>
                    A cutoff below 50 may result in selecting candidates with insufficient readiness
                  </AlertDescription>
                </Alert>
              )}

              {cutoffScore[0] > 85 && (
                <Alert className="border-yellow-500 bg-yellow-50">
                  <AlertTitle>High Cutoff Score</AlertTitle>
                  <AlertDescription>
                    A cutoff above 85 may exclude many qualified candidates. Only {passedCandidates.toLocaleString()} candidates will pass.
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleApplyCutoff} 
                className="w-full bg-[#00A651] hover:bg-[#008641]"
              >
                Apply Cutoff Score
              </Button>
            </CardContent>
          </Card>

          {/* Score Distribution Chart - Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution - Pass/Fail View</CardTitle>
              <CardDescription>
                Distribution of candidates by score range with pass/fail visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="range" 
                    label={{ value: 'Score Range', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis label={{ value: 'Number of Candidates', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
                            <p className="font-semibold">Score Range: {data.range}</p>
                            <p className="text-[#00A651]">Passing: {data.passed.toLocaleString()}</p>
                            <p className="text-red-500">Failing: {data.failed.toLocaleString()}</p>
                            <p className="font-semibold mt-2">Total: {data.count.toLocaleString()}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <ReferenceLine 
                    x={chartData.findIndex(d => d.score >= cutoffScore[0])} 
                    stroke="#FAD201" 
                    strokeWidth={2}
                    label={{ value: `Cutoff: ${cutoffScore[0]}`, fill: '#FAD201', fontSize: 14, fontWeight: 'bold' }}
                  />
                  <Bar dataKey="passed" stackId="a" fill="#00A651" name="Passing" />
                  <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Not Passing" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Score Distribution Chart - Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cumulative Score Distribution</CardTitle>
              <CardDescription>
                Overall distribution curve showing candidate concentration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="range" 
                    label={{ value: 'Score Range', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis label={{ value: 'Number of Candidates', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
                            <p className="font-semibold">Score Range: {data.range}</p>
                            <p className="text-[#00A1DE]">Candidates: {data.count.toLocaleString()}</p>
                            <p className={data.score >= cutoffScore[0] ? "text-[#00A651]" : "text-red-500"}>
                              Status: {data.score >= cutoffScore[0] ? "Passing" : "Not Passing"}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine 
                    x={chartData.findIndex(d => d.score >= cutoffScore[0])} 
                    stroke="#FAD201" 
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    label={{ 
                      value: `Cutoff: ${cutoffScore[0]}`, 
                      fill: '#FAD201', 
                      fontSize: 14, 
                      fontWeight: 'bold',
                      position: 'top'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#00A1DE" 
                    fill="#00A1DE" 
                    fillOpacity={0.6}
                    name="Candidates"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
