import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, UserCheck, Search } from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Slider } from "@/app/components/ui/slider";
import { Input } from "@/app/components/ui/input";

// Mock data for candidates
const allCandidates = [
  { id: "MVP001", name: "Jean Paul Uwimana", age: 24, gender: "Male", education: "secondary", disability: false },
  { id: "MVP002", name: "Marie Claire Mukamana", age: 28, gender: "Female", education: "primary", disability: false },
  { id: "MVP003", name: "Eric Nshimiyimana", age: 19, gender: "Male", education: "secondary_professional", disability: true },
  { id: "MVP004", name: "Grace Uwera", age: 31, gender: "Female", education: "tertiary_and_above", disability: false },
  { id: "MVP005", name: "Patrick Habimana", age: 22, gender: "Male", education: "secondary", disability: false },
  { id: "MVP006", name: "Aline Umutoni", age: 26, gender: "Female", education: "primary", disability: false },
  { id: "MVP007", name: "Emmanuel Nkusi", age: 20, gender: "Male", education: "professional", disability: true },
  { id: "MVP008", name: "Sylvie Nyirahabimana", age: 29, gender: "Female", education: "secondary", disability: false },
];

// Education level mapping
const educationLevels = [
  "below_primary",
  "primary",
  "secondary",
  "secondary_professional",
  "professional",
  "tertiary_and_above"
];

const educationLabels = [
  "Below Primary",
  "Primary",
  "Secondary",
  "Sec. Professional",
  "Professional",
  "Tertiary+"
];

// Gender mapping
const genderOptions = ["All", "Male", "Female"];

// Disability mapping
const disabilityOptions = ["All", "Without Disability", "With Disability"];

export function BeneficiarySelection() {
  const [selectedCandidates, setSelectedCandidates] = useState<typeof allCandidates>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selection parameters state - all using sliders
  const [ageRange, setAgeRange] = useState<number[]>([18, 35]);
  const [educationRange, setEducationRange] = useState<number[]>([0, 5]); // 0 = below_primary, 5 = tertiary
  const [malePercentage, setMalePercentage] = useState<number[]>([50]); // 0-100%
  const [femalePercentage, setFemalePercentage] = useState<number[]>([50]); // 0-100%
  const [withDisabilityPercentage, setWithDisabilityPercentage] = useState<number[]>([20]); // 0-100%
  const [withoutDisabilityPercentage, setWithoutDisabilityPercentage] = useState<number[]>([80]); // 0-100%

  const totalPhase1 = 9000;
  const phase2Target = 3000;
  const selectionProgress = (selectedCandidates.length / phase2Target) * 100;

  // Filtered candidates based on search
  const filteredCandidates = selectedCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApplyFilters = () => {
    // First, filter by age and education
    let eligibleCandidates = allCandidates.filter(candidate => {
      // Age filter
      if (candidate.age < ageRange[0]) return false;
      if (candidate.age > ageRange[1]) return false;
      
      // Education filter
      const candidateEducationIndex = educationLevels.indexOf(candidate.education);
      if (candidateEducationIndex < educationRange[0]) return false;
      if (candidateEducationIndex > educationRange[1]) return false;
      
      return true;
    });

    // Separate by gender
    const males = eligibleCandidates.filter(c => c.gender === "Male");
    const females = eligibleCandidates.filter(c => c.gender === "Female");

    // Calculate how many from each gender based on percentages
    const maleCount = Math.round((males.length * malePercentage[0]) / 100);
    const femaleCount = Math.round((females.length * femalePercentage[0]) / 100);

    // Select the calculated counts
    const selectedMales = males.slice(0, maleCount);
    const selectedFemales = females.slice(0, femaleCount);

    let genderFiltered = [...selectedMales, ...selectedFemales];

    // Apply disability filter
    const withDisability = genderFiltered.filter(c => c.disability);
    const withoutDisability = genderFiltered.filter(c => !c.disability);

    const disabilityCount = Math.round((withDisability.length * withDisabilityPercentage[0]) / 100);
    const noDisabilityCount = Math.round((withoutDisability.length * withoutDisabilityPercentage[0]) / 100);

    const selectedWithDisability = withDisability.slice(0, disabilityCount);
    const selectedWithoutDisability = withoutDisability.slice(0, noDisabilityCount);

    const finalSelection = [...selectedWithDisability, ...selectedWithoutDisability];
    
    setSelectedCandidates(finalSelection);
  };

  const handleReset = () => {
    setAgeRange([18, 35]);
    setEducationRange([0, 5]);
    setMalePercentage([50]);
    setFemalePercentage([50]);
    setWithDisabilityPercentage([20]);
    setWithoutDisabilityPercentage([80]);
    setSelectedCandidates([]);
  };

  const handleDeselectCandidate = (candidateId: string) => {
    setSelectedCandidates(prev => prev.filter(c => c.id !== candidateId));
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
                <CardTitle className="text-2xl">Beneficiary Selection</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selection Parameters */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Selection Parameters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Age Range Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-semibold">Age Range</Label>
                      <span className="text-sm font-medium text-primary">
                        {ageRange[0]} - {ageRange[1]} years
                      </span>
                    </div>
                    <Slider
                      value={ageRange}
                      onValueChange={setAgeRange}
                      min={15}
                      max={35}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Education Level Range Slider */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-semibold">Education Level Range</Label>
                      <span className="text-sm font-medium text-primary">
                        {educationLabels[educationRange[0]]} - {educationLabels[educationRange[1]]}
                      </span>
                    </div>
                    <Slider
                      value={educationRange}
                      onValueChange={setEducationRange}
                      min={0}
                      max={5}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      {educationLabels.map((label, index) => (
                        <span key={index} className="text-center" style={{ width: `${100 / educationLabels.length}%` }}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Gender Percentage Sliders */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Gender Distribution</Label>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Male</Label>
                        <span className="text-sm font-medium text-primary">
                          {malePercentage[0]}%
                        </span>
                      </div>
                      <Slider
                        value={malePercentage}
                        onValueChange={setMalePercentage}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Female</Label>
                        <span className="text-sm font-medium text-primary">
                          {femalePercentage[0]}%
                        </span>
                      </div>
                      <Slider
                        value={femalePercentage}
                        onValueChange={setFemalePercentage}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Disability Percentage Sliders */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Disability Distribution</Label>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">With Disability</Label>
                        <span className="text-sm font-medium text-primary">
                          {withDisabilityPercentage[0]}%
                        </span>
                      </div>
                      <Slider
                        value={withDisabilityPercentage}
                        onValueChange={setWithDisabilityPercentage}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">Without Disability</Label>
                        <span className="text-sm font-medium text-primary">
                          {withoutDisabilityPercentage[0]}%
                        </span>
                      </div>
                      <Slider
                        value={withoutDisabilityPercentage}
                        onValueChange={setWithoutDisabilityPercentage}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button 
                    onClick={handleApplyFilters}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Apply Filters
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Selected Beneficiaries */}
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>Selected Beneficiaries ({selectedCandidates.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedCandidates.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No beneficiaries selected. Apply filters to select candidates.
                  </div>
                ) : (
                  <div>
                    <Input
                      type="text"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4"
                    />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCandidates.map((candidate) => (
                          <TableRow key={candidate.id}>
                            <TableCell className="font-medium">{candidate.id}</TableCell>
                            <TableCell>{candidate.name}</TableCell>
                            <TableCell>{candidate.age}</TableCell>
                            <TableCell>{candidate.gender}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeselectCandidate(candidate.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Deselect
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}