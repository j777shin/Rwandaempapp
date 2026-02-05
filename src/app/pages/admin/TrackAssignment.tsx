import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Award, Building2, Briefcase, CheckCircle2, XCircle, AlertCircle, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Progress } from "@/app/components/ui/progress";
import { useState } from "react";

export function TrackAssignment() {
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  
  // Information completion percentage (change this to test locked/unlocked state)
  const informationCompletion = 100; // Set to < 100 to see locked state

  // Mock candidate data
  const entrepreneurCandidates = [
    {
      id: "ENT001",
      name: "Jean Baptiste Mugisha",
      skillcraftScore: 85,
      pathwaysCompletionRate: 92,
      offlineTrainingCompletionRate: 100,
      businessConceptStatus: "pass"
    },
    {
      id: "ENT002",
      name: "Marie Claire Uwase",
      skillcraftScore: 78,
      pathwaysCompletionRate: 88,
      offlineTrainingCompletionRate: 95,
      businessConceptStatus: "pass"
    },
    {
      id: "ENT003",
      name: "Patrick Niyonzima",
      skillcraftScore: 92,
      pathwaysCompletionRate: 96,
      offlineTrainingCompletionRate: 100,
      businessConceptStatus: "pass"
    },
    {
      id: "ENT004",
      name: "Grace Mukamana",
      skillcraftScore: 74,
      pathwaysCompletionRate: 85,
      offlineTrainingCompletionRate: 90,
      businessConceptStatus: "fail"
    },
    {
      id: "ENT005",
      name: "Emmanuel Habimana",
      skillcraftScore: 88,
      pathwaysCompletionRate: 94,
      offlineTrainingCompletionRate: 98,
      businessConceptStatus: "pass"
    },
  ];

  const employmentCandidates = [
    {
      id: "EMP001",
      name: "Alice Uwineza",
      skillcraftScore: 82,
      pathwaysCompletionRate: 90,
      offlineTrainingCompletionRate: 95,
      businessConceptStatus: "fail"
    },
    {
      id: "EMP002",
      name: "David Kalisa",
      skillcraftScore: 76,
      pathwaysCompletionRate: 86,
      offlineTrainingCompletionRate: 92,
      businessConceptStatus: "fail"
    },
    {
      id: "EMP003",
      name: "Sarah Ingabire",
      skillcraftScore: 80,
      pathwaysCompletionRate: 88,
      offlineTrainingCompletionRate: 90,
      businessConceptStatus: "fail"
    },
    {
      id: "EMP004",
      name: "James Nkusi",
      skillcraftScore: 85,
      pathwaysCompletionRate: 91,
      offlineTrainingCompletionRate: 96,
      businessConceptStatus: "fail"
    },
    {
      id: "EMP005",
      name: "Linda Mukamazimpaka",
      skillcraftScore: 79,
      pathwaysCompletionRate: 87,
      offlineTrainingCompletionRate: 93,
      businessConceptStatus: "fail"
    },
  ];

  const handleMoveToEntrepreneurTrack = (candidateId: string) => {
    console.log("Moving candidate to entrepreneur track:", candidateId);
  };

  const handleMoveToEmploymentTrack = (candidateId: string) => {
    console.log("Moving candidate to employment track:", candidateId);
  };

  const renderCandidateDetails = (candidate: any) => {
    if (!candidate) return null;

    return (
      <div className="space-y-4">
        <div className="pb-4 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">{candidate.name}</h3>
          <p className="text-sm text-muted-foreground">ID: {candidate.id}</p>
        </div>

        {/* SkillCraft Score */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-neutral-700">SkillCraft Score</span>
            <span className="text-2xl font-bold text-foreground">{candidate.skillcraftScore}/100</span>
          </div>
          <Progress value={candidate.skillcraftScore} className="h-2" />
        </div>

        {/* Pathways Completion Rate */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-neutral-700">Pathways Completion Rate</span>
            <span className="text-2xl font-bold text-foreground">{candidate.pathwaysCompletionRate}%</span>
          </div>
          <Progress value={candidate.pathwaysCompletionRate} className="h-2" />
        </div>

        {/* Offline Training Completion Rate */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-neutral-700">Offline Training Completion Rate</span>
            <span className="text-2xl font-bold text-foreground">{candidate.offlineTrainingCompletionRate}%</span>
          </div>
          <Progress value={candidate.offlineTrainingCompletionRate} className="h-2" />
        </div>

        {/* Business Concept Status */}
        <div className={`p-4 rounded-lg border ${
          candidate.businessConceptStatus === "pass" 
            ? "bg-primary/5 border-primary" 
            : "bg-red-50 border-red-500"
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Business Concept</span>
            <div className="flex items-center gap-2">
              {candidate.businessConceptStatus === "pass" ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span className="font-bold text-primary">PASS</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-500">FAIL</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Eligibility Summary */}
        <div className={`p-4 rounded-lg border ${
          candidate.businessConceptStatus === "pass" 
            ? "bg-primary/10 border-primary" 
            : "bg-red-50 border-red-500"
        }`}>
          <div className="flex items-start gap-3">
            {candidate.businessConceptStatus === "pass" ? (
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            )}
            <div>
              <h4 className="font-semibold mb-1 text-foreground">
                {candidate.businessConceptStatus === "pass" 
                  ? "Eligible for Entrepreneur Track" 
                  : "Not Eligible for Entrepreneur Track"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {candidate.businessConceptStatus === "pass" 
                  ? "This candidate meets all criteria for the entrepreneurship track." 
                  : "This candidate failed the business concept test and should be assigned to the employment track."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 bg-background">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Track Assignment</h1>
            <p className="text-muted-foreground">Assign Phase 2 beneficiaries to Employment or Entrepreneurship tracks</p>
          </div>
        </div>
        <Badge variant="outline" className="border-primary text-primary">Phase 2</Badge>
      </div>

      {/* Information Completion Status */}
      <Card className="mb-6 bg-white border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Information Completion Status</CardTitle>
          <CardDescription>All candidate information must be 100% complete before track assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Completion Progress</span>
              <span className="text-2xl font-bold text-primary">{informationCompletion}%</span>
            </div>
            <Progress value={informationCompletion} className="h-3" />
            
            {informationCompletion < 100 ? (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-500 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-red-500 mb-1">Track Assignment Locked</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete all candidate information to unlock track assignment functionality.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-primary mb-1">Track Assignment Unlocked</h4>
                  <p className="text-sm text-muted-foreground">
                    All information is complete. You can now assign candidates to tracks.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Track Assignment Tabs */}
      {informationCompletion === 100 ? (
        <Tabs defaultValue="entrepreneur" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-neutral-100">
            <TabsTrigger value="entrepreneur" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Briefcase className="w-4 h-4" />
              Entrepreneur Track
            </TabsTrigger>
            <TabsTrigger value="employment" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Building2 className="w-4 h-4" />
              Employment Track
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
                    <CardDescription>Review and manage candidates assigned to the entrepreneurship track</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Candidate List */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">Candidates ({entrepreneurCandidates.length})</h3>
                    {entrepreneurCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedCandidate === candidate.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            onClick={() => setSelectedCandidate(candidate.id)}
                            className="flex-1 cursor-pointer"
                          >
                            <p className="font-semibold text-foreground">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {candidate.id}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-neutral-300 hover:border-primary hover:text-primary"
                            onClick={() => handleMoveToEmploymentTrack(candidate.id)}
                          >
                            <ArrowRightLeft className="w-4 h-4 mr-1" />
                            Move Track
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Side - Candidate Details */}
                  <div className="border border-border rounded-lg p-6 bg-white min-h-[500px]">
                    {selectedCandidate ? (
                      renderCandidateDetails(
                        entrepreneurCandidates.find((c) => c.id === selectedCandidate)
                      )
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Select a candidate to view their details
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                    <CardDescription>Review and manage candidates assigned to the employment track</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Side - Candidate List */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg mb-4 text-foreground">Candidates ({employmentCandidates.length})</h3>
                    {employmentCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedCandidate === candidate.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div
                            onClick={() => setSelectedCandidate(candidate.id)}
                            className="flex-1 cursor-pointer"
                          >
                            <p className="font-semibold text-foreground">{candidate.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {candidate.id}</p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-white"
                            onClick={() => handleMoveToEntrepreneurTrack(candidate.id)}
                          >
                            <ArrowRightLeft className="w-4 h-4 mr-1" />
                            Move Track
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Side - Candidate Details */}
                  <div className="border border-border rounded-lg p-6 bg-white min-h-[500px]">
                    {selectedCandidate ? (
                      renderCandidateDetails(
                        employmentCandidates.find((c) => c.id === selectedCandidate)
                      )
                    ) : (
                      <div className="h-full flex items-center justify-center text-center">
                        <div>
                          <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                          <p className="text-muted-foreground">
                            Select a candidate to view their details
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="bg-white border-border">
          <CardContent className="py-12">
            <div className="text-center">
              <AlertCircle className="w-20 h-20 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Track Assignment Unavailable</h3>
              <p className="text-muted-foreground">
                Complete all candidate information to access track assignment functionality.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
