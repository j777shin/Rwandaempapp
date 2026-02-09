import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { ArrowLeft, User, Award, BookOpen, Route, Trophy, CheckCircle2, Clock, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";

// Mock beneficiaries data
const beneficiaries = [
  { 
    id: "1",
    name: "Jean Baptiste",
    email: "jean.baptiste@example.com",
    age: 28,
    gender: "Male",
    phase: 2,
    skillcraft: 85,
    pathways: 72,
    eligibility: 78,
    overall: 78,
    chatbotSessions: 12,
    lastActive: "2026-01-28",
    enrollmentDate: "2025-11-15",
    completedModules: 8,
    totalModules: 12,
    skillcraftTests: [
      { name: "Cognitive Skills", score: 88, date: "2025-12-01" },
      { name: "Technical Aptitude", score: 82, date: "2025-12-15" },
      { name: "Problem Solving", score: 85, date: "2026-01-10" },
    ],
    pathwaysCompleted: [
      { name: "Digital Literacy", progress: 100, date: "2025-12-20" },
      { name: "Entrepreneurship Basics", progress: 85, date: "2026-01-05" },
      { name: "Financial Management", progress: 45, date: "ongoing" },
    ],
    businessConcept: "I plan to start a mobile phone repair and accessories shop in Kigali. The shop will offer affordable repair services for smartphones and sell protective cases, chargers, and screen protectors. My target customers are young professionals and students who rely heavily on their phones for daily activities."
  },
  { 
    id: "2",
    name: "Marie Claire",
    email: "marie.claire@example.com",
    age: 32,
    gender: "Female",
    phase: 2,
    skillcraft: 92,
    pathways: 88,
    eligibility: 90,
    overall: 90,
    chatbotSessions: 18,
    lastActive: "2026-01-29",
    enrollmentDate: "2025-11-10",
    completedModules: 11,
    totalModules: 12,
    skillcraftTests: [
      { name: "Cognitive Skills", score: 95, date: "2025-11-28" },
      { name: "Technical Aptitude", score: 90, date: "2025-12-12" },
      { name: "Problem Solving", score: 91, date: "2026-01-08" },
    ],
    pathwaysCompleted: [
      { name: "Digital Literacy", progress: 100, date: "2025-12-15" },
      { name: "Entrepreneurship Basics", progress: 100, date: "2025-12-30" },
      { name: "Financial Management", progress: 65, date: "ongoing" },
    ],
    businessConcept: "My business idea is a tailoring and fashion design studio specializing in modern African wear. I will create custom outfits for special occasions like weddings and graduations, combining traditional Rwandan patterns with contemporary styles. I also plan to offer sewing classes to young women in my community."
  },
  { 
    id: "3",
    name: "Patrick Nkusi",
    email: "patrick.nkusi@example.com",
    age: 25,
    gender: "Male",
    phase: 1,
    skillcraft: 75,
    pathways: 68,
    eligibility: 71,
    overall: 71,
    chatbotSessions: 0,
    lastActive: "2026-01-27",
    enrollmentDate: "2025-11-20",
    completedModules: 7,
    totalModules: 12,
    skillcraftTests: [
      { name: "Cognitive Skills", score: 78, date: "2025-12-05" },
      { name: "Technical Aptitude", score: 72, date: "2025-12-18" },
      { name: "Problem Solving", score: 75, date: "2026-01-12" },
    ],
    pathwaysCompleted: [
      { name: "Digital Literacy", progress: 100, date: "2025-12-25" },
      { name: "Entrepreneurship Basics", progress: 60, date: "ongoing" },
      { name: "Financial Management", progress: 45, date: "ongoing" },
    ],
    businessConcept: "I want to establish a small-scale poultry farm focusing on egg production. The farm will supply fresh eggs to local markets and shops in my district. I believe there is high demand for quality eggs, and this business can be scaled up over time to include chicken meat production."
  },
  { 
    id: "4",
    name: "Ange Uwase",
    email: "ange.uwase@example.com",
    age: 29,
    gender: "Female",
    phase: 2,
    skillcraft: 88,
    pathways: 82,
    eligibility: 85,
    overall: 85,
    chatbotSessions: 15,
    lastActive: "2026-01-29",
    enrollmentDate: "2025-11-12",
    completedModules: 10,
    totalModules: 12,
    skillcraftTests: [
      { name: "Cognitive Skills", score: 90, date: "2025-11-30" },
      { name: "Technical Aptitude", score: 85, date: "2025-12-14" },
      { name: "Problem Solving", score: 89, date: "2026-01-09" },
    ],
    pathwaysCompleted: [
      { name: "Digital Literacy", progress: 100, date: "2025-12-18" },
      { name: "Entrepreneurship Basics", progress: 95, date: "2026-01-02" },
      { name: "Financial Management", progress: 52, date: "ongoing" },
    ],
    businessConcept: "My business concept is a home-based bakery specializing in birthday cakes, cupcakes, and pastries. I will take custom orders through social media and deliver within Kigali. The bakery will focus on quality ingredients and creative designs to stand out in the market."
  },
];

export function BeneficiaryProgress() {
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>(beneficiaries[0].id);
  const selectedBeneficiary = beneficiaries.find(b => b.id === selectedBeneficiaryId) || beneficiaries[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Page Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Beneficiary Progress Tracking - Phase 1</CardTitle>
            <CardDescription>Select a beneficiary from the list to view their detailed progress</CardDescription>
          </CardHeader>
        </Card>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Candidate List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Beneficiaries ({beneficiaries.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {beneficiaries.map((beneficiary) => (
                    <button
                      key={beneficiary.id}
                      onClick={() => setSelectedBeneficiaryId(beneficiary.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        selectedBeneficiaryId === beneficiary.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {beneficiary.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{beneficiary.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{beneficiary.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">Overall: {beneficiary.overall}%</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Beneficiary Details */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Beneficiary Information Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {selectedBeneficiary.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedBeneficiary.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selectedBeneficiary.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-sm text-muted-foreground">Age: {selectedBeneficiary.age}</p>
                          <span className="text-muted-foreground">•</span>
                          <p className="text-sm text-muted-foreground">Gender: {selectedBeneficiary.gender}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* SkillCraft Test Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    SkillCraft Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedBeneficiary.skillcraftTests.map((test, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{test.name}</p>
                            <p className="text-xs text-muted-foreground">Completed: {test.date}</p>
                          </div>
                          <Badge variant="outline" className="text-base px-3 py-1">
                            {test.score}%
                          </Badge>
                        </div>
                        <Progress value={test.score} className="h-2" />
                        {index < selectedBeneficiary.skillcraftTests.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pathways Progress Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-primary" />
                    Pathways Progress Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedBeneficiary.pathwaysCompleted.map((pathway, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold">{pathway.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {pathway.progress === 100 ? `Completed: ${pathway.date}` : `Status: ${pathway.date}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {pathway.progress === 100 && <CheckCircle2 className="w-5 h-5 text-primary" />}
                            <Badge 
                              variant={pathway.progress === 100 ? "default" : "outline"}
                              className={pathway.progress === 100 ? "bg-primary text-base px-3 py-1" : "text-base px-3 py-1"}
                            >
                              {pathway.progress}%
                            </Badge>
                          </div>
                        </div>
                        <Progress value={pathway.progress} className="h-2" />
                        {index < selectedBeneficiary.pathwaysCompleted.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Business Concept */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Business Concept
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{selectedBeneficiary.businessConcept}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}