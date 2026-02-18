import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Award, Building2, Briefcase, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Progress } from "@/app/components/ui/progress";
import { api } from "@/app/lib/api";

interface Candidate {
  id: string;
  name: string;
  skillcraft_score: number | null;
  pathways_completion_rate: number | null;
  offline_attendance: number;
  wants_entrepreneurship: boolean;
}

export function TrackAssignment() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [entrepreneurCandidates, setEntrepreneurCandidates] = useState<Candidate[]>([]);
  const [employmentCandidates, setEmploymentCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entRes, empRes] = await Promise.all([
          api.adminListBeneficiaries({ track: "entrepreneurship", page_size: "100" }),
          api.adminListBeneficiaries({ track: "employment", page_size: "100" }),
        ]);
        setEntrepreneurCandidates(entRes.items || []);
        setEmploymentCandidates(empRes.items || []);
      } catch (err: any) {
        setError(err.message || "Failed to load candidates");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderCandidateDetails = (candidate: Candidate | undefined) => {
    if (!candidate) return null;

    return (
      <div className="space-y-4">
        <div className="pb-4 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {candidate.id.substring(0, 8)}...</p>
        </div>

        {/* SkillCraft Score */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-neutral-700">SkillCraft Score</span>
            <span className="text-2xl font-bold text-foreground">
              {candidate.skillcraft_score != null ? `${candidate.skillcraft_score}/100` : "N/A"}
            </span>
          </div>
          <Progress value={candidate.skillcraft_score || 0} className="h-2" />
        </div>

        {/* Pathways Completion Rate */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-neutral-700">Pathways Completion Rate</span>
            <span className="text-2xl font-bold text-foreground">
              {candidate.pathways_completion_rate != null ? `${candidate.pathways_completion_rate}%` : "N/A"}
            </span>
          </div>
          <Progress value={candidate.pathways_completion_rate || 0} className="h-2" />
        </div>

        {/* Offline Training Attendance */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-neutral-700">Offline Attendance</span>
            <span className="text-2xl font-bold text-foreground">{candidate.offline_attendance}%</span>
          </div>
          <Progress value={candidate.offline_attendance} className="h-2" />
        </div>

        {/* Business Interest */}
        <div className={`p-4 rounded-lg border ${
          candidate.wants_entrepreneurship
            ? "bg-primary/5 border-primary"
            : "bg-red-50 border-red-500"
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Business Interest</span>
            <div className="flex items-center gap-2">
              {candidate.wants_entrepreneurship ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-bold text-primary">YES</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-500">NO</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>Failed to load candidates: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 bg-background">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Track Assignee View</h1>
            <p className="text-muted-foreground">View Phase 2 beneficiaries in Employment or Entrepreneurship tracks</p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary text-primary">Phase 2</Badge>
      </div>

      {/* Track Tabs */}
      <Tabs defaultValue="entrepreneur" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-neutral-100">
          <TabsTrigger value="entrepreneur" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Briefcase className="w-4 h-4" />
            Entrepreneur ({entrepreneurCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="employment" className="flex items-center gap-2 data-[state=active]:bg-white">
            <Building2 className="w-4 h-4" />
            Employment ({employmentCandidates.length})
          </TabsTrigger>
        </TabsList>

        {/* Entrepreneur Track Tab */}
        <TabsContent value="entrepreneur">
          <Card className="bg-white border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-foreground">Entrepreneur Track Candidates</CardTitle>
                  <CardDescription>Beneficiaries assigned to the entrepreneurship track</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {entrepreneurCandidates.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">No candidates assigned to this track yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">
                      Candidates ({entrepreneurCandidates.length})
                    </h3>
                    {entrepreneurCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidate(candidate.id)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedCandidate === candidate.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-white"
                        }`}
                      >
                        <p className="font-semibold text-foreground">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Score: {candidate.skillcraft_score ?? "N/A"} | Pathways: {candidate.pathways_completion_rate ?? "N/A"}%
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-border rounded-lg p-6 bg-white min-h-[500px]">
                    {selectedCandidate ? (
                      renderCandidateDetails(
                        entrepreneurCandidates.find((c) => c.id === selectedCandidate)
                      )
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">Select a candidate to view their details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment Track Tab */}
        <TabsContent value="employment">
          <Card className="bg-white border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-neutral-700" />
                <div>
                  <CardTitle className="text-foreground">Employment Track Candidates</CardTitle>
                  <CardDescription>Beneficiaries assigned to the employment track</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {employmentCandidates.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">No candidates assigned to this track yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">
                      Candidates ({employmentCandidates.length})
                    </h3>
                    {employmentCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        onClick={() => setSelectedCandidate(candidate.id)}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedCandidate === candidate.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-white"
                        }`}
                      >
                        <p className="font-semibold text-foreground">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Score: {candidate.skillcraft_score ?? "N/A"} | Pathways: {candidate.pathways_completion_rate ?? "N/A"}%
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-border rounded-lg p-6 bg-white min-h-[500px]">
                    {selectedCandidate ? (
                      renderCandidateDetails(
                        employmentCandidates.find((c) => c.id === selectedCandidate)
                      )
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">Select a candidate to view their details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
