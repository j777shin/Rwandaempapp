import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, LayoutDashboard, Users, BookOpen, Route } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

export function Phase1Dashboard() {
  // Beneficiary Demographic Analysis Data
  const ageDistribution = [
    { ageGroup: "18-22", count: 2100, percentage: 23.3 },
    { ageGroup: "23-27", count: 2700, percentage: 30.0 },
    { ageGroup: "28-32", count: 2400, percentage: 26.7 },
    { ageGroup: "33-37", count: 1200, percentage: 13.3 },
    { ageGroup: "38+", count: 600, percentage: 6.7 },
  ];

  const genderDistribution = [
    { name: "Male", value: 5400, percentage: 60 },
    { name: "Female", value: 3600, percentage: 40 },
  ];

  const educationDistribution = [
    { level: "Below Primary", count: 900, percentage: 10 },
    { level: "Primary", count: 2700, percentage: 30 },
    { level: "Secondary", count: 3600, percentage: 40 },
    { level: "Tertiary", count: 1800, percentage: 20 },
  ];

  const regionalDistribution = [
    { region: "Kigali", count: 2800 },
    { region: "Eastern", count: 2100 },
    { region: "Northern", count: 1600 },
    { region: "Southern", count: 1500 },
    { region: "Western", count: 1000 },
  ];

  // SkillCraft Test Scores by Category
  const skillcraftScores = [
    { 
      category: "Technical Skills",
      "0-20": 180,
      "21-40": 450,
      "41-60": 1350,
      "61-80": 3240,
      "81-100": 2880,
      avgScore: 78
    },
    { 
      category: "Soft Skills",
      "0-20": 90,
      "21-40": 360,
      "41-60": 1080,
      "61-80": 3150,
      "81-100": 3420,
      avgScore: 82
    },
    { 
      category: "Problem Solving",
      "0-20": 270,
      "21-40": 540,
      "41-60": 1620,
      "61-80": 3060,
      "81-100": 2460,
      avgScore: 75
    },
    { 
      category: "Communication",
      "0-20": 90,
      "21-40": 270,
      "41-60": 900,
      "61-80": 2880,
      "81-100": 3960,
      avgScore: 85
    },
  ];

  // Pathways Distribution Data
  // Distribution of users by completion rate
  const userCompletionRateDistribution = [
    { completionRange: "0-20%", users: 900 },
    { completionRange: "21-40%", users: 1350 },
    { completionRange: "41-60%", users: 1800 },
    { completionRange: "61-80%", users: 2250 },
    { completionRange: "81-100%", users: 2700 },
  ];

  // Distribution of users by number of courses taken
  const coursesEngagementDistribution = [
    { coursesCount: "1 course", users: 900 },
    { coursesCount: "2 courses", users: 1350 },
    { coursesCount: "3 courses", users: 1800 },
    { coursesCount: "4 courses", users: 2250 },
    { coursesCount: "5 courses", users: 2700 },
  ];

  const COLORS = {
    blue: "#00A1DE",
    green: "#00A651",
    yellow: "#FAD201",
    purple: "#8B5CF6",
    orange: "#F97316",
  };

  const GENDER_COLORS = [COLORS.blue, COLORS.green];
  const PATHWAY_COLORS = [COLORS.green, COLORS.yellow, COLORS.blue];

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
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Phase 1 Dashboard</h1>
              <p className="text-muted-foreground">Training Phase Analytics - 9,000 Beneficiaries</p>
            </div>
          </div>
          <Badge variant="outline" className="border-[#00A1DE] text-[#00A1DE]">Phase 1 - Training</Badge>
        </div>

        {/* Component 1: Beneficiary Demographic Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#00A1DE]" />
              <div>
                <CardTitle>Beneficiary Demographic Analysis</CardTitle>
                <CardDescription>Complete demographic breakdown of Phase 1 participants</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Distribution */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A1DE]">Age Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ageDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageGroup" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.blue} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gender Distribution */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A651]">Gender Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={genderDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Education Level */}
              <div>
                <h3 className="font-semibold mb-4 text-[#FAD201]">Education Level Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={educationDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="level" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.yellow} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Distribution */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A1DE]">Regional Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={regionalDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.green} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-[#00A1DE]">
                <p className="text-sm text-muted-foreground">Total Enrolled</p>
                <p className="text-2xl font-bold text-[#00A1DE]">9,000</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-2 border-[#00A651]">
                <p className="text-sm text-muted-foreground">Male</p>
                <p className="text-2xl font-bold text-[#00A651]">5,400 (60%)</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-2 border-[#00A651]">
                <p className="text-sm text-muted-foreground">Female</p>
                <p className="text-2xl font-bold text-[#00A651]">3,600 (40%)</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border-2 border-[#FAD201]">
                <p className="text-sm text-muted-foreground">Avg Age</p>
                <p className="text-2xl font-bold text-[#FAD201]">27 years</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Component 2: SkillCraft Test Score Distribution */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-[#00A651]" />
              <div>
                <CardTitle>SkillCraft Test Score Distribution</CardTitle>
                <CardDescription>Performance breakdown by skill category and score ranges</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={skillcraftScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="0-20" stackId="a" fill="#EF4444" name="0-20" />
                  <Bar dataKey="21-40" stackId="a" fill="#F97316" name="21-40" />
                  <Bar dataKey="41-60" stackId="a" fill={COLORS.yellow} name="41-60" />
                  <Bar dataKey="61-80" stackId="a" fill={COLORS.blue} name="61-80" />
                  <Bar dataKey="81-100" stackId="a" fill={COLORS.green} name="81-100" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Average Scores Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {skillcraftScores.map((skill, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <p className="text-sm text-muted-foreground mb-1">{skill.category}</p>
                  <p className="text-3xl font-bold text-[#00A651]">{skill.avgScore}</p>
                  <p className="text-xs text-muted-foreground mt-1">Average Score</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Component 3: Pathways Distribution */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Route className="w-6 h-6 text-[#FAD201]" />
              <div>
                <CardTitle>Pathways Distribution</CardTitle>
                <CardDescription>User distribution by completion rates and courses taken</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Distribution by Completion Rate */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A1DE]">Distribution by Completion Rate</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userCompletionRateDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="completionRange" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="users" stroke={COLORS.blue} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* User Distribution by Number of Courses Taken */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A651]">Distribution by Courses Taken</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={coursesEngagementDistribution}>
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
      </div>
    </div>
  );
}