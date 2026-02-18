import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Briefcase, Loader2, Search, MessageCircle, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { api } from "@/app/lib/api";

interface EntBeneficiary {
  id: string;
  name: string;
  email: string;
  stages_completed: number;
  total_stages: number;
  report_ready: boolean;
  entrepreneurship_score: number | null;
  readiness_level: string | null;
}

interface StageDetail {
  stage_number: number;
  stage_name: string;
  status: string;
  summary: string | null;
}

export function EntrepreneurProgress() {
  const [beneficiaries, setBeneficiaries] = useState<EntBeneficiary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // "More" dialog state
  const [moreDialogOpen, setMoreDialogOpen] = useState(false);
  const [moreData, setMoreData] = useState<any>(null);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.adminGetEntrepreneurshipProgress();
        if (cancelled) return;
        const items: EntBeneficiary[] = (Array.isArray(data) ? data : data.items ?? []).map((b: any) => ({
          id: b.id,
          name: b.name || "",
          email: b.email || "",
          stages_completed: b.stages_completed ?? 0,
          total_stages: b.total_stages ?? 5,
          report_ready: b.report_ready ?? false,
          entrepreneurship_score: b.entrepreneurship_score ?? null,
          readiness_level: b.readiness_level ?? null,
        }));
        setBeneficiaries(items);
        if (items.length > 0) setSelectedId(items[0].id);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  const filtered = beneficiaries.filter(b => {
    const q = search.toLowerCase();
    return !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q);
  });

  const selected = beneficiaries.find(b => b.id === selectedId) || null;

  const isCompleted = (b: EntBeneficiary) => b.report_ready || b.stages_completed >= b.total_stages;

  const handleShowMore = async (b: EntBeneficiary) => {
    setMoreDialogOpen(true);
    setMoreData(null);
    setMoreLoading(true);
    try {
      const data = await api.adminGetBeneficiaryConversations(b.id);
      setMoreData(data);
    } catch (err) {
      console.error("Failed to load conversation data:", err);
    } finally {
      setMoreLoading(false);
    }
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

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Entrepreneur Track View</CardTitle>
                <CardDescription>View chatbot progress and results for entrepreneurship track beneficiaries</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {!loading && !error && beneficiaries.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No entrepreneurship track beneficiaries found.</p>
          </div>
        )}

        {!loading && !error && beneficiaries.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Beneficiaries ({beneficiaries.length})</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y max-h-[60vh] overflow-y-auto">
                    {filtered.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedId(b.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedId === b.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {b.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{b.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{b.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {isCompleted(b) ? (
                                <Badge variant="default" className="text-xs h-5">Completed</Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">Stage {b.stages_completed}/{b.total_stages}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">No results found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {selected.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selected.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selected.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Chatbot Progress */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Chatbot Progress</p>
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        Stage {selected.stages_completed} of {selected.total_stages}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                      <div className="flex items-center gap-2">
                        {isCompleted(selected) ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            <span className="text-lg font-semibold text-green-600">Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-5 h-5 text-yellow-600" />
                            <span className="text-lg font-semibold text-yellow-600">In Progress</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Score (if available) */}
                    {selected.entrepreneurship_score != null && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Entrepreneurship Score</p>
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-bold text-primary">{selected.entrepreneurship_score.toFixed(0)}/100</p>
                          {selected.readiness_level && (
                            <Badge variant="outline" className="border-primary text-primary">
                              {selected.readiness_level}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* More button */}
                    <Button
                      variant="outline"
                      onClick={() => handleShowMore(selected)}
                      className="w-full"
                    >
                      View Summarized Results
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Select a beneficiary to view their details.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* More Dialog - Summarized Results */}
        <Dialog open={moreDialogOpen} onOpenChange={setMoreDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Summarized Results</DialogTitle>
              <DialogDescription>
                Chatbot stage summaries and assessment details
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {moreLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : moreData ? (
                <div className="space-y-4">
                  {/* Stage summaries */}
                  {(() => {
                    const stages: StageDetail[] = moreData.stages || moreData.stage_summaries || [];
                    if (stages.length === 0) {
                      return <p className="text-sm text-muted-foreground">No stage data available.</p>;
                    }
                    return stages.map((stage, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm text-foreground">
                            Stage {stage.stage_number}: {stage.stage_name}
                          </h4>
                          <Badge variant={stage.status === "completed" ? "default" : "secondary"} className="text-xs">
                            {stage.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {stage.summary || "No summary available."}
                        </p>
                      </div>
                    ));
                  })()}

                  {/* Report summary if available */}
                  {moreData.report && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium text-foreground mb-2">Assessment Report</h4>
                      {moreData.report.entrepreneurship_score != null && (
                        <div className="bg-primary/5 rounded-lg p-4 mb-3 text-center">
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-3xl font-bold text-primary">{moreData.report.entrepreneurship_score.toFixed(0)}/100</p>
                          {moreData.report.readiness_level && (
                            <Badge className="mt-1">{moreData.report.readiness_level}</Badge>
                          )}
                        </div>
                      )}
                      {moreData.report.summary && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{moreData.report.summary}</p>
                        </div>
                      )}
                      {moreData.report.recommendations && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Recommendations</p>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{moreData.report.recommendations}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Failed to load data.</p>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
