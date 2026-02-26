import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { BookOpen, Route, Trophy, MessageCircle, FileText, LogOut, Lock, CheckCircle2, GraduationCap, Briefcase, Building2, Lightbulb, Loader2, ClipboardList, Save } from "lucide-react";
import { Textarea } from "@/app/components/ui/textarea";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";

export function BeneficiaryDashboard() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [employmentStatus, setEmploymentStatus] = useState<"self-employed" | "hired" | null>(null);
  const [hiredCompanyName, setHiredCompanyName] = useState("");
  const [selfEmployedDescription, setSelfEmployedDescription] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [statusSaved, setStatusSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("training");

  useEffect(() => {
    loadDashboard();
  }, []);

  // Set active tab based on user's track assignment once data loads
  useEffect(() => {
    if (!dashboard) return;
    const ben = dashboard.beneficiary || {};
    if (ben.selection_status === "selected" && ben.track === "employment") setActiveTab("employment");
    else if (ben.selection_status === "selected" && ben.track === "entrepreneurship") setActiveTab("entrepreneurship");
    else setActiveTab("training");
  }, [dashboard]);

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
      // Initialize employment status from API data
      const p2 = data.phase2 || {};
      if (p2.hired) {
        setEmploymentStatus("hired");
        setHiredCompanyName(p2.hired_company_name || "");
        setStatusSaved(true);
      } else if (p2.self_employed) {
        setEmploymentStatus("self-employed");
        setSelfEmployedDescription(p2.self_employed_description || "");
        setStatusSaved(true);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-background flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Derive user data from dashboard API response
  const beneficiary = dashboard?.beneficiary || {};
  const phase1 = dashboard?.phase1 || {};
  const phase2 = dashboard?.phase2 || {};

  const user = {
    name: beneficiary.name || `${beneficiary.first_name || ""} ${beneficiary.last_name || ""}`.trim() || "User",
    email: beneficiary.email || "",
    skillCraftCompleted: !!phase1.skillcraft_score,
    skillCraftScore: phase1.skillcraft_score,
    ingaziProgress: phase1.ingazi_completion_rate || 0,
    businessDevelopmentCompleted: !!phase1.business_dev_completed,
    currentPhase: beneficiary.selection_status === "selected" ? 2 : 1,
    phase2Track: beneficiary.track || null,
    selectedForPhase2: beneficiary.selection_status === "selected",
  };

  const phase1Features = [
    {
      title: "SkillCraft Test",
      description: "Take skill assessment to evaluate your readiness",
      icon: BookOpen,
      link: "/beneficiary/skillcraft",
    },
    {
      title: "eLearning- Ingazi",
      description: "Explore eLearning- Ingazi courses",
      icon: Route,
      link: "/beneficiary/ingazi",
    },
    {
      title: "Business Development",
      description: "Express interest in entrepreneurship and set your business goals",
      icon: Lightbulb,
      link: "/beneficiary/business-development",
    },
    {
      title: "Completion Survey",
      description: "Complete the Phase 1 satisfaction survey",
      icon: ClipboardList,
      link: "/beneficiary/survey?type=phase1",
    },
  ];

  const employmentFeatures = [
    {
      title: "eLearning- Ingazi",
      description: "Continue your advanced learning journey",
      icon: Route,
      link: "/beneficiary/ingazi-deepdive",
    },
    {
      title: "Completion Survey",
      description: "Complete the Employment track satisfaction survey",
      icon: ClipboardList,
      link: "/beneficiary/survey?type=employment",
    },
  ];

  const entrepreneurshipFeatures = [
    {
      title: "Entrepreneurship Chatbot",
      description: "Get AI-powered guidance for starting your business",
      icon: MessageCircle,
      link: "/beneficiary/chatbot",
    },
    {
      title: "Results & Reports",
      description: "View your business goal and assessment summaries",
      icon: FileText,
      link: "/beneficiary/results",
    },
    {
      title: "Completion Survey",
      description: "Complete the Entrepreneurship track satisfaction survey",
      icon: ClipboardList,
      link: "/beneficiary/survey?type=entrepreneurship",
    },
  ];

  const handleTabChange = (value: string) => {
    // Phase 1 user can only access training
    if (!user.selectedForPhase2 && value !== "training") return;
    // Phase 2 user can only access their assigned track
    if (user.selectedForPhase2 && value === "training") return;
    if (user.selectedForPhase2 && user.phase2Track === "employment" && value === "entrepreneurship") return;
    if (user.selectedForPhase2 && user.phase2Track === "entrepreneurship" && value === "employment") return;
    setActiveTab(value);
  };

  const handleSaveEmploymentStatus = async () => {
    if (!employmentStatus) return;
    setSavingStatus(true);
    setStatusSaved(false);
    try {
      await api.updateEmploymentStatus({
        status: employmentStatus,
        hired_company_name: employmentStatus === "hired" ? hiredCompanyName : undefined,
        self_employed_description: employmentStatus === "self-employed" ? selfEmployedDescription : undefined,
      });
      setStatusSaved(true);
    } catch (err) {
      console.error("Failed to save employment status:", err);
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}! Track your progress and access your training resources.</p>
      </div>

      {/* Progress Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                SkillCraft Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  {user.skillCraftCompleted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="font-bold text-primary">Completed</span>
                    </>
                  ) : (
                    <span className="font-bold text-neutral-500">Not Completed</span>
                  )}
                </div>
              </div>
              {user.skillCraftScore != null && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-bold text-foreground">{user.skillCraftScore}/100</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Route className="w-5 h-5 text-neutral-700" />
                eLearning- Ingazi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold text-foreground">{user.ingaziProgress}%</span>
              </div>
              <Progress value={user.ingaziProgress} className="h-3" />
            </CardContent>
          </Card>

          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lightbulb className="w-5 h-5 text-primary" />
                Business Development
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <div className="flex items-center gap-2">
                  {user.businessDevelopmentCompleted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <span className="font-bold text-primary">Completed</span>
                    </>
                  ) : (
                    <span className="font-bold text-neutral-500">Not Completed</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Update Employment Status */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-foreground">Update Employment Status</h2>
        <Card className="border-border bg-white">
          <CardHeader>
            <CardTitle className="text-foreground">Current Employment Status</CardTitle>
            <CardDescription>Please select your current employment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-primary/50 flex-1 ${
                employmentStatus === "self-employed" ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={employmentStatus === "self-employed"}
                    onChange={(e) => {
                      setStatusSaved(false);
                      if (e.target.checked) {
                        setEmploymentStatus("self-employed");
                      } else {
                        setEmploymentStatus(null);
                        setSelfEmployedDescription("");
                      }
                    }}
                    className="w-5 h-5 cursor-pointer appearance-none border-2 border-neutral-300 rounded checked:bg-primary checked:border-primary relative"
                  />
                  {employmentStatus === "self-employed" && (
                    <svg className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Self-Employed</span>
                </div>
                {employmentStatus === "self-employed" && (
                  <Badge className="ml-auto bg-primary text-white">Selected</Badge>
                )}
              </label>

              <label className={`flex items-center gap-3 cursor-pointer p-4 border-2 rounded-lg transition-all hover:border-primary/50 flex-1 ${
                employmentStatus === "hired" ? "border-primary bg-primary/5" : "border-border"
              }`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={employmentStatus === "hired"}
                    onChange={(e) => {
                      setStatusSaved(false);
                      if (e.target.checked) {
                        setEmploymentStatus("hired");
                      } else {
                        setEmploymentStatus(null);
                        setHiredCompanyName("");
                      }
                    }}
                    className="w-5 h-5 cursor-pointer appearance-none border-2 border-neutral-300 rounded checked:bg-primary checked:border-primary relative"
                  />
                  {employmentStatus === "hired" && (
                    <svg className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none" viewBox="0 0 12 12" fill="none">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Hired</span>
                </div>
                {employmentStatus === "hired" && (
                  <Badge className="ml-auto bg-primary text-white">Selected</Badge>
                )}
              </label>
            </div>

            {employmentStatus === "hired" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                <Textarea
                  value={hiredCompanyName}
                  onChange={(e) => { setHiredCompanyName(e.target.value); setStatusSaved(false); }}
                  placeholder="Enter the name of the company you were hired at..."
                  className="resize-none"
                  rows={2}
                />
              </div>
            )}

            {employmentStatus === "self-employed" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">Business Description</label>
                <Textarea
                  value={selfEmployedDescription}
                  onChange={(e) => { setSelfEmployedDescription(e.target.value); setStatusSaved(false); }}
                  placeholder="Describe the business you started..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            )}

            {employmentStatus && (
              <div className="mt-4 flex items-center gap-3">
                <Button
                  onClick={handleSaveEmploymentStatus}
                  disabled={savingStatus || (employmentStatus === "hired" && !hiredCompanyName.trim()) || (employmentStatus === "self-employed" && !selfEmployedDescription.trim())}
                  className="bg-primary hover:bg-primary/90"
                >
                  {savingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
                {statusSaved && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Employment status saved
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Tab-based Phase Selection */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100">
          <TabsTrigger value="training" disabled={user.selectedForPhase2} className="data-[state=active]:bg-white data-[disabled]:opacity-50">
            {user.selectedForPhase2 ? <Lock className="w-4 h-4 mr-2" /> : <GraduationCap className="w-4 h-4 mr-2" />}
            Training (Phase 1)
          </TabsTrigger>
          <TabsTrigger value="employment" disabled={!user.selectedForPhase2 || user.phase2Track !== "employment"} className="data-[state=active]:bg-white data-[disabled]:opacity-50">
            {!user.selectedForPhase2 || user.phase2Track !== "employment" ? <Lock className="w-4 h-4 mr-2" /> : <Building2 className="w-4 h-4 mr-2" />}
            Employment (Phase 2)
          </TabsTrigger>
          <TabsTrigger value="entrepreneurship" disabled={!user.selectedForPhase2 || user.phase2Track !== "entrepreneurship"} className="data-[state=active]:bg-white data-[disabled]:opacity-50">
            {!user.selectedForPhase2 || user.phase2Track !== "entrepreneurship" ? <Lock className="w-4 h-4 mr-2" /> : <Briefcase className="w-4 h-4 mr-2" />}
            Entrepreneurship (Phase 2)
          </TabsTrigger>
        </TabsList>

        {/* Phase 1: Training Tab */}
        <TabsContent value="training" className="mt-6">
          {!user.selectedForPhase2 ? (
            <Card className="border-border bg-white">
              <CardHeader>
                <CardTitle className="text-foreground">Phase 1: Training & Assessment</CardTitle>
                <CardDescription>Complete your skills assessment and explore eLearning- Ingazi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {phase1Features.map((feature, index) => (
                    <Link key={index} to={feature.link}>
                      <Card className="hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/50 h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                            <feature.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="border-border bg-white">
              <Lock className="h-5 w-5 text-neutral-500" />
              <AlertTitle className="text-foreground">Phase 1 Completed</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                You have been selected for Phase 2. Phase 1 resources are no longer accessible.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Phase 2: Employment Track Tab */}
        <TabsContent value="employment" className="mt-6">
          {user.selectedForPhase2 && user.phase2Track === "employment" ? (
            <Card className="border-border bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-6 h-6 text-primary" />
                  Phase 2: Employment Track
                </CardTitle>
                <CardDescription>Access employment resources and career guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {employmentFeatures.map((feature, index) => (
                    <Link key={index} to={feature.link}>
                      <Card className="hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/50 h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                            <feature.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="border-border bg-white">
              <Lock className="h-5 w-5 text-neutral-500" />
              <AlertTitle className="text-foreground">Employment Track Locked</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                This section will be unlocked once you are selected for Phase 2 and assigned to the Employment track.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Phase 2: Entrepreneurship Track Tab */}
        <TabsContent value="entrepreneurship" className="mt-6">
          {user.selectedForPhase2 && user.phase2Track === "entrepreneurship" ? (
            <Card className="border-border bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Phase 2: Entrepreneurship Track
                </CardTitle>
                <CardDescription>Access entrepreneurship resources and business guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {entrepreneurshipFeatures.map((feature, index) => (
                    <Link key={index} to={feature.link}>
                      <Card className="hover:shadow-md transition-all cursor-pointer border-border hover:border-primary/50 h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                            <feature.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert className="border-border bg-white">
              <Lock className="h-5 w-5 text-neutral-500" />
              <AlertTitle className="text-foreground">Entrepreneurship Track Locked</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                This section will be unlocked once you are selected for Phase 2 and assigned to the Entrepreneurship track.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Phase 2 Status Alert */}
      {!user.selectedForPhase2 && (
        <Alert className="border-primary bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-foreground">Complete Phase 1 to Unlock Phase 2</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Finish your SkillCraft assessment and pathway exploration to become eligible for Phase 2 selection.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
