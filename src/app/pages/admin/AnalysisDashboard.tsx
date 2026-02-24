import { useEffect, useState } from "react";
import { Link } from "react-router";
import { api } from "@/app/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Button } from "@/app/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  Users,
  Layers,
  Banknote,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  blue: "#00A1DE",
  green: "#00A651",
  yellow: "#FAD201",
};

function fmt(val: number | null | undefined) {
  if (val == null) return "--";
  return val.toLocaleString();
}

function fmtPct(val: number | null | undefined) {
  if (val == null) return "--";
  return `${val}%`;
}

function fmtRwf(val: number | null | undefined) {
  if (val == null) return "--";
  return `${val.toLocaleString()} RWF`;
}

interface StatGroup {
  total: number;
  female_count: number;
  female_pct: number;
}

interface GrantDistBucket {
  range: string;
  count: number;
}

interface GrantData {
  total_recipients: number;
  female_count: number;
  female_pct: number;
  total_amount: number;
  avg_amount: number;
  distribution: GrantDistBucket[];
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
  grants: GrantData;
}

export function AnalysisDashboard() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const result = await api.adminGetImpactDashboard();
        setData(result);
      } catch {
        setError("Failed to load analysis data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/admin">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const employmentBarData = [
    {
      label: "Newly Hired",
      Total: data.newly_hired.total,
      Female: data.newly_hired.female_count,
    },
    {
      label: "Wage Emp.",
      Total: data.newly_hired.wage_employment.total,
      Female: data.newly_hired.wage_employment.female_count,
    },
    {
      label: "Self Emp.",
      Total: data.newly_hired.self_employment.total,
      Female: data.newly_hired.self_employment.female_count,
    },
  ];

  const employabilityPieData = [
    { name: "Female", value: data.employability.female_count },
    {
      name: "Male",
      value: Math.max(0, data.employability.total - data.employability.female_count),
    },
  ];
  const PIE_COLORS = [COLORS.green, COLORS.blue];

  const phaseBarData = [
    {
      label: "Phase 1",
      Total: data.phase_beneficiaries.phase1.total,
      Female: data.phase_beneficiaries.phase1.female_count,
    },
    {
      label: "Phase 2 - Emp",
      Total: data.phase_beneficiaries.phase2_employment.total,
      Female: data.phase_beneficiaries.phase2_employment.female_count,
    },
    {
      label: "Phase 2 - Ent",
      Total: data.phase_beneficiaries.phase2_entrepreneurship.total,
      Female: data.phase_beneficiaries.phase2_entrepreneurship.female_count,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Programme impact indicators and gender disaggregation
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Employment Outcomes */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#00A1DE]" />
              <h2 className="text-2xl font-bold">Newly Hired</h2>
            </div>
            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Newly Hired / Self-Employed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A1DE]">
                    {fmt(data.newly_hired.total)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total beneficiaries
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A651]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Of which Women</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A651]">
                    {fmtPct(data.newly_hired.female_pct)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fmt(data.newly_hired.female_count)} women
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FAD201]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Wage Employment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#FAD201]">
                    {fmt(data.newly_hired.wage_employment.total)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fmtPct(data.newly_hired.wage_employment.female_pct)} women
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Self Employment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A1DE]">
                    {fmt(data.newly_hired.self_employment.total)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fmtPct(data.newly_hired.self_employment.female_pct)} women
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Employment Outcomes — Total vs Female</CardTitle>
                <CardDescription>
                  Comparison across employment categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employmentBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total" fill={COLORS.blue} />
                    <Bar dataKey="Female" fill={COLORS.green} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Section 2: Employability */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#00A651]" />
              <h2 className="text-2xl font-bold">Employability</h2>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Employable Beneficiaries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A1DE]">
                    {fmt(data.employability.total)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Completed attendance, SkillCraft, and Pathways
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A651]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Of which Women</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A651]">
                    {fmtPct(data.employability.female_pct)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fmt(data.employability.female_count)} women
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Employability — Gender Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={employabilityPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`
                      }
                      outerRadius={100}
                      dataKey="value"
                    >
                      {employabilityPieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Phase Beneficiaries */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Layers className="w-6 h-6 text-[#00A1DE]" />
              <h2 className="text-2xl font-bold">Phase Beneficiaries</h2>
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([
                { key: "phase1" as const, label: "Phase 1" },
                { key: "phase2_employment" as const, label: "Phase 2 - Employment" },
                { key: "phase2_entrepreneurship" as const, label: "Phase 2 - Entrepreneurship" },
              ]).map(({ key, label }) => (
                <Card key={key} className="border-l-4 border-l-[#00A1DE]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-[#00A1DE]">
                      {fmt(data.phase_beneficiaries[key].total)}
                    </div>
                    <p className="text-sm text-[#00A651] font-medium mt-1">
                      {fmt(data.phase_beneficiaries[key].female_count)} female
                      ({fmtPct(data.phase_beneficiaries[key].female_pct)})
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  Beneficiaries by Phase — Total vs Female
                </CardTitle>
                <CardDescription>
                  Population breakdown across programme phases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={phaseBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total" fill={COLORS.blue} />
                    <Bar dataKey="Female" fill={COLORS.green} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Grant Distribution */}
          <section className="space-y-6 pb-12">
            <div className="flex items-center gap-3">
              <Banknote className="w-6 h-6 text-[#FAD201]" />
              <h2 className="text-2xl font-bold">Grant Distribution</h2>
            </div>
            <Separator />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Recipients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A1DE]">
                    {fmt(data.grants.total_recipients)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Beneficiaries who received grants
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A651]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Of which Women</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-[#00A651]">
                    {fmtPct(data.grants.female_pct)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fmt(data.grants.female_count)} women
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#FAD201]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Disbursed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#FAD201]">
                    {fmtRwf(data.grants.total_amount)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Combined grant amount
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-[#00A1DE]">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Avg. Grant Amount</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#00A1DE]">
                    {fmtRwf(data.grants.avg_amount)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Per recipient
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Grant Amount Distribution</CardTitle>
                <CardDescription>
                  Number of recipients by grant amount range (RWF)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.grants.distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Recipients" fill={COLORS.yellow} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
