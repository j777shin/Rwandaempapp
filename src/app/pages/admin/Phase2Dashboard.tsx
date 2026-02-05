import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, BarChart3, Building2, Briefcase } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function Phase2Dashboard() {
  // Employment Track Data
  const employmentCompletionRates = [
    { completionRange: "0-20%", users: 180 },
    { completionRange: "21-40%", users: 360 },
    { completionRange: "41-60%", users: 540 },
    { completionRange: "61-80%", users: 450 },
    { completionRange: "81-100%", users: 270 },
  ];

  const employmentCoursesDistribution = [
    { coursesCount: "1 course", users: 270 },
    { coursesCount: "2 courses", users: 360 },
    { coursesCount: "3 courses", users: 540 },
    { coursesCount: "4 courses", users: 450 },
    { coursesCount: "5+ courses", users: 180 },
  ];

  // Entrepreneurship Track Data
  const chatbotUsageTimeDistribution = [
    { timeRange: "0-5 min", users: 180 },
    { timeRange: "6-10 min", users: 300 },
    { timeRange: "11-20 min", users: 420 },
    { timeRange: "21-30 min", users: 240 },
    { timeRange: "31+ min", users: 60 },
  ];

  const stageCompletionDistribution = [
    { stage: "Stage 1", completed: 1050, inProgress: 150 },
    { stage: "Stage 2", completed: 840, inProgress: 210 },
    { stage: "Stage 3", completed: 600, inProgress: 240 },
    { stage: "Stage 4", completed: 360, inProgress: 240 },
  ];

  const COLORS = {
    blue: "#00A1DE",
    green: "#00A651",
    yellow: "#FAD201",
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

        {/* Tabs for Employment and Entrepreneurship Tracks */}
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
                    <CardDescription>Distribution of completion rates and courses taken - 1,800 beneficiaries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Completion Rate Distribution */}
                  <div>
                    <h3 className="font-semibold mb-4 text-[#00A1DE]">Distribution by Completion Rate</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={employmentCompletionRates}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="completionRange" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke={COLORS.blue} strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Courses Taken Distribution */}
                  <div>
                    <h3 className="font-semibold mb-4 text-[#00A651]">Distribution by Courses Taken</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={employmentCoursesDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="coursesCount" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke={COLORS.green} strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Entrepreneurship Track Tab */}
          <TabsContent value="entrepreneurship">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-[#00A651]" />
                  <div>
                    <CardTitle>Entrepreneurship Track Analytics</CardTitle>
                    <CardDescription>Chatbot usage and stage completion distribution - 1,200 beneficiaries</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chatbot Usage Time Distribution */}
                  <div>
                    <h3 className="font-semibold mb-4 text-[#00A1DE]">Chatbot Usage Time Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chatbotUsageTimeDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timeRange" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="users" stroke={COLORS.blue} strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Stage Completion Distribution */}
                  <div>
                    <h3 className="font-semibold mb-4 text-[#00A651]">Stage Completion Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stageCompletionDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="stage" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill={COLORS.green} name="Completed" />
                        <Bar dataKey="inProgress" fill={COLORS.yellow} name="In Progress" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
