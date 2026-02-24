import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, UserCheck, Loader2, RotateCcw, ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { api } from "@/app/lib/api";

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  skillcraftScore: number;
  pathwaysRate: number;
  offlineAttendance: number;
  wantsEntrepreneurship: boolean;
  businessGoal: string;
  track: string;
}

function mapApiBeneficiary(raw: any): Beneficiary {
  return {
    id: raw.id,
    name: raw.name || `${raw.first_name ?? ""} ${raw.last_name ?? ""}`.trim(),
    age: raw.age ?? 0,
    gender: raw.gender ?? "",
    email: raw.email ?? "",
    skillcraftScore: raw.skillcraft_score ?? 0,
    pathwaysRate: raw.pathways_completion_rate ?? raw.pathways_completion ?? 0,
    offlineAttendance: raw.offline_attendance ?? 0,
    wantsEntrepreneurship: raw.wants_entrepreneurship ?? false,
    businessGoal: raw.business_development_text ?? "",
    track: raw.track ?? "",
  };
}

const PAGE_SIZE = 50;

export function BeneficiarySelection() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Action loading states
  const [applying, setApplying] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Summary counts
  const [entApplicants, setEntApplicants] = useState(0);
  const [empTrackCount, setEmpTrackCount] = useState(0);
  const [entTrackCount, setEntTrackCount] = useState(0);
  const [hasResults, setHasResults] = useState(false);

  // Search with debounce
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build API params
  const buildParams = useCallback(() => {
    const params: Record<string, string> = {
      selection_status: "selected",
      page: String(page),
      page_size: String(PAGE_SIZE),
    };
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    return params;
  }, [page, debouncedSearch]);

  // Fetch beneficiaries
  const loadBeneficiaries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = buildParams();
      const data = await api.adminListBeneficiaries(params);

      let items: any[];
      if (Array.isArray(data)) {
        items = data;
        setTotalCount(data.length);
      } else if (data.items) {
        items = data.items;
        setTotalCount(data.total ?? data.count ?? data.items.length);
      } else {
        items = [];
        setTotalCount(0);
      }

      const mapped = items.map(mapApiBeneficiary);
      setBeneficiaries(mapped);

      // Detect if phase 1 results have been applied (any beneficiary has skillcraft > 0)
      const anyScored = mapped.some((b) => b.skillcraftScore > 0);
      setHasResults(anyScored);
    } catch (err: any) {
      setError(err.message || "Failed to load beneficiaries");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // Fetch summary counts
  const loadSummary = useCallback(async () => {
    try {
      const results = await api.adminGetSelectionResults();
      setEntApplicants(0); // Will be updated from page data
      setEmpTrackCount(results.track_counts?.employment ?? 0);
      setEntTrackCount(results.track_counts?.entrepreneurship ?? 0);
    } catch {
      // Non-critical, ignore
    }
  }, []);

  // Load on mount and param changes
  useEffect(() => {
    loadBeneficiaries();
  }, [loadBeneficiaries]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleApplyResults = async () => {
    try {
      setApplying(true);
      setError(null);
      setActionMessage(null);
      const result = await api.adminApplyPhase1Results();
      setActionMessage(
        `Phase 1 results applied: ${result.updated?.toLocaleString()} beneficiaries updated, ${result.ent_applicants?.toLocaleString()} applied for entrepreneurship`
      );
      setPage(1);
      await Promise.all([loadBeneficiaries(), loadSummary()]);
    } catch (err: any) {
      setError(err.message || "Failed to apply Phase 1 results");
    } finally {
      setApplying(false);
    }
  };

  const handleRunSelection = async () => {
    try {
      setSelecting(true);
      setError(null);
      setActionMessage(null);
      const result = await api.adminRunPhase2Selection();
      setActionMessage(
        `Phase 2 selection complete: ${result.entrepreneurship?.toLocaleString()} → Entrepreneurship, ${result.employment?.toLocaleString()} → Employment`
      );
      setPage(1);
      await Promise.all([loadBeneficiaries(), loadSummary()]);
    } catch (err: any) {
      setError(err.message || "Failed to run Phase 2 selection");
    } finally {
      setSelecting(false);
    }
  };

  const handleResetPhase2 = async () => {
    try {
      setResetting(true);
      setError(null);
      setActionMessage(null);
      await api.adminResetPhase2();
      setActionMessage("Phase 2 reset complete — all generated data cleared");
      setIsResetDialogOpen(false);
      setPage(1);
      await Promise.all([loadBeneficiaries(), loadSummary()]);
    } catch (err: any) {
      setError(err.message || "Failed to reset Phase 2");
    } finally {
      setResetting(false);
    }
  };

  const trackLabel = (t: string) => {
    if (t === "employment") return "Employment";
    if (t === "entrepreneurship") return "Entrepreneurship";
    return "—";
  };

  const anyActionRunning = applying || selecting || resetting;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Phase 2 Selection</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {totalCount.toLocaleString()} selected beneficiaries
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleApplyResults}
                disabled={anyActionRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {applying ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {applying ? "Applying..." : "Apply Phase 1 Results"}
              </Button>
              <Button
                onClick={handleRunSelection}
                disabled={anyActionRunning || !hasResults}
                className="bg-green-600 hover:bg-green-700"
                title={!hasResults ? "Apply Phase 1 Results first" : ""}
              >
                {selecting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {selecting ? "Selecting..." : "Run Selection"}
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsResetDialogOpen(true)}
                disabled={anyActionRunning}
              >
                {resetting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                {resetting ? "Resetting..." : "Reset Phase 2"}
              </Button>
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
              </div>
            )}
            {actionMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{actionMessage}</span>
                <Button variant="ghost" size="sm" onClick={() => setActionMessage(null)}>Dismiss</Button>
              </div>
            )}

            {/* Summary Cards */}
            {(hasResults || empTrackCount > 0 || entTrackCount > 0) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Selected</p>
                    <p className="text-2xl font-bold text-primary">{totalCount.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Ent. Applicants</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {beneficiaries.filter((b) => b.wantsEntrepreneurship).length > 0
                        ? "~70%"
                        : "0"}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Employment Track</p>
                    <p className="text-2xl font-bold text-blue-600">{empTrackCount.toLocaleString()}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Entrepreneurship Track</p>
                    <p className="text-2xl font-bold text-green-600">{entTrackCount.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search */}
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading beneficiaries...</p>
              </div>
            ) : (
              <>
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead className="text-center">SkillCraft</TableHead>
                        <TableHead className="text-center">Pathways Rate</TableHead>
                        <TableHead className="text-center">Attendance</TableHead>
                        <TableHead className="text-center">Ent. Applied</TableHead>
                        <TableHead>Business Goal</TableHead>
                        <TableHead className="text-center">Track</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {beneficiaries.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                            No beneficiaries found
                          </TableCell>
                        </TableRow>
                      ) : (
                        beneficiaries.map((b) => (
                          <TableRow key={b.id} className="hover:bg-gray-100">
                            <TableCell className="font-medium">{b.name}</TableCell>
                            <TableCell>{b.age}</TableCell>
                            <TableCell>{b.gender}</TableCell>
                            <TableCell className="text-center font-semibold">
                              {b.skillcraftScore || "—"}
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {b.pathwaysRate ? `${b.pathwaysRate}%` : "—"}
                            </TableCell>
                            <TableCell className="text-center font-semibold">
                              {b.offlineAttendance || "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={b.wantsEntrepreneurship ? "default" : "secondary"}>
                                {b.wantsEntrepreneurship ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={b.businessGoal}>
                              {b.businessGoal || "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              {b.track ? (
                                <Badge variant="outline" className={
                                  b.track === "employment" ? "border-blue-500 text-blue-600" :
                                  b.track === "entrepreneurship" ? "border-green-500 text-green-600" : ""
                                }>
                                  {trackLabel(b.track)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages} ({totalCount.toLocaleString()} total)
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Reset Phase 2 Confirmation Dialog */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Phase 2</DialogTitle>
              <DialogDescription>
                This will clear all track assignments and generated Phase 1 results
                (SkillCraft scores, Pathways rates, attendance, entrepreneurship applications,
                and business goals). Beneficiaries will return to their Phase 1 selected state.
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleResetPhase2} disabled={resetting}>
                {resetting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4 mr-2" />
                )}
                {resetting ? "Resetting..." : "Confirm Reset"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
