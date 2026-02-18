import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  FileText,
  Download,
  Search,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { api } from "@/app/lib/api";

export function SurveyResults() {
  const [selectedSurvey, setSelectedSurvey] = useState("phase1");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, resultsRes] = await Promise.all([
        api.adminGetSurveyStats(selectedSurvey),
        api.adminGetSurveyResults(selectedSurvey, {
          skip: String(page * pageSize),
          limit: String(pageSize),
          ...(searchQuery ? { search: searchQuery } : {}),
        }),
      ]);
      setStats(statsRes);
      setResponses(resultsRes.results || []);
      setTotalResponses(resultsRes.total || 0);
    } catch (err) {
      console.error("Failed to fetch survey data:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedSurvey, page, searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [selectedSurvey, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await api.adminExportSurveyResults(selectedSurvey);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey_${selectedSurvey}_results.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const surveyLabels: Record<string, string> = {
    phase1: "Phase 1 Completion Survey",
    employment: "Employment Track Survey",
    entrepreneurship: "Entrepreneurship Track Survey",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Survey Results</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze survey responses from beneficiaries
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2" disabled={exporting}>
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export Results
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.total_responses ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {stats?.total_eligible ?? 0} eligible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${stats?.completion_rate ?? 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Of all eligible beneficiaries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : stats?.average_time_formatted ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              To complete survey
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Survey Tabs */}
      <Tabs value={selectedSurvey} onValueChange={setSelectedSurvey} className="space-y-4">
        <TabsList>
          <TabsTrigger value="phase1">Phase 1 Survey</TabsTrigger>
          <TabsTrigger value="employment">Employment Track</TabsTrigger>
          <TabsTrigger value="entrepreneurship">Entrepreneurship Track</TabsTrigger>
        </TabsList>

        {["phase1", "employment", "entrepreneurship"].map((surveyType) => (
          <TabsContent key={surveyType} value={surveyType} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{surveyLabels[surveyType]}</CardTitle>
                <CardDescription>
                  Survey responses from beneficiaries
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Responses Table */}
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : responses.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No survey responses found</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Beneficiary
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            District
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Completed
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {responses.map((response) => (
                          <tr key={response.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium">{response.beneficiary?.name}</div>
                                <div className="text-sm text-neutral-500">
                                  Age {response.beneficiary?.age}, {response.beneficiary?.gender}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">{response.beneficiary?.district || "-"}</td>
                            <td className="px-4 py-3 text-sm">
                              {response.completed_at
                                ? new Date(response.completed_at).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {response.completion_time
                                ? `${Math.round(response.completion_time / 60)} min`
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                {!loading && totalResponses > 0 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, totalResponses)} of {totalResponses} responses
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={(page + 1) * pageSize >= totalResponses}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
