import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "@/app/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { ArrowLeft, Users, TrendingUp, Home, Coins, GraduationCap, BarChart3, Loader2, MapPin, Heart, Accessibility, Briefcase, HardHat, Banknote } from "lucide-react";
import { Separator } from "@/app/components/ui/separator";
import {
  Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// Color palettes
const PIE_COLORS = ["#10b981", "#059669", "#047857", "#065f46", "#064e3b", "#0d9488", "#14b8a6", "#2dd4bf"];
const GENDER_COLORS = ["#10b981", "#059669"];
const DISTRICT_COLORS = ["#10b981", "#059669", "#047857", "#065f46", "#0d9488", "#14b8a6", "#2dd4bf", "#99f6e4"];
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

  // Phase-specific data
  const [phase1Demo, setPhase1Demo] = useState<DemographicsData>({});
  const [phase1Socio, setPhase1Socio] = useState<SocioeconomicData>({});
  const [phase2EmpDemo, setPhase2EmpDemo] = useState<DemographicsData>({});
  const [phase2EmpSocio, setPhase2EmpSocio] = useState<SocioeconomicData>({});
  const [phase2EntDemo, setPhase2EntDemo] = useState<DemographicsData>({});
  const [phase2EntSocio, setPhase2EntSocio] = useState<SocioeconomicData>({});
  const [phaseLoading, setPhaseLoading] = useState<Record<string, boolean>>({});
  const [phaseLoaded, setPhaseLoaded] = useState<Record<string, boolean>>({});

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

  const loadPhaseData = async (tab: string) => {
    if (phaseLoaded[tab] || phaseLoading[tab]) return;
    setPhaseLoading((prev) => ({ ...prev, [tab]: true }));
    try {
      if (tab === "phase1") {
        const [demo, socio] = await Promise.all([
          api.adminGetDemographics("phase1"),
          api.adminGetSocioeconomic("phase1"),
        ]);
        setPhase1Demo(demo ?? {});
        setPhase1Socio(socio ?? {});
      } else if (tab === "phase2") {
        const [empDemo, empSocio, entDemo, entSocio] = await Promise.all([
          api.adminGetDemographics("phase2_employment"),
          api.adminGetSocioeconomic("phase2_employment"),
          api.adminGetDemographics("phase2_entrepreneurship"),
          api.adminGetSocioeconomic("phase2_entrepreneurship"),
        ]);
        setPhase2EmpDemo(empDemo ?? {});
        setPhase2EmpSocio(empSocio ?? {});
        setPhase2EntDemo(entDemo ?? {});
        setPhase2EntSocio(entSocio ?? {});
      }
      setPhaseLoaded((prev) => ({ ...prev, [tab]: true }));
    } catch (err) {
      console.error(`Failed to load ${tab} data:`, err);
    } finally {
      setPhaseLoading((prev) => ({ ...prev, [tab]: false }));
    }
  };

  // ------------------------------------------------------------------
  // Reusable chart data builder + renderer for Basic / Phase tabs
  // ------------------------------------------------------------------
  function computeBasicChartData(demo: DemographicsData, socio: SocioeconomicData) {
    const _genderData = dictToChartArray(demo.gender);
    const _totalFromGender = _genderData.reduce((sum, d) => sum + (d.value as number), 0);
    const _femaleCount = demo.gender?.female ?? 0;
    const _femalePct = _totalFromGender > 0 ? ((_femaleCount / _totalFromGender) * 100).toFixed(1) : "--";

    const _ageData = demo.age_groups
      ? Object.entries(demo.age_groups).sort(([a], [b]) => a.localeCompare(b)).map(([group, count]) => ({ ageGroup: group, count }))
      : [];

    const _educationData = demo.education
      ? Object.entries(demo.education).sort(([, a], [, b]) => b - a).map(([level, count]) => ({ level: level.charAt(0).toUpperCase() + level.slice(1).replace(/_/g, " "), count }))
      : [];

    const _districtData = demo.districts
      ? Object.entries(demo.districts).sort(([, a], [, b]) => b - a).map(([district, count]) => ({ district, count }))
      : [];

    const _marriageData = dictToChartArray(demo.marriage_status);
    const _disabilityData = dictToChartArray(demo.disability);
    const _occupationData = dictToChartArray(demo.occupation);
    const _informalWorkingData = dictToChartArray(demo.informal_working);

    const _householdSizeData = demo.household_size_groups
      ? Object.entries(demo.household_size_groups).sort(([a], [b]) => a.localeCompare(b)).map(([group, count]) => ({ group, count }))
      : [];

    const _avgAgeEstimate = (() => {
      if (!demo.age_groups) return null;
      const midpoints: Record<string, number> = { "15-19": 17, "20-24": 22, "25-29": 27, "30-35": 32.5 };
      let totalAge = 0, totalCount = 0;
      for (const [group, count] of Object.entries(demo.age_groups)) {
        const mid = midpoints[group] ?? 25;
        totalAge += mid * count;
        totalCount += count;
      }
      return totalCount > 0 ? (totalAge / totalCount).toFixed(1) : null;
    })();

    const _assetsDistData = safeArray(socio.assets_distribution, (item) => ({ category: item.category ?? "", owners: item.owners ?? 0, percentage: item.percentage ?? 0 }));
    const _landOwnershipData = safeArray(socio.land_ownership, (item, idx) => ({ category: item.category ?? "", value: item.value ?? item.count ?? 0, color: PIE_COLORS[idx % PIE_COLORS.length] }));
    const _livestockData = safeArray(socio.livestock_ownership, (item) => ({ category: item.category ?? "", owners: item.owners ?? 0, percentage: item.percentage ?? 0 }));
    const _housingData = safeArray(socio.housing_quality, (item) => ({ quality: item.quality ?? "", count: item.count ?? 0 }));

    return {
      genderData: _genderData, totalFromGender: _totalFromGender, femaleCount: _femaleCount, femalePct: _femalePct,
      ageData: _ageData, educationData: _educationData, districtData: _districtData,
      marriageData: _marriageData, disabilityData: _disabilityData, occupationData: _occupationData,
      informalWorkingData: _informalWorkingData, householdSizeData: _householdSizeData,
      avgAgeEstimate: _avgAgeEstimate, avgHouseholdSize: socio.avg_household_size,
      assetsDistributionData: _assetsDistData, landOwnershipData: _landOwnershipData,
      livestockOwnershipData: _livestockData, housingQualityData: _housingData,
    };
  }

  function renderBasicTabContent(label: string, cd: ReturnType<typeof computeBasicChartData>) {
    return (
      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-primary">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Total Beneficiaries</CardTitle></CardHeader>
            <CardContent><div className="text-4xl font-bold text-primary">{fmt(cd.totalFromGender)}</div><p className="text-xs text-muted-foreground mt-2">{label}</p></CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Female Beneficiaries</CardTitle></CardHeader>
            <CardContent><div className="text-4xl font-bold text-primary">{cd.femalePct}%</div><p className="text-xs text-muted-foreground mt-2">{fmt(cd.femaleCount)} women enrolled</p></CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Users className="w-4 h-4" />Average Age</CardTitle></CardHeader>
            <CardContent><div className="text-4xl font-bold text-primary">{cd.avgAgeEstimate ?? "--"}</div><p className="text-xs text-muted-foreground mt-2">Years old</p></CardContent>
          </Card>
          <Card className="border-l-4 border-l-primary">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Home className="w-4 h-4" />Avg Household Size</CardTitle></CardHeader>
            <CardContent><div className="text-4xl font-bold text-primary">{cd.avgHouseholdSize != null ? Number(cd.avgHouseholdSize).toFixed(1) : "--"}</div><p className="text-xs text-muted-foreground mt-2">Members per household</p></CardContent>
          </Card>
        </div>

        {/* Gender + Age */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" />Gender Distribution</CardTitle><CardDescription>Male vs female breakdown</CardDescription></CardHeader>
            <CardContent>
              {cd.genderData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={cd.genderData} cx="50%" cy="50%" labelLine={false} label={(entry) => { const pct = cd.totalFromGender > 0 ? ((entry.value / cd.totalFromGender) * 100).toFixed(1) : 0; return `${entry.name}: ${fmt(entry.value)} (${pct}%)`; }} outerRadius={100} dataKey="value">{cd.genderData.map((_, index) => (<Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No gender data available</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Age Distribution</CardTitle><CardDescription>Beneficiaries by age group</CardDescription></CardHeader>
            <CardContent>
              {cd.ageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cd.ageData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="ageGroup" /><YAxis /><Tooltip formatter={(value: number) => fmt(value)} /><Bar dataKey="count" fill="#10b981" name="Beneficiaries" /></BarChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No age data available</p>}
            </CardContent>
          </Card>
        </div>

        {/* Education + Household Size */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" />Education Level</CardTitle><CardDescription>Educational background distribution</CardDescription></CardHeader>
            <CardContent>
              {cd.educationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cd.educationData} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="level" type="category" width={120} /><Tooltip formatter={(value: number) => fmt(value)} /><Bar dataKey="count" fill="#10b981" name="Beneficiaries" /></BarChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No education data available</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Home className="w-5 h-5 text-primary" />Household Size Distribution</CardTitle><CardDescription>Number of household members</CardDescription></CardHeader>
            <CardContent>
              {cd.householdSizeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cd.householdSizeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="group" /><YAxis /><Tooltip formatter={(value: number) => fmt(value)} /><Bar dataKey="count" fill="#10b981" name="Beneficiaries" /></BarChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No household size data available</p>}
            </CardContent>
          </Card>
        </div>

        {/* District */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" />District Distribution</CardTitle><CardDescription>Beneficiaries by district</CardDescription></CardHeader>
          <CardContent>
            {cd.districtData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={cd.districtData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="district" angle={-45} textAnchor="end" height={80} /><YAxis /><Tooltip formatter={(value: number) => fmt(value)} /><Bar dataKey="count" name="Beneficiaries">{cd.districtData.map((_, index) => (<Cell key={`cell-${index}`} fill={DISTRICT_COLORS[index % DISTRICT_COLORS.length]} />))}</Bar></BarChart>
              </ResponsiveContainer>
            ) : <p className="text-sm text-muted-foreground text-center py-12">No district data available</p>}
          </CardContent>
        </Card>

        {/* Marriage + Disability */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="w-5 h-5 text-primary" />Marriage Status</CardTitle><CardDescription>Married vs unmarried breakdown</CardDescription></CardHeader>
            <CardContent>
              {cd.marriageData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={cd.marriageData} cx="50%" cy="50%" labelLine={false} label={(entry) => { const total = cd.marriageData.reduce((s, d) => s + (d.value as number), 0); const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0; return `${entry.name}: ${fmt(entry.value)} (${pct}%)`; }} outerRadius={100} dataKey="value">{cd.marriageData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No marriage status data available</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Accessibility className="w-5 h-5 text-primary" />Disability Status</CardTitle><CardDescription>Beneficiaries with disabilities</CardDescription></CardHeader>
            <CardContent>
              {cd.disabilityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={cd.disabilityData} cx="50%" cy="50%" labelLine={false} label={(entry) => { const total = cd.disabilityData.reduce((s, d) => s + (d.value as number), 0); const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0; return `${entry.name}: ${fmt(entry.value)} (${pct}%)`; }} outerRadius={100} dataKey="value">{cd.disabilityData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No disability data available</p>}
            </CardContent>
          </Card>
        </div>

        {/* Occupation + Informal Working */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" />Occupation Status</CardTitle><CardDescription>Has occupation vs no occupation</CardDescription></CardHeader>
            <CardContent>
              {cd.occupationData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={cd.occupationData} cx="50%" cy="50%" labelLine={false} label={(entry) => { const total = cd.occupationData.reduce((s, d) => s + (d.value as number), 0); const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0; return `${entry.name}: ${fmt(entry.value)} (${pct}%)`; }} outerRadius={100} dataKey="value">{cd.occupationData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No occupation data available</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><HardHat className="w-5 h-5 text-primary" />Informal Working</CardTitle><CardDescription>Informal vs formal employment</CardDescription></CardHeader>
            <CardContent>
              {cd.informalWorkingData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={cd.informalWorkingData} cx="50%" cy="50%" labelLine={false} label={(entry) => { const total = cd.informalWorkingData.reduce((s, d) => s + (d.value as number), 0); const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0; return `${entry.name}: ${fmt(entry.value)} (${pct}%)`; }} outerRadius={100} dataKey="value">{cd.informalWorkingData.map((_, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              ) : <p className="text-sm text-muted-foreground text-center py-12">No informal working data available</p>}
            </CardContent>
          </Card>
        </div>

        {/* Socioeconomic Section */}
        <section className="space-y-6 pb-12">
          <div className="flex items-center gap-3"><Home className="w-6 h-6 text-primary" /><h2 className="text-2xl font-bold">Socioeconomic Indicators</h2></div>
          <Separator />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="w-5 h-5 text-primary" />Assets Distribution</CardTitle><CardDescription>Household asset ownership (Radio, Phone, TV)</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={cd.assetsDistributionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Bar yAxisId="left" dataKey="owners" fill="#10b981" name="Number of Owners" /><Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#059669" strokeWidth={2} name="Percentage %" /></ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Home className="w-5 h-5 text-primary" />Land Ownership Distribution</CardTitle><CardDescription>Land holdings by size</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={cd.landOwnershipData} cx="50%" cy="50%" labelLine={false} label={(entry: any) => `${entry.category}: ${entry.value}`} outerRadius={100} fill="#8884d8" dataKey="value">{cd.landOwnershipData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" />Livestock Ownership</CardTitle><CardDescription>Types of livestock owned by beneficiaries</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={cd.livestockOwnershipData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="category" /><YAxis yAxisId="left" /><YAxis yAxisId="right" orientation="right" /><Tooltip /><Legend /><Bar yAxisId="left" dataKey="owners" fill="#10b981" name="Number of Owners" /><Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#059669" strokeWidth={2} name="Percentage %" /></ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Home className="w-5 h-5 text-primary" />Housing Quality</CardTitle><CardDescription>Quality of beneficiary housing</CardDescription></CardHeader>
              <CardContent className="min-h-[320px]">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cd.housingQualityData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="quality" /><YAxis /><Tooltip /><Area type="monotone" dataKey="count" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Households" /></AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    );
  }

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

        <Tabs defaultValue="basic" className="space-y-6" onValueChange={(tab) => {
          if (tab === "phase1" || tab === "phase2") loadPhaseData(tab);
        }}>
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="phase1">Phase 1</TabsTrigger>
            <TabsTrigger value="phase2">Phase 2</TabsTrigger>
            <TabsTrigger value="indicators">Indicators</TabsTrigger>
          </TabsList>

          {/* ============================================================ */}
          {/* BASIC TAB */}
          {/* ============================================================ */}
          <TabsContent value="basic" className="space-y-8">
            {renderBasicTabContent("Registered in system", computeBasicChartData(demographics, socioeconomic))}
          </TabsContent>

          {/* ============================================================ */}
          {/* PHASE 1 TAB */}
          {/* ============================================================ */}
          <TabsContent value="phase1" className="space-y-8">
            {phaseLoading.phase1 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">Loading Phase 1 data...</p>
              </div>
            ) : phaseLoaded.phase1 ? (
              renderBasicTabContent("Phase 1 — Selected Beneficiaries", computeBasicChartData(phase1Demo, phase1Socio))
            ) : (
              <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground">Click to load Phase 1 data</p>
              </div>
            )}
          </TabsContent>

          {/* ============================================================ */}
          {/* PHASE 2 TAB */}
          {/* ============================================================ */}
          <TabsContent value="phase2" className="space-y-8">
            {phaseLoading.phase2 ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">Loading Phase 2 data...</p>
              </div>
            ) : phaseLoaded.phase2 ? (
              <>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Employment Track</h2>
                </div>
                <Separator />
                {renderBasicTabContent("Phase 2 — Employment Track", computeBasicChartData(phase2EmpDemo, phase2EmpSocio))}

                <div className="flex items-center gap-3 pt-8">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Entrepreneurship Track</h2>
                </div>
                <Separator />
                {renderBasicTabContent("Phase 2 — Entrepreneurship Track", computeBasicChartData(phase2EntDemo, phase2EntSocio))}
              </>
            ) : (
              <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground">Click to load Phase 2 data</p>
              </div>
            )}
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
