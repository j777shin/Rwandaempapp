import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "@/app/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Users, TrendingUp, MessageSquare, Target, Home, Coins, GraduationCap, Activity, BarChart3, PieChart as PieChartIcon, Loader2 } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Color palettes used across charts
const PIE_COLORS = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b"];
const GENDER_COLORS = ["#10b981", "#059669"];

// Helper to safely map an array from the API, returning [] if data is missing or not an array
function safeArray<T>(data: unknown, mapper?: (item: any) => T): T[] {
  if (!Array.isArray(data)) return [];
  if (mapper) return data.map(mapper);
  return data as T[];
}

// Helper to format large numbers for display (e.g. 12000 -> "12,000")
function fmt(val: number | undefined | null): string {
  if (val == null) return "--";
  return val.toLocaleString();
}

// Helper to format a percentage value for display
function fmtPct(val: number | undefined | null, suffix = "%"): string {
  if (val == null) return "--";
  return `${val}${suffix}`;
}

interface OverviewData {
  total_beneficiaries?: number;
  completion_rate?: number;
  avg_eligibility?: number;
  chatbot_sessions?: number;
  phase_distribution?: any[];
  monthly_activity?: any[];
}

interface DemographicsData {
  total_beneficiaries?: number;
  female_percentage?: number;
  female_count?: number;
  avg_age?: number;
  age_distribution?: any[];
  gender_distribution?: any[];
  education_distribution?: any[];
  district_distribution?: any[];
  pathway_progress?: any[];
}

interface EngagementData {
  daily_active_users?: number;
  daily_active_pct?: number;
  avg_chatbot_sessions?: number;
  test_completion_pct?: number;
  weekly_engagement_pct?: number;
  chatbot_usage?: any[];
  test_completion?: any[];
  engagement_rate?: any[];
  monthly_activity?: any[];
}

interface SocioeconomicData {
  avg_household_size?: number;
  median_income?: number | string;
  land_ownership_pct?: number;
  livestock_ownership_pct?: number;
  household_income?: any[];
  land_ownership?: any[];
  livestock_ownership?: any[];
  housing_quality?: any[];
}

export function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewData>({});
  const [demographics, setDemographics] = useState<DemographicsData>({});
  const [engagement, setEngagement] = useState<EngagementData>({});
  const [socioeconomic, setSocioeconomic] = useState<SocioeconomicData>({});

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [overviewRes, demographicsRes, engagementRes, socioeconomicRes] =
          await Promise.allSettled([
            api.adminGetOverview(),
            api.adminGetDemographics(),
            api.adminGetEngagement(),
            api.adminGetSocioeconomic(),
          ]);

        if (overviewRes.status === "fulfilled") setOverview(overviewRes.value ?? {});
        if (demographicsRes.status === "fulfilled") setDemographics(demographicsRes.value ?? {});
        if (engagementRes.status === "fulfilled") setEngagement(engagementRes.value ?? {});
        if (socioeconomicRes.status === "fulfilled") setSocioeconomic(socioeconomicRes.value ?? {});

        // If every single request rejected, surface an error
        if (
          overviewRes.status === "rejected" &&
          demographicsRes.status === "rejected" &&
          engagementRes.status === "rejected" &&
          socioeconomicRes.status === "rejected"
        ) {
          setError("Failed to load analytics data. Please try again.");
        }
      } catch (err) {
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ------------------------------------------------------------------
  // Map API response data to chart-friendly formats
  // ------------------------------------------------------------------

  // Overview charts
  const phaseDistributionData = safeArray(overview.phase_distribution, (item) => ({
    name: item.name ?? item.label ?? item.phase ?? "Unknown",
    value: item.value ?? item.count ?? 0,
    color: item.color ?? PIE_COLORS[(overview.phase_distribution?.indexOf(item) ?? 0) % PIE_COLORS.length],
  }));

  const overviewMonthlyActivityData = safeArray(overview.monthly_activity, (item) => ({
    month: item.month ?? item.label ?? "",
    logins: item.logins ?? item.login_count ?? 0,
    testsCompleted: item.testsCompleted ?? item.tests_completed ?? item.test_count ?? 0,
    chatbotSessions: item.chatbotSessions ?? item.chatbot_sessions ?? item.chatbot_count ?? 0,
  }));

  // Demographics charts
  const ageDistributionData = safeArray(demographics.age_distribution, (item) => ({
    ageGroup: item.ageGroup ?? item.age_group ?? item.range ?? item.label ?? "",
    count: item.count ?? item.value ?? 0,
  }));

  const totalBeneficiariesForGender = demographics.total_beneficiaries ?? overview.total_beneficiaries ?? 1;

  const genderDistributionData = safeArray(demographics.gender_distribution, (item) => ({
    name: item.name ?? item.gender ?? item.label ?? "",
    value: item.value ?? item.count ?? 0,
    color: item.color ?? GENDER_COLORS[(demographics.gender_distribution?.indexOf(item) ?? 0) % GENDER_COLORS.length],
  }));

  const educationLevelData = safeArray(demographics.education_distribution, (item) => ({
    level: item.level ?? item.education ?? item.label ?? item.name ?? "",
    count: item.count ?? item.value ?? 0,
  }));

  const pathwayProgressData = safeArray(demographics.pathway_progress ?? demographics.district_distribution, (item) => ({
    subject: item.subject ?? item.name ?? item.pathway ?? item.district ?? item.label ?? "",
    value: item.value ?? item.percentage ?? item.progress ?? item.count ?? 0,
  }));

  // Engagement charts
  const chatbotUsageData = safeArray(engagement.chatbot_usage, (item) => ({
    week: item.week ?? item.label ?? item.period ?? "",
    sessions: item.sessions ?? item.count ?? item.value ?? 0,
  }));

  const testCompletionData = safeArray(engagement.test_completion, (item) => ({
    test: item.test ?? item.name ?? item.label ?? "",
    completed: item.completed ?? item.complete_count ?? 0,
    inProgress: item.inProgress ?? item.in_progress ?? item.in_progress_count ?? 0,
  }));

  const engagementRateData = safeArray(engagement.engagement_rate, (item) => ({
    day: item.day ?? item.label ?? "",
    rate: item.rate ?? item.value ?? item.percentage ?? 0,
  }));

  const engagementMonthlyActivityData = safeArray(engagement.monthly_activity, (item) => ({
    month: item.month ?? item.label ?? "",
    logins: item.logins ?? item.login_count ?? 0,
    testsCompleted: item.testsCompleted ?? item.tests_completed ?? item.test_count ?? 0,
    chatbotSessions: item.chatbotSessions ?? item.chatbot_sessions ?? item.chatbot_count ?? 0,
  }));

  // Use whichever monthly activity source is available (prefer engagement, fall back to overview)
  const monthlyActivityData =
    engagementMonthlyActivityData.length > 0
      ? engagementMonthlyActivityData
      : overviewMonthlyActivityData;

  // Socioeconomic charts
  const householdIncomeData = safeArray(socioeconomic.household_income, (item) => ({
    range: item.range ?? item.label ?? item.name ?? item.bracket ?? "",
    count: item.count ?? item.value ?? 0,
  }));

  const landOwnershipData = safeArray(socioeconomic.land_ownership, (item) => ({
    category: item.category ?? item.label ?? item.name ?? item.size ?? "",
    value: item.value ?? item.count ?? 0,
    color: item.color ?? PIE_COLORS[(socioeconomic.land_ownership?.indexOf(item) ?? 0) % PIE_COLORS.length],
  }));

  const livestockOwnershipData = safeArray(socioeconomic.livestock_ownership, (item) => ({
    category: item.category ?? item.label ?? item.name ?? item.type ?? "",
    owners: item.owners ?? item.count ?? item.value ?? 0,
    percentage: item.percentage ?? item.pct ?? 0,
  }));

  const housingQualityData = safeArray(socioeconomic.housing_quality, (item) => ({
    quality: item.quality ?? item.label ?? item.name ?? item.level ?? "",
    count: item.count ?? item.value ?? 0,
  }));

  // ------------------------------------------------------------------
  // Loading state
  // ------------------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground text-lg">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Error state (only shown when all endpoints failed)
  // ------------------------------------------------------------------
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
          <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive text-lg">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Main render
  // ------------------------------------------------------------------
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
              <BarChart3 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Overview</h2>
            </div>
            <Separator />

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Beneficiaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {fmt(overview.total_beneficiaries)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">All phases combined</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {fmtPct(overview.completion_rate)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Phase 1 completion</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Avg. Eligibility Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {overview.avg_eligibility != null ? overview.avg_eligibility : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Out of 100</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Chatbot Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {fmt(overview.chatbot_sessions)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Phase 2 total</p>
                </CardContent>
              </Card>
            </div>

            {/* Phase Distribution and Monthly Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-primary" />
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
                    <Activity className="w-5 h-5 text-primary" />
                    Monthly Activity Trends
                  </CardTitle>
                  <CardDescription>User engagement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={overviewMonthlyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="logins" stroke="#10b981" strokeWidth={2} name="Logins" />
                      <Line type="monotone" dataKey="testsCompleted" stroke="#059669" strokeWidth={2} name="Tests" />
                      <Line type="monotone" dataKey="chatbotSessions" stroke="#047857" strokeWidth={2} name="Chatbot" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* BENEFICIARY ANALYSIS SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Beneficiary Analysis</h2>
            </div>
            <Separator />

            {/* Demographic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm">Total Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {fmt(demographics.total_beneficiaries ?? overview.total_beneficiaries)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Across all programs</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm">Female Beneficiaries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {fmtPct(demographics.female_percentage)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {demographics.female_count != null
                      ? `${fmt(demographics.female_count)} women enrolled`
                      : "Women enrolled"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm">Avg. Age</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {demographics.avg_age != null ? demographics.avg_age : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Years old</p>
                </CardContent>
              </Card>
            </div>

            {/* Demographics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
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
                      <Bar dataKey="count" fill="#10b981" name="Beneficiaries" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
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
                        label={(entry) => {
                          const total = totalBeneficiariesForGender;
                          return `${entry.name}: ${entry.value} (${((entry.value / total) * 100).toFixed(1)}%)`;
                        }}
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
                    <GraduationCap className="w-5 h-5 text-primary" />
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
                      <Bar dataKey="count" fill="#10b981" name="Beneficiaries" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
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
                      <Radar name="Progress %" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
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
              <Home className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Socioeconomic Indicators</h2>
            </div>
            <Separator />

            {/* Socioeconomic Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Avg. Household Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {socioeconomic.avg_household_size != null ? socioeconomic.avg_household_size : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Members per household</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Median Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {socioeconomic.median_income != null ? socioeconomic.median_income : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">RWF per month</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm">Land Ownership</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {fmtPct(socioeconomic.land_ownership_pct)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Own some land</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm">Livestock Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {fmtPct(socioeconomic.livestock_ownership_pct)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Own livestock</p>
                </CardContent>
              </Card>
            </div>

            {/* Socioeconomic Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-primary" />
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
                      <Bar dataKey="count" fill="#10b981" name="Households" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
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
                    <Users className="w-5 h-5 text-primary" />
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
                      <Bar yAxisId="left" dataKey="owners" fill="#10b981" name="Number of Owners" />
                      <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#059669" strokeWidth={2} name="Percentage %" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Housing Quality
                  </CardTitle>
                  <CardDescription>Quality of beneficiary housing</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[320px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={housingQualityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quality" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Households" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* ENGAGEMENT SECTION */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Engagement Metrics</h2>
            </div>
            <Separator />

            {/* Engagement Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Daily Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {fmt(engagement.daily_active_users)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {engagement.daily_active_pct != null
                      ? `${engagement.daily_active_pct}% of total`
                      : "Of total"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Avg. Chatbot Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {engagement.avg_chatbot_sessions != null ? engagement.avg_chatbot_sessions : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Per Phase 2 user</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Test Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {fmtPct(engagement.test_completion_pct)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All tests completed</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Weekly Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {fmtPct(engagement.weekly_engagement_pct)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Average rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Engagement Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
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
                      <Area type="monotone" dataKey="sessions" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Sessions" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
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
                      <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                      <Bar dataKey="inProgress" stackId="a" fill="#059669" name="In Progress" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
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
                      <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} name="Engagement %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
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
                      <Bar dataKey="testsCompleted" fill="#10b981" name="Tests Completed" />
                      <Line type="monotone" dataKey="logins" stroke="#059669" strokeWidth={2} name="User Logins" />
                      <Line type="monotone" dataKey="chatbotSessions" stroke="#047857" strokeWidth={2} name="Chatbot Sessions" />
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
