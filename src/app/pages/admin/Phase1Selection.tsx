import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, UserCheck, Loader2, Calculator, Play } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { api } from "@/app/lib/api";

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  eligibility_score: number | null;
  skillcraft_score: number | null;
  pathways_completion_rate: number | null;
  selection_status: string | null;
}

function BeneficiaryTable({ beneficiaries, onRowClick }: { beneficiaries: Beneficiary[]; onRowClick: (b: Beneficiary) => void }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Eligibility Score</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {beneficiaries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                No beneficiaries found
              </TableCell>
            </TableRow>
          ) : (
            beneficiaries.map((beneficiary) => (
              <TableRow
                key={beneficiary.id}
                onClick={() => onRowClick(beneficiary)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <TableCell className="font-medium">{beneficiary.name}</TableCell>
                <TableCell>{beneficiary.age}</TableCell>
                <TableCell>{beneficiary.gender}</TableCell>
                <TableCell className="text-muted-foreground">{beneficiary.email}</TableCell>
                <TableCell className="text-center">
                  {beneficiary.eligibility_score != null ? (
                    <>
                      <span className="font-semibold text-foreground">{beneficiary.eligibility_score}</span>
                      <span className="text-xs text-muted-foreground">/100</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {beneficiary.selection_status ? (
                    <Badge variant={beneficiary.selection_status === "selected" || beneficiary.selection_status === "phase1_selected" ? "default" : "secondary"}>
                      {beneficiary.selection_status}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function Phase1Selection() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectionCount, setSelectionCount] = useState(9000);
  const [calculatingScores, setCalculatingScores] = useState(false);
  const [runningSelection, setRunningSelection] = useState(false);

  const loadBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.adminListBeneficiaries({ page_size: 10000 });
      setBeneficiaries(data.items || data.beneficiaries || []);
    } catch (err: any) {
      setError(err.message || "Failed to load beneficiaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const handleCalculateScores = async () => {
    try {
      setCalculatingScores(true);
      setError(null);
      await api.adminCalculateScores();
      await loadBeneficiaries();
    } catch (err: any) {
      setError(err.message || "Failed to calculate scores");
    } finally {
      setCalculatingScores(false);
    }
  };

  const handleRunSelection = async () => {
    try {
      setRunningSelection(true);
      setError(null);
      await api.adminRunPhase1Selection(selectionCount);
      await loadBeneficiaries();
    } catch (err: any) {
      setError(err.message || "Failed to run Phase 1 selection");
    } finally {
      setRunningSelection(false);
    }
  };

  // Sort beneficiaries by eligibility_score descending
  const sortedBeneficiaries = [...beneficiaries].sort((a, b) => {
    return (b.eligibility_score ?? 0) - (a.eligibility_score ?? 0);
  });

  // Detect if selection has been run
  const selectionHasRun = beneficiaries.some(b => b.selection_status === "selected" || b.selection_status === "phase1_selected");
  const selectedBens = sortedBeneficiaries.filter(b => b.selection_status === "selected" || b.selection_status === "phase1_selected");
  const unselectedBens = sortedBeneficiaries.filter(b => b.selection_status !== "selected" && b.selection_status !== "phase1_selected");

  // Filtered beneficiaries based on search
  const filteredBeneficiaries = sortedBeneficiaries.filter(beneficiary => {
    const fullName = (beneficiary.name || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      (beneficiary.email || "").toLowerCase().includes(query) ||
      beneficiary.id.toString().toLowerCase().includes(query)
    );
  });

  const handleRowClick = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDialogOpen(true);
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

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Phase 1 Selection</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Beneficiaries: {beneficiaries.length} | Sorted by Eligibility Score (highest first)
                </p>
              </div>
            </div>
            {selectionHasRun && (
              <Badge variant="outline" className="border-primary text-primary ml-auto">
                {selectedBens.length} Selected
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleCalculateScores}
                disabled={calculatingScores || loading}
                variant="outline"
              >
                {calculatingScores ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Calculator className="w-4 h-4 mr-2" />
                )}
                {calculatingScores ? "Calculating..." : "Calculate Scores"}
              </Button>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={selectionCount}
                  onChange={(e) => setSelectionCount(Number(e.target.value))}
                  className="w-28"
                  min={1}
                />
                <Button
                  onClick={handleRunSelection}
                  disabled={runningSelection || loading}
                >
                  {runningSelection ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {runningSelection ? "Running..." : "Run Phase 1 Selection"}
                </Button>
              </div>
            </div>

            {/* Search */}
            <Input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading beneficiaries...</span>
              </div>
            ) : selectionHasRun ? (
              /* Tabbed view: Selected / Unselected */
              <Tabs defaultValue="selected">
                <TabsList>
                  <TabsTrigger value="selected">
                    Selected ({selectedBens.length})
                  </TabsTrigger>
                  <TabsTrigger value="unselected">
                    Unselected ({unselectedBens.length})
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="selected">
                  <BeneficiaryTable
                    beneficiaries={selectedBens.filter(b => {
                      const q = searchQuery.toLowerCase();
                      return !q || b.name.toLowerCase().includes(q) || (b.email || "").toLowerCase().includes(q);
                    })}
                    onRowClick={handleRowClick}
                  />
                </TabsContent>
                <TabsContent value="unselected">
                  <BeneficiaryTable
                    beneficiaries={unselectedBens.filter(b => {
                      const q = searchQuery.toLowerCase();
                      return !q || b.name.toLowerCase().includes(q) || (b.email || "").toLowerCase().includes(q);
                    })}
                    onRowClick={handleRowClick}
                  />
                </TabsContent>
              </Tabs>
            ) : (
              /* Single table before selection */
              <BeneficiaryTable
                beneficiaries={filteredBeneficiaries}
                onRowClick={handleRowClick}
              />
            )}
          </CardContent>
        </Card>

        {/* Candidate Information Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">Candidate Information</DialogTitle>
              <DialogDescription>
                {selectedBeneficiary && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-foreground">
                      {selectedBeneficiary.name}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{selectedBeneficiary.id}</span>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              {selectedBeneficiary && (
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Full Name</h4>
                      <p className="text-foreground">
                        {selectedBeneficiary.name}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">ID</h4>
                      <p className="text-foreground">{selectedBeneficiary.id}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Age</h4>
                      <p className="text-foreground">{selectedBeneficiary.age} years</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Gender</h4>
                      <p className="text-foreground">{selectedBeneficiary.gender}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Email</h4>
                      <p className="text-foreground">{selectedBeneficiary.email}</p>
                    </div>
                  </div>

                  {/* Scores Section */}
                  <div className="border-t border-border pt-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      {/* Eligibility Score */}
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">Eligibility Score</span>
                          <span className="text-2xl font-bold text-primary">
                            {selectedBeneficiary.eligibility_score ?? "--"}/100
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${selectedBeneficiary.eligibility_score ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* SkillCraft Score */}
                      <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-neutral-700">SkillCraft Score</span>
                          <span className="text-xl font-bold text-foreground">
                            {selectedBeneficiary.skillcraft_score ?? "--"}/100
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-neutral-600 h-2 rounded-full transition-all"
                            style={{ width: `${selectedBeneficiary.skillcraft_score ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Pathway Completion */}
                      <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-neutral-700">Pathway Completion</span>
                          <span className="text-xl font-bold text-foreground">
                            {selectedBeneficiary.pathways_completion_rate ?? "--"}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div
                            className="bg-neutral-600 h-2 rounded-full transition-all"
                            style={{ width: `${selectedBeneficiary.pathways_completion_rate ?? 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Selection Status */}
                      <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-neutral-700">Selection Status</span>
                          <span className="text-xl font-bold text-foreground">
                            {selectedBeneficiary.selection_status ? (
                              <Badge
                                variant={selectedBeneficiary.selection_status === "selected" ? "default" : "secondary"}
                              >
                                {selectedBeneficiary.selection_status}
                              </Badge>
                            ) : (
                              "--"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
