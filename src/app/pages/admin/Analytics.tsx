import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "@/app/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ArrowLeft, Users, TrendingUp, MessageSquare, Target, Home, Coins, GraduationCap, Activity, BarChart3, PieChart as PieChartIcon, Loader2, MapPin, Heart, Accessibility, Briefcase, HardHat, Banknote } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import {
  Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Color palettes
const PIE_COLORS = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#0d9488", "#14b8a6", "#2dd4bf"];
const GENDER_COLORS = ["#10b981", "#059669"];
const DISTRICT_COLORS = ["#10b981", "#059669", "#047857", "#065f46", "#0d9488", "#14b8a6", "#2dd4bf", "#99f6e4"];
const STATUS_COLORS: Record<string, string> = {
  Pending: "#eab308",
  Selected: "#22c55e",
  Rejected: "#ef4444",
  Employment: "#3b82f6",
  Entrepreneurship: "#8b5cf6",
};

// Helper to safely map an array from the API
function safeArray<T>(data: unknown, mapper?: (item: any, index: number) => T): T[] {
  if (!Array.isArray(data)) return [];
  if (mapper) return data.map(mapper);
  return data as T[];
}

function fmt(val: number | undefined | null): string {
  if (val == null) return "--";
  return val.toLocaleString();
}

function fmtPct(val: number | undefined | null, suffix = "%"): string {
  if (val == null) return "--";
  return `${val}${suffix}`;
}

// Convert a dict like {"male": 50000, "female": 50000} to [{name: "Male", value: 50000}, ...]
function dictToChartArray(dict: Record<string, number> | undefined, labelKey = "name", valueKey = "value") {
  if (!dict || typeof dict !== "object") return [];
  return Object.entries(dict).map(([key, val]) => ({
    [labelKey]: key.charAt(0).toUpperCase() + key.slice(1),
    [valueKey]: val,
  }));
}

interface OverviewData {
  total_beneficiaries?: number;
  selected_count?: number;
  employment_track?: number;
  entrepreneurship_track?: number;
  avg_skillcraft_score?: number;
  avg_pathways_rate?: number;
  avg_eligibility_score?: number;
  chatbot_sessions?: number;
  completion_rate?: number;
  avg_eligibility?: number;
  phase_distribution?: any[];
  monthly_activity?: any[];
}

interface DemographicsData {
  gender?: Record<string, number>;
  age_groups?: Record<string, number>;
  education?: Record<string, number>;
  districts?: Record<string, number>;
  marriage_status?: Record<string, number>;
  disability?: Record<string, number>;
  occupation?: Record<string, number>;
  informal_working?: Record<string, number>;
  household_size_groups?: Record<string, number>;
  // Legacy fields for Insight tab
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
  skillcraft?: { total: number; completed: number };
  pathways?: { enrolled: number };
  business_development?: { submitted: number };
  chatbot?: { unique_users: number; total_messages: number };
  // Legacy fields
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
  land_ownership_rate?: number;
  avg_cattle?: number;
  avg_goats?: number;
  earth_floor_rate?: number;
  lighting_rate?: number;
  avg_household_size?: number;
  total?: number;
  // Legacy fields
  median_income?: number | string;
  land_ownership_pct?: number;
  livestock_ownership_pct?: number;
  land_ownership?: any[];
  livestock_ownership?: any[];
  housing_quality?: any[];
  assets_distribution?: any[];
}

interface StatGroup {
  total: number;
  female_count: number;
  female_pct: number;
}

interface ImpactData {
  newly_hired: StatGroup & {
    wage_employment: StatGroup;
    self_employment: StatGroup;
  };
  employability: StatGroup;
  phase_beneficiaries: {
    phase1: StatGroup;
    phase2_employment: StatGroup;
    phase2_entrepreneurship: StatGroup;
  };
  grants: {
    total_recipients: number;
    female_count: number;
    female_pct: number;
    total_amount: number;
    avg_amount: number;
    distribution: { range: string; count: number }[];
  };
}

function fmtRwf(val: number | null | undefined): string {
  if (val == null) return "--";
  return `${val.toLocaleString()} RWF`;
}

export function Analytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewData>({});
  const [demographics, setDemographics] = useState<DemographicsData>({});
  const [engagement, setEngagement] = useState<EngagementData>({});
  const [socioeconomic, setSocioeconomic] = useState<SocioeconomicData>({});
  const [impact, setImpact] = useState<ImpactData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [overviewRes, demographicsRes, engagementRes, socioeconomicRes, impactRes] =
          await Promise.allSettled([
            api.adminGetOverview(),
            api.adminGetDemographics(),
            api.adminGetEngagement(),
            api.adminGetSocioeconomic(),
            api.adminGetImpactDashboard(),
          ]);

        if (overviewRes.status === "fulfilled") setOverview(overviewRes.value ?? {});
        if (demographicsRes.status === "fulfilled") setDemographics(demographicsRes.value ?? {});
        if (engagementRes.status === "fulfilled") setEngagement(engagementRes.value ?? {});
        if (socioeconomicRes.status === "fulfilled") setSocioeconomic(socioeconomicRes.value ?? {});
        if (impactRes.status === "fulfilled") setImpact(impactRes.value ?? null);

        if (
          overviewRes.status === "rejected" &&
          demographicsRes.status === "rejected" &&
          engagementRes.status === "rejected" &&
          socioeconomicRes.status === "rejected" &&
          impactRes.status === "rejected"
        ) {
          setError("Failed to load analytics data. Please try again.");
        }
      } catch {
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // ------------------------------------------------------------------
  // Basic tab data transforms (from dict-format API responses)
  // ------------------------------------------------------------------
  const genderData = dictToChartArray(demographics.gender);
  const totalFromGender = genderData.reduce((sum, d) => sum + (d.value as number), 0);
  const femaleCount = demographics.gender?.female ?? 0;
  const femalePct = totalFromGender > 0 ? ((femaleCount / totalFromGender) * 100).toFixed(1) : "--";

  const ageData = demographics.age_groups
    ? Object.entries(demographics.age_groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([group, count]) => ({ ageGroup: group, count }))
    : [];

  const educationData = demographics.education
    ? Object.entries(demographics.education)
        .sort(([, a], [, b]) => b - a)
        .map(([level, count]) => ({
          level: level.charAt(0).toUpperCase() + level.slice(1).replace(/_/g, " "),
          count,
        }))
    : [];

  const districtData = demographics.districts
    ? Object.entries(demographics.districts)
        .sort(([, a], [, b]) => b - a)
        .map(([district, count]) => ({ district, count }))
    : [];

  const marriageData = dictToChartArray(demographics.marriage_status);
  const disabilityData = dictToChartArray(demographics.disability);
  const occupationData = dictToChartArray(demographics.occupation);
  const informalWorkingData = dictToChartArray(demographics.informal_working);

  const householdSizeData = demographics.household_size_groups
    ? Object.entries(demographics.household_size_groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([group, count]) => ({ group, count }))
    : [];

  // Selection status distribution from overview
  const selectionData = [];
  if (overview.total_beneficiaries) {
    const selected = overview.selected_count ?? 0;
    const empTrack = overview.employment_track ?? 0;
    const entTrack = overview.entrepreneurship_track ?? 0;
    const pending = (overview.total_beneficiaries ?? 0) - selected - empTrack - entTrack;
    if (pending > 0) selectionData.push({ status: "Pending", count: pending, color: STATUS_COLORS.Pending });
    if (selected > 0) selectionData.push({ status: "Selected", count: selected, color: STATUS_COLORS.Selected });
    if (empTrack > 0) selectionData.push({ status: "Employment", count: empTrack, color: STATUS_COLORS.Employment });
    if (entTrack > 0) selectionData.push({ status: "Entrepreneurship", count: entTrack, color: STATUS_COLORS.Entrepreneurship });
  }

  // Avg age from age groups (weighted)
  const avgAgeEstimate = (() => {
    if (!demographics.age_groups) return null;
    const midpoints: Record<string, number> = { "15-19": 17, "20-24": 22, "25-29": 27, "30-35": 32.5 };
    let totalAge = 0, totalCount = 0;
    for (const [group, count] of Object.entries(demographics.age_groups)) {
      const mid = midpoints[group] ?? 25;
      totalAge += mid * count;
      totalCount += count;
    }
    return totalCount > 0 ? (totalAge / totalCount).toFixed(1) : null;
  })();

  // ------------------------------------------------------------------
  // Insight tab data (legacy format mapping for existing charts)
  // ------------------------------------------------------------------
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

  const chatbotUsageData = safeArray(engagement.chatbot_usage, (item) => ({
    week: item.week ?? item.label ?? item.period ?? "",
    sessions: item.sessions ?? item.count ?? item.value ?? 0,
  }));

  const testCompletionData = safeArray(engagement.test_completion, (item) => ({
    test: item.test ?? item.name ?? item.label ?? "",
    completed: item.completed ?? item.complete_count ?? 0,
    inProgress: item.inProgress ?? item.in_progress ?? item.in_progress_count ?? 0,
  }));

  const engagementMonthlyActivityData = safeArray(engagement.monthly_activity, (item) => ({
    month: item.month ?? item.label ?? "",
    logins: item.logins ?? item.login_count ?? 0,
    testsCompleted: item.testsCompleted ?? item.tests_completed ?? item.test_count ?? 0,
    chatbotSessions: item.chatbotSessions ?? item.chatbot_sessions ?? item.chatbot_count ?? 0,
  }));

  const monthlyActivityData =
    engagementMonthlyActivityData.length > 0
      ? engagementMonthlyActivityData
      : overviewMonthlyActivityData;

  const assetsDistributionData = safeArray(socioeconomic.assets_distribution, (item) => ({
    category: item.category ?? "",
    owners: item.owners ?? 0,
    percentage: item.percentage ?? 0,
  }));

  const landOwnershipData = safeArray(socioeconomic.land_ownership, (item, idx) => ({
    category: item.category ?? "",
    value: item.value ?? item.count ?? 0,
    color: PIE_COLORS[idx % PIE_COLORS.length],
  }));

  const livestockOwnershipData = safeArray(socioeconomic.livestock_ownership, (item) => ({
    category: item.category ?? "",
    owners: item.owners ?? 0,
    percentage: item.percentage ?? 0,
  }));

  const housingQualityData = safeArray(socioeconomic.housing_quality, (item) => ({
    quality: item.quality ?? "",
    count: item.count ?? 0,
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
  // Error state
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

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="insight">Insight</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
          </TabsList>

          {/* ============================================================ */}
          {/* BASIC TAB — Demographic Distributions */}
          {/* ============================================================ */}
          <TabsContent value="basic" className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Beneficiaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{fmt(overview.total_beneficiaries ?? totalFromGender)}</div>
                  <p className="text-xs text-muted-foreground mt-2">Registered in system</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Female Beneficiaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{femalePct}%</div>
                  <p className="text-xs text-muted-foreground mt-2">{fmt(femaleCount)} women enrolled</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Average Age
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{avgAgeEstimate ?? "--"}</div>
                  <p className="text-xs text-muted-foreground mt-2">Years old</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Avg Household Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {socioeconomic.avg_household_size != null ? Number(socioeconomic.avg_household_size).toFixed(1) : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Members per household</p>
                </CardContent>
              </Card>
            </div>

            {/* Gender + Age */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Gender Distribution
                  </CardTitle>
                  <CardDescription>Male vs female breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  {genderData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={genderData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const pct = totalFromGender > 0 ? ((entry.value / totalFromGender) * 100).toFixed(1) : 0;
                            return `${entry.name}: ${fmt(entry.value)} (${pct}%)`;
                          }}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {genderData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No gender data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Age Distribution
                  </CardTitle>
                  <CardDescription>Beneficiaries by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  {ageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ageGroup" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => fmt(value)} />
                        <Bar dataKey="count" fill="#10b981" name="Beneficiaries" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No age data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Education + District */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Education Level
                  </CardTitle>
                  <CardDescription>Educational background distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  {educationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={educationData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="level" type="category" width={120} />
                        <Tooltip formatter={(value: number) => fmt(value)} />
                        <Bar dataKey="count" fill="#10b981" name="Beneficiaries" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No education data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    Household Size Distribution
                  </CardTitle>
                  <CardDescription>Number of household members</CardDescription>
                </CardHeader>
                <CardContent>
                  {householdSizeData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={householdSizeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="group" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => fmt(value)} />
                        <Bar dataKey="count" fill="#10b981" name="Beneficiaries" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No household size data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* District Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  District Distribution
                </CardTitle>
                <CardDescription>Beneficiaries by district</CardDescription>
              </CardHeader>
              <CardContent>
                {districtData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={districtData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="district" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => fmt(value)} />
                      <Bar dataKey="count" name="Beneficiaries">
                        {districtData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={DISTRICT_COLORS[index % DISTRICT_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-12">No district data available</p>
                )}
              </CardContent>
            </Card>

            {/* Marriage Status + Disability */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Marriage Status
                  </CardTitle>
                  <CardDescription>Married vs unmarried breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  {marriageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={marriageData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const total = marriageData.reduce((s, d) => s + (d.value as number), 0);
                            const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                            return `${entry.name}: ${fmt(entry.value)} (${pct}%)`;
                          }}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {marriageData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No marriage status data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Accessibility className="w-5 h-5 text-primary" />
                    Disability Status
                  </CardTitle>
                  <CardDescription>Beneficiaries with disabilities</CardDescription>
                </CardHeader>
                <CardContent>
                  {disabilityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={disabilityData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const total = disabilityData.reduce((s, d) => s + (d.value as number), 0);
                            const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                            return `${entry.name}: ${fmt(entry.value)} (${pct}%)`;
                          }}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {disabilityData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No disability data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Occupation + Informal Working */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Occupation Status
                  </CardTitle>
                  <CardDescription>Has occupation vs no occupation</CardDescription>
                </CardHeader>
                <CardContent>
                  {occupationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={occupationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const total = occupationData.reduce((s, d) => s + (d.value as number), 0);
                            const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                            return `${entry.name}: ${fmt(entry.value)} (${pct}%)`;
                          }}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {occupationData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No occupation data available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-primary" />
                    Informal Working
                  </CardTitle>
                  <CardDescription>Informal vs formal employment</CardDescription>
                </CardHeader>
                <CardContent>
                  {informalWorkingData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={informalWorkingData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => {
                            const total = informalWorkingData.reduce((s, d) => s + (d.value as number), 0);
                            const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                            return `${entry.name}: ${fmt(entry.value)} (${pct}%)`;
                          }}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {informalWorkingData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-12">No informal working data available</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* SOCIOECONOMIC SECTION */}
            <section className="space-y-6 pb-12">
              <div className="flex items-center gap-3">
                <Home className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Socioeconomic Indicators</h2>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Land Ownership</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {socioeconomic.land_ownership_rate != null
                        ? `${(socioeconomic.land_ownership_rate * 100).toFixed(1)}%`
                        : "--"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Own some land</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Avg Cattle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {socioeconomic.avg_cattle != null ? Number(socioeconomic.avg_cattle).toFixed(1) : "--"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Per household</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Earth Floor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {socioeconomic.earth_floor_rate != null
                        ? `${(socioeconomic.earth_floor_rate * 100).toFixed(1)}%`
                        : "--"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Have earth/sand floor</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Lighting Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {socioeconomic.lighting_rate != null
                        ? `${(socioeconomic.lighting_rate * 100).toFixed(1)}%`
                        : "--"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Have lighting</p>
                  </CardContent>
                </Card>
              </div>

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
                      {socioeconomic.land_ownership_pct != null
                        ? fmtPct(socioeconomic.land_ownership_pct)
                        : socioeconomic.land_ownership_rate != null
                          ? `${(socioeconomic.land_ownership_rate * 100).toFixed(1)}%`
                          : "--"}
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-primary" />
                      Assets Distribution
                    </CardTitle>
                    <CardDescription>Household asset ownership (Radio, Phone, TV)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={assetsDistributionData}>
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
                          label={(entry: any) => `${entry.category}: ${entry.value}`}
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
          </TabsContent>

          {/* ============================================================ */}
          {/* INSIGHT TAB */}
          {/* ============================================================ */}
          <TabsContent value="insight" className="space-y-12">
            {/* ── PHASE 1: SELECTION & ELIGIBILITY ──────────────── */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Phase 1 — Selection &amp; Eligibility</h2>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Total Beneficiaries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">{fmt(demographics.total_beneficiaries ?? overview.total_beneficiaries)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Registered in system</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Selected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">
                      {fmt(impact?.phase_beneficiaries?.phase1?.total ?? overview.selected_count)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Women: {fmt(impact?.phase_beneficiaries?.phase1?.female_count)}
                      {impact?.phase_beneficiaries?.phase1?.female_pct != null &&
                        ` (${impact.phase_beneficiaries.phase1.female_pct}%)`}
                    </p>
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
                      {overview.avg_eligibility ?? overview.avg_eligibility_score ?? "--"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Out of 100</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Completion Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">{fmtPct(overview.completion_rate)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Phase 1 completion</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-primary" />
                      Selection Status
                    </CardTitle>
                    <CardDescription>Current status across the program</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectionData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={selectionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry) => `${entry.status}: ${fmt(entry.count)}`}
                            outerRadius={100}
                            dataKey="count"
                          >
                            {selectionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-12">No status data available</p>
                    )}
                  </CardContent>
                </Card>

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
              </div>

            </section>

            {/* ── PHASE 2: TRAINING & ENGAGEMENT ──────────────── */}
            <section className="space-y-6 pb-12">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Phase 2 — Training &amp; Engagement</h2>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Employment Track
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">
                      {fmt(impact?.phase_beneficiaries?.phase2_employment?.total ?? overview.employment_track)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Women: {fmt(impact?.phase_beneficiaries?.phase2_employment?.female_count)}
                      {impact?.phase_beneficiaries?.phase2_employment?.female_pct != null &&
                        ` (${impact.phase_beneficiaries.phase2_employment.female_pct}%)`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Entrepreneurship Track
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">
                      {fmt(impact?.phase_beneficiaries?.phase2_entrepreneurship?.total ?? overview.entrepreneurship_track)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Women: {fmt(impact?.phase_beneficiaries?.phase2_entrepreneurship?.female_count)}
                      {impact?.phase_beneficiaries?.phase2_entrepreneurship?.female_pct != null &&
                        ` (${impact.phase_beneficiaries.phase2_entrepreneurship.female_pct}%)`}
                    </p>
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
                    <div className="text-4xl font-bold text-primary">{fmt(overview.chatbot_sessions)}</div>
                    <p className="text-xs text-muted-foreground mt-2">Phase 2 total</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Daily Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{fmt(engagement.daily_active_users)}</div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {engagement.daily_active_pct != null
                        ? `${engagement.daily_active_pct}% of total`
                        : "Of total"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Avg. Chatbot Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {engagement.avg_chatbot_sessions ?? "--"}
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
                    <div className="text-3xl font-bold text-primary">{fmtPct(engagement.test_completion_pct)}</div>
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
                    <div className="text-3xl font-bold text-primary">{fmtPct(engagement.weekly_engagement_pct)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Average rate</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-primary" />
                      Phase Distribution
                    </CardTitle>
                    <CardDescription>Employment vs Entrepreneurship track</CardDescription>
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Chatbot Usage Trend
                    </CardTitle>
                    <CardDescription>Weekly chatbot session growth</CardDescription>
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
              </div>

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
            </section>
          </TabsContent>

          {/* ============================================================ */}
          {/* INDICATORS TAB */}
          {/* ============================================================ */}
          <TabsContent value="indicators" className="space-y-12">
            {impact ? (
              <>
                {/* NEWLY HIRED SECTION */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Newly Hired</h2>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Hired / Self-Employed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-primary">{fmt(impact.newly_hired.total)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total beneficiaries</p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Women Ratio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-emerald-600">{fmtPct(impact.newly_hired.female_pct)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{fmt(impact.newly_hired.female_count)} women</p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Wage Employment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-blue-500">{fmt(impact.newly_hired.wage_employment.total)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{fmtPct(impact.newly_hired.wage_employment.female_pct)} women</p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-violet-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Self Employment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-violet-500">{fmt(impact.newly_hired.self_employment.total)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{fmtPct(impact.newly_hired.self_employment.female_pct)} women</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Employment Outcomes — Total vs Female</CardTitle>
                      <CardDescription>Comparison across employment categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={[
                          { label: "Newly Hired", Total: impact.newly_hired.total, Female: impact.newly_hired.female_count },
                          { label: "Wage Emp.", Total: impact.newly_hired.wage_employment.total, Female: impact.newly_hired.wage_employment.female_count },
                          { label: "Self Emp.", Total: impact.newly_hired.self_employment.total, Female: impact.newly_hired.self_employment.female_count },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="label" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Total" fill="#10b981" />
                          <Bar dataKey="Female" fill="#059669" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </section>

                {/* EMPLOYABILITY SECTION */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Employability</h2>
                  </div>
                  <Separator />

                  <p className="text-sm text-muted-foreground">
                    Beneficiaries who completed SkillCraft, achieved Pathways completion rate of 80%+, and have offline attendance greater than 8.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Employable Beneficiaries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-primary">{fmt(impact.employability.total)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Met all criteria</p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Women Ratio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-emerald-600">{fmtPct(impact.employability.female_pct)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{fmt(impact.employability.female_count)} women</p>
                      </CardContent>
                    </Card>
                  </div>

                </section>

                {/* GRANTS DISBURSED SECTION */}
                <section className="space-y-6 pb-12">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Grants Disbursed</h2>
                  </div>
                  <Separator />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-primary">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Recipients</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-primary">{fmt(impact.grants.total_recipients)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Received grants</p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-600">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Women Ratio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-emerald-600">{fmtPct(impact.grants.female_pct)}</div>
                        <p className="text-xs text-muted-foreground mt-1">{fmt(impact.grants.female_count)} women</p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-amber-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Total Disbursed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-amber-500">{fmtRwf(impact.grants.total_amount)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Combined amount</p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Avg. Grant Amount</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-blue-500">{fmtRwf(impact.grants.avg_amount)}</div>
                        <p className="text-xs text-muted-foreground mt-1">Per recipient</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Grant Amount Distribution</CardTitle>
                      <CardDescription>Number of recipients by grant amount range (RWF)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={impact.grants.distribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Recipients" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                </section>
              </>
            ) : (
              <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground">No indicator data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
