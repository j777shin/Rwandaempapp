import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Users, TrendingUp, MessageSquare, Target, Home, Coins, GraduationCap, Activity, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ComposedChart, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

// Mock data for charts
const phaseDistributionData = [
  { name: "Phase 1 - Active", value: 2755, color: "#00A1DE" },
  { name: "Phase 1 - Completed", value: 6245, color: "#0080B3" },
  { name: "Phase 2 - Active", value: 3000, color: "#00A651" },
];

const ageDistributionData = [
  { ageGroup: "18-22", count: 2850 },
  { ageGroup: "23-27", count: 4230 },
  { ageGroup: "28-32", count: 3150 },
  { ageGroup: "33-35", count: 1770 },
];

const genderDistributionData = [
  { name: "Female", value: 6450, color: "#00A651" },
  { name: "Male", value: 5550, color: "#00A1DE" },
];

const educationLevelData = [
  { level: "Primary", count: 1200 },
  { level: "Secondary", count: 5850 },
  { level: "Vocational", count: 3150 },
  { level: "University", count: 1800 },
];

const householdIncomeData = [
  { range: "<50k RWF", count: 3250 },
  { range: "50k-100k", count: 4125 },
  { range: "100k-200k", count: 2850 },
  { range: "200k-500k", count: 1350 },
  { range: ">500k", count: 425 },
];

const livestockOwnershipData = [
  { category: "Cattle", owners: 2340, percentage: 19.5 },
  { category: "Goats", owners: 4125, percentage: 34.4 },
  { category: "Poultry", owners: 6850, percentage: 57.1 },
  { category: "None", owners: 3285, percentage: 27.4 },
];

const landOwnershipData = [
  { category: "No Land", value: 2845, color: "#ef4444" },
  { category: "<0.5 ha", value: 4125, color: "#f59e0b" },
  { category: "0.5-1 ha", value: 3250, color: "#FAD201" },
  { category: "1-2 ha", value: 1580, color: "#00A651" },
  { category: ">2 ha", value: 200, color: "#0080B3" },
];

const housingQualityData = [
  { quality: "Poor", count: 1850 },
  { quality: "Fair", count: 5250 },
  { quality: "Good", count: 4125 },
  { quality: "Excellent", count: 775 },
];

const chatbotUsageData = [
  { week: "Week 1", sessions: 1250 },
  { week: "Week 2", sessions: 1850 },
  { week: "Week 3", sessions: 2340 },
  { week: "Week 4", sessions: 2680 },
  { week: "Week 5", sessions: 2950 },
  { week: "Week 6", sessions: 3125 },
];

const testCompletionData = [
  { test: "Cognitive Skills", completed: 8450, inProgress: 550 },
  { test: "Technical Aptitude", completed: 7820, inProgress: 1180 },
  { test: "Problem Solving", completed: 8125, inProgress: 875 },
  { test: "Entrepreneurship", completed: 2750, inProgress: 250 },
];

const pathwayProgressData = [
  { subject: "Digital Literacy", value: 85 },
  { subject: "Financial Management", value: 72 },
  { subject: "Business Planning", value: 68 },
  { subject: "Marketing Skills", value: 75 },
  { subject: "Leadership", value: 78 },
  { subject: "Technical Skills", value: 81 },
];

const monthlyActivityData = [
  { month: "Aug", logins: 6250, testsCompleted: 3850, chatbotSessions: 0 },
  { month: "Sep", logins: 7340, testsCompleted: 5230, chatbotSessions: 0 },
  { month: "Oct", logins: 8125, testsCompleted: 6750, chatbotSessions: 0 },
  { month: "Nov", logins: 8650, testsCompleted: 7425, chatbotSessions: 1250 },
  { month: "Dec", logins: 8920, testsCompleted: 8125, chatbotSessions: 2340 },
  { month: "Jan", logins: 9150, testsCompleted: 8550, chatbotSessions: 3125 },
];

const engagementRateData = [
  { day: "Mon", rate: 78 },
  { day: "Tue", rate: 82 },
  { day: "Wed", rate: 85 },
  { day: "Thu", rate: 88 },
  { day: "Fri", rate: 84 },
  { day: "Sat", rate: 65 },
  { day: "Sun", rate: 58 },
];

export function Analytics() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">Comprehensive program analytics and insights</p>
        </div>

        <div className="space-y-12">
          {/* OVERVIEW SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-[#00A1DE]" />
              <h2 className="text-2xl font-bold">Overview</h2>
            </div>
            <Separator />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Beneficiaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A1DE]">12,000</div>
                  <p className="text-xs text-muted-foreground mt-2">All phases combined</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A651]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A651]">69.4%</div>
                  <p className="text-xs text-muted-foreground mt-2">Phase 1 completion</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FAD201]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Avg. Eligibility Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#FAD201]">76.2</div>
                  <p className="text-xs text-muted-foreground mt-2">Out of 100</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chatbot Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600">13,320</div>
                  <p className="text-xs text-muted-foreground mt-2">Phase 2 total</p>
                </CardContent>
              </Card>
            </div>

            {/* Phase Distribution and Monthly Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-[#00A1DE]" />
                    Phase Distribution
                  </CardTitle>
                  <CardDescription>Current status across program phases</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={phaseDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {phaseDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#00A651]" />
                    Monthly Activity Trends
                  </CardTitle>
                  <CardDescription>User engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="logins" stroke="#00A1DE" strokeWidth={2} name="Logins" />
                      <Line type="monotone" dataKey="testsCompleted" stroke="#FAD201" strokeWidth={2} name="Tests" />
                      <Line type="monotone" dataKey="chatbotSessions" stroke="#00A651" strokeWidth={2} name="Chatbot" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* BENEFICIARY ANALYSIS SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#00A651]" />
              <h2 className="text-2xl font-bold">Beneficiary Analysis</h2>
            </div>
            <Separator />

            {/* Demographic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader>
                  <CardTitle className="text-sm">Total Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12,000</div>
                  <p className="text-xs text-muted-foreground mt-1">Across all programs</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A651]">
                <CardHeader>
                  <CardTitle className="text-sm">Female Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00A651]">53.8%</div>
                  <p className="text-xs text-muted-foreground mt-1">6,450 women enrolled</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FAD201]">
                <CardHeader>
                  <CardTitle className="text-sm">Avg. Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#FAD201]">26.4</div>
                  <p className="text-xs text-muted-foreground mt-1">Years old</p>
                </CardContent>
              </Card>
            </div>

            {/* Demographics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00A1DE]" />
                    Age Distribution
                  </CardTitle>
                  <CardDescription>Beneficiaries by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00A1DE" name="Beneficiaries" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00A651]" />
                    Gender Distribution
                  </CardTitle>
                  <CardDescription>Gender breakdown of participants</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={genderDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value} (${((entry.value/12000)*100).toFixed(1)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-[#FAD201]" />
                    Education Levels
                  </CardTitle>
                  <CardDescription>Educational background distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={educationLevelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="level" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FAD201" name="Beneficiaries" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#00A651]" />
                    Pathway Progress Overview
                  </CardTitle>
                  <CardDescription>Average completion by pathway</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={pathwayProgressData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Progress %" dataKey="value" stroke="#00A651" fill="#00A651" fillOpacity={0.6} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* SOCIOECONOMIC SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-[#FAD201]" />
              <h2 className="text-2xl font-bold">Socioeconomic Indicators</h2>
            </div>
            <Separator />

            {/* Socioeconomic Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-[#00A651]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Avg. Household Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00A651]">5.2</div>
                  <p className="text-xs text-muted-foreground mt-1">Members per household</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FAD201]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Median Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#FAD201]">95k</div>
                  <p className="text-xs text-muted-foreground mt-1">RWF per month</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader>
                  <CardTitle className="text-sm">Land Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00A1DE]">76.3%</div>
                  <p className="text-xs text-muted-foreground mt-1">Own some land</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="text-sm">Livestock Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">72.6%</div>
                  <p className="text-xs text-muted-foreground mt-1">Own livestock</p>
                </CardContent>
              </Card>
            </div>

            {/* Socioeconomic Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-[#FAD201]" />
                    Household Income Distribution
                  </CardTitle>
                  <CardDescription>Monthly household income ranges</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={householdIncomeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FAD201" name="Households" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#00A1DE]" />
                    Land Ownership Distribution
                  </CardTitle>
                  <CardDescription>Land holdings by size</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={landOwnershipData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.category}: ${entry.value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {landOwnershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#00A651]" />
                    Livestock Ownership
                  </CardTitle>
                  <CardDescription>Types of livestock owned by beneficiaries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={livestockOwnershipData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="owners" fill="#00A651" name="Number of Owners" />
                      <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#FAD201" strokeWidth={2} name="Percentage %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-orange-500" />
                    Housing Quality
                  </CardTitle>
                  <CardDescription>Quality of beneficiary housing</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={housingQualityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quality" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#f97316" fill="#f97316" fillOpacity={0.6} name="Households" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ENGAGEMENT SECTION */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Engagement Metrics</h2>
            </div>
            <Separator />

            {/* Engagement Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Daily Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00A1DE]">7,245</div>
                  <p className="text-xs text-muted-foreground mt-1">60.4% of total</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A651]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Avg. Chatbot Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00A651]">4.4</div>
                  <p className="text-xs text-muted-foreground mt-1">Per Phase 2 user</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FAD201]">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Test Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#FAD201]">91.2%</div>
                  <p className="text-xs text-muted-foreground mt-1">All tests completed</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Weekly Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-500">79.8%</div>
                  <p className="text-xs text-muted-foreground mt-1">Average rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#00A651]" />
                    Chatbot Usage Trend
                  </CardTitle>
                  <CardDescription>Weekly chatbot session growth (Phase 2)</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chatbotUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="sessions" stroke="#00A651" fill="#00A651" fillOpacity={0.6} name="Sessions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#00A1DE]" />
                    Test Completion Rates
                  </CardTitle>
                  <CardDescription>Progress on required assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={testCompletionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="test" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#00A651" name="Completed" />
                      <Bar dataKey="inProgress" stackId="a" fill="#FAD201" name="In Progress" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#FAD201]" />
                    Daily Engagement Rate
                  </CardTitle>
                  <CardDescription>User activity by day of week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={engagementRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rate" stroke="#FAD201" strokeWidth={3} name="Engagement %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#00A1DE]" />
                    Overall Platform Activity
                  </CardTitle>
                  <CardDescription>Combined engagement metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="testsCompleted" fill="#00A651" name="Tests Completed" />
                      <Line type="monotone" dataKey="logins" stroke="#00A1DE" strokeWidth={2} name="User Logins" />
                      <Line type="monotone" dataKey="chatbotSessions" stroke="#FAD201" strokeWidth={2} name="Chatbot Sessions" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
