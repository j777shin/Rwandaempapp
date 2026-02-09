import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, UserCheck, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";

// Mock data for Phase 1 beneficiaries with eligibility scores
const allBeneficiaries = [
  { 
    id: "MVP001", 
    name: "Jean Paul Uwimana", 
    age: 24, 
    gender: "Male", 
    email: "jean.uwimana@example.com", 
    eligibilityScore: 85,
    skillCraftScore: 85,
    pathwayCompletion: 92,
    offlineTraining: 78
  },
  { 
    id: "MVP002", 
    name: "Marie Claire Mukamana", 
    age: 28, 
    gender: "Female", 
    email: "marie.mukamana@example.com", 
    eligibilityScore: 72,
    skillCraftScore: 72,
    pathwayCompletion: 68,
    offlineTraining: 76
  },
  { 
    id: "MVP003", 
    name: "Eric Nshimiyimana", 
    age: 19, 
    gender: "Male", 
    email: "eric.nshimiyimana@example.com", 
    eligibilityScore: 91,
    skillCraftScore: 91,
    pathwayCompletion: 95,
    offlineTraining: 87
  },
  { 
    id: "MVP004", 
    name: "Grace Uwera", 
    age: 31, 
    gender: "Female", 
    email: "grace.uwera@example.com", 
    eligibilityScore: 68,
    skillCraftScore: 68,
    pathwayCompletion: 65,
    offlineTraining: 71
  },
  { 
    id: "MVP005", 
    name: "Patrick Habimana", 
    age: 22, 
    gender: "Male", 
    email: "patrick.habimana@example.com", 
    eligibilityScore: 78,
    skillCraftScore: 78,
    pathwayCompletion: 82,
    offlineTraining: 74
  },
  { 
    id: "MVP006", 
    name: "Aline Umutoni", 
    age: 26, 
    gender: "Female", 
    email: "aline.umutoni@example.com", 
    eligibilityScore: 88,
    skillCraftScore: 88,
    pathwayCompletion: 90,
    offlineTraining: 86
  },
  { 
    id: "MVP007", 
    name: "Emmanuel Nkusi", 
    age: 20, 
    gender: "Male", 
    email: "emmanuel.nkusi@example.com", 
    eligibilityScore: 95,
    skillCraftScore: 95,
    pathwayCompletion: 98,
    offlineTraining: 92
  },
  { 
    id: "MVP008", 
    name: "Sylvie Nyirahabimana", 
    age: 29, 
    gender: "Female", 
    email: "sylvie.nyirahabimana@example.com", 
    eligibilityScore: 64,
    skillCraftScore: 64,
    pathwayCompletion: 60,
    offlineTraining: 68
  },
  { 
    id: "MVP009", 
    name: "Didier Mugisha", 
    age: 25, 
    gender: "Male", 
    email: "didier.mugisha@example.com", 
    eligibilityScore: 82,
    skillCraftScore: 82,
    pathwayCompletion: 85,
    offlineTraining: 79
  },
  { 
    id: "MVP010", 
    name: "Claudine Umulisa", 
    age: 27, 
    gender: "Female", 
    email: "claudine.umulisa@example.com", 
    eligibilityScore: 76,
    skillCraftScore: 76,
    pathwayCompletion: 73,
    offlineTraining: 79
  },
  { 
    id: "MVP011", 
    name: "Samuel Ntambara", 
    age: 23, 
    gender: "Male", 
    email: "samuel.ntambara@example.com", 
    eligibilityScore: 89,
    skillCraftScore: 89,
    pathwayCompletion: 91,
    offlineTraining: 87
  },
  { 
    id: "MVP012", 
    name: "Jeanne Mukeshimana", 
    age: 30, 
    gender: "Female", 
    email: "jeanne.mukeshimana@example.com", 
    eligibilityScore: 71,
    skillCraftScore: 71,
    pathwayCompletion: 69,
    offlineTraining: 73
  },
];

export function Phase1Selection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeneficiaryIds, setSelectedBeneficiaryIds] = useState<Set<string>>(new Set());
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<typeof allBeneficiaries[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Sort beneficiaries by eligibilityScore descending
  const sortedBeneficiaries = [...allBeneficiaries].sort((a, b) => {
    return b.eligibilityScore - a.eligibilityScore;
  });

  // Filtered beneficiaries based on search
  const filteredBeneficiaries = sortedBeneficiaries.filter(beneficiary =>
    beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beneficiary.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beneficiary.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelection = (beneficiaryId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click when clicking the button
    setSelectedBeneficiaryIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(beneficiaryId)) {
        newSet.delete(beneficiaryId);
      } else {
        newSet.add(beneficiaryId);
      }
      return newSet;
    });
  };

  const handleRowClick = (beneficiary: typeof allBeneficiaries[0]) => {
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
                  Total Beneficiaries: {allBeneficiaries.length} | Sorted by Eligibility Score (highest first)
                </p>
              </div>
            </div>
            {selectedBeneficiaryIds.size > 0 && (
              <Badge variant="outline" className="border-primary text-primary ml-auto">
                {selectedBeneficiaryIds.size} Selected
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search */}
            <Input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />

            {/* Beneficiaries Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Eligibility Score</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeneficiaries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No beneficiaries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBeneficiaries.map((beneficiary) => {
                      const isSelected = selectedBeneficiaryIds.has(beneficiary.id);
                      return (
                        <TableRow 
                          key={beneficiary.id}
                          onClick={() => handleRowClick(beneficiary)}
                          className={`cursor-pointer hover:bg-gray-100 ${!isSelected ? 'bg-gray-50' : 'bg-white'}`}
                        >
                          <TableCell className="font-medium">{beneficiary.name}</TableCell>
                          <TableCell>{beneficiary.age}</TableCell>
                          <TableCell>{beneficiary.gender}</TableCell>
                          <TableCell className="text-muted-foreground">{beneficiary.email}</TableCell>
                          <TableCell className="text-center">
                            <span className="font-semibold text-foreground">{beneficiary.eligibilityScore}</span>
                            <span className="text-xs text-muted-foreground">/100</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant={isSelected ? "outline" : "default"}
                              onClick={(e) => toggleSelection(beneficiary.id, e)}
                              className={isSelected ? "border-red-500 text-red-600 hover:bg-red-50" : "bg-primary hover:bg-primary/90"}
                            >
                              {isSelected ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Remove
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Select
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
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
                    <span className="font-semibold text-foreground">{selectedBeneficiary.name}</span>
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
                      <p className="text-foreground">{selectedBeneficiary.name}</p>
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
                          <span className="text-2xl font-bold text-primary">{selectedBeneficiary.eligibilityScore}/100</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${selectedBeneficiary.eligibilityScore}%` }}
                          />
                        </div>
                      </div>

                      {/* SkillCraft Score */}
                      <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-neutral-700">SkillCraft Score</span>
                          <span className="text-xl font-bold text-foreground">{selectedBeneficiary.skillCraftScore}/100</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-neutral-600 h-2 rounded-full transition-all"
                            style={{ width: `${selectedBeneficiary.skillCraftScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Pathway Completion */}
                      <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-neutral-700">Pathway Completion</span>
                          <span className="text-xl font-bold text-foreground">{selectedBeneficiary.pathwayCompletion}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-neutral-600 h-2 rounded-full transition-all"
                            style={{ width: `${selectedBeneficiary.pathwayCompletion}%` }}
                          />
                        </div>
                      </div>

                      {/* Offline Training */}
                      <div className="p-4 bg-neutral-50 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-neutral-700">Offline Training Completion</span>
                          <span className="text-xl font-bold text-foreground">{selectedBeneficiary.offlineTraining}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-2">
                          <div 
                            className="bg-neutral-600 h-2 rounded-full transition-all"
                            style={{ width: `${selectedBeneficiary.offlineTraining}%` }}
                          />
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
