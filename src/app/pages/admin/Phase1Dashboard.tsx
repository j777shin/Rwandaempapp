import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, LayoutDashboard, Users, Loader2 } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "@/app/lib/api";

export function Phase1Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [demographics, setDemographics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, demo] = await Promise.all([
          api.adminGetPhase1Dashboard(),
          api.adminGetDemographics(),
        ]);
        setDashboardData(dash);
        setDemographics(demo);
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

  const GENDER_COLORS = [COLORS.blue, COLORS.green, "#8B5CF6"];

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

  const ageDistribution = Object.entries(demographics?.age_groups || {}).map(([group, count]) => ({
    ageGroup: group,
    count: count as number,
  }));

  const genderDistribution = Object.entries(demographics?.gender || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: value as number,
  }));

  const educationDistribution = Object.entries(demographics?.education || {}).map(([level, count]) => ({
    level,
    count: count as number,
  }));

  const districtDistribution = Object.entries(demographics?.districts || {}).map(([district, count]) => ({
    district,
    count: count as number,
  }));

  const totalBeneficiaries = dashboardData?.total_selected || 0;
  const totalGender = genderDistribution.reduce((sum, g) => sum + g.value, 0);

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
              <p className="text-muted-foreground">Training Phase Analytics - {totalBeneficiaries.toLocaleString()} Beneficiaries</p>
            </div>
          </div>
          <Badge variant="outline" className="border-[#00A1DE] text-[#00A1DE]">Phase 1 - Training</Badge>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Selected</p>
              <p className="text-2xl font-bold text-[#00A1DE]">{totalBeneficiaries.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">SkillCraft Completed</p>
              <p className="text-2xl font-bold text-[#00A651]">
                {dashboardData?.skillcraft?.completed?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {((dashboardData?.skillcraft?.completion_rate || 0) * 100).toFixed(1)}% rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Pathways Enrolled</p>
              <p className="text-2xl font-bold text-[#FAD201]">
                {dashboardData?.pathways?.enrolled?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {((dashboardData?.pathways?.enrollment_rate || 0) * 100).toFixed(1)}% rate
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
              <p className="text-2xl font-bold text-[#00A1DE]">
                {dashboardData?.avg_offline_attendance?.toFixed(0) || 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg SkillCraft Score</p>
              <p className="text-3xl font-bold text-[#00A651]">
                {dashboardData?.skillcraft?.avg_score?.toFixed(1) ?? "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Avg Pathways Completion</p>
              <p className="text-3xl font-bold text-[#00A1DE]">
                {dashboardData?.pathways?.avg_completion != null
                  ? `${dashboardData.pathways.avg_completion.toFixed(1)}%`
                  : "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Business Dev Interest</p>
              <p className="text-3xl font-bold text-[#FAD201]">
                {dashboardData?.business_development?.interested?.toLocaleString() || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                {((dashboardData?.business_development?.interest_rate || 0) * 100).toFixed(1)}% rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demographic Analysis */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#00A1DE]" />
              <div>
                <CardTitle>Beneficiary Demographic Analysis</CardTitle>
                <CardDescription>Demographic breakdown of Phase 1 participants</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Distribution */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A1DE]">Age Distribution</h3>
                {ageDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={ageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.blue} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No age data available</p>
                )}
              </div>

              {/* Gender Distribution */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A651]">Gender Distribution</h3>
                {genderDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={genderDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${totalGender ? ((value / totalGender) * 100).toFixed(0) : 0}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {genderDistribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No gender data available</p>
                )}
              </div>

              {/* Education Level */}
              <div>
                <h3 className="font-semibold mb-4 text-[#FAD201]">Education Level Distribution</h3>
                {educationDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={educationDistribution} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="level" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.yellow} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No education data available</p>
                )}
              </div>

              {/* District Distribution */}
              <div>
                <h3 className="font-semibold mb-4 text-[#00A1DE]">District Distribution</h3>
                {districtDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={districtDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="district" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.green} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No district data available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
