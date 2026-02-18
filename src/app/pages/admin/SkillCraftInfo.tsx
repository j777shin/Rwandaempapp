import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { api } from "@/app/lib/api";

export function SkillCraftInfo() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.adminGetPhase1Dashboard();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Failed to load SkillCraft data");
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

  const sc = data?.skillcraft || {};
  const totalSelected = data?.total_selected || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">SkillCraft Test Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Overview of SkillCraft test completion and performance across all Phase 1 beneficiaries.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Tests Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#00A1DE]">
                {sc.completed?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                of {totalSelected.toLocaleString()} selected
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#FAD201]">
                {sc.avg_score?.toFixed(1) ?? "N/A"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-[#00A651]">
                {((sc.completion_rate || 0) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
