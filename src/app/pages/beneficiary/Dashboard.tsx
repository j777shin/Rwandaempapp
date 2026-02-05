import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { BookOpen, Route, Trophy, MessageCircle, FileText, LogOut, Lock, CheckCircle2, GraduationCap, Briefcase, Building2 } from "lucide-react";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export function BeneficiaryDashboard() {
  const user = {
    name: "Jean Baptiste",
    email: "jean.baptiste@example.com",
    skillCraftProgress: 65,
    pathwaysProgress: 45,
    currentPhase: 2, // 1 or 2
    phase2Track: "entrepreneurship", // "employment" or "entrepreneurship"
    selectedForPhase2: true, // true if user is selected for phase 2
  };

  const phase1Features = [
    {
      title: "SkillCraft Test",
      description: "Take skill assessment to evaluate your readiness",
      icon: BookOpen,
      link: "/beneficiary/skillcraft",
    },
    {
      title: "Pathways",
      description: "Explore learning and career pathways",
      icon: Route,
      link: "/beneficiary/pathways",
    },
    {
      title: "Track Assignment",
      description: "View your assigned track (Employment or Entrepreneurship)",
      icon: Trophy,
      link: "/beneficiary/eligibility",
    },
  ];

  const employmentFeatures = [
    {
      title: "Pathways Deep Dive",
      description: "Explore detailed career pathways and employment opportunities",
      icon: Route,
      link: "/beneficiary/pathways-deepdive",
    },
    {
      title: "Employment Chatbot",
      description: "Get AI-powered guidance for employment opportunities",
      icon: MessageCircle,
      link: "/beneficiary/chatbot",
    },
    {
      title: "Results & Reports",
      description: "View your comprehensive progress and achievements",
      icon: FileText,
      link: "/beneficiary/results",
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
      description: "View your comprehensive progress and achievements",
      icon: FileText,
      link: "/beneficiary/results",
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="w-5 h-5 text-primary" />
                SkillCraft Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold text-foreground">{user.skillCraftProgress}%</span>
              </div>
              <Progress value={user.skillCraftProgress} className="h-3" />
            </CardContent>
          </Card>

          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Route className="w-5 h-5 text-neutral-700" />
                Pathways Exploration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-bold text-foreground">{user.pathwaysProgress}%</span>
              </div>
              <Progress value={user.pathwaysProgress} className="h-3" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tab-based Phase Selection */}
      <Tabs defaultValue={user.selectedForPhase2 && user.phase2Track === "employment" ? "employment" : user.selectedForPhase2 && user.phase2Track === "entrepreneurship" ? "entrepreneurship" : "training"} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-neutral-100">
          <TabsTrigger value="training" className="data-[state=active]:bg-white">
            <GraduationCap className="w-4 h-4 mr-2" />
            Training (Phase 1)
          </TabsTrigger>
          <TabsTrigger value="employment" disabled={!user.selectedForPhase2 || user.phase2Track !== "employment"} className="data-[state=active]:bg-white disabled:opacity-50">
            <Building2 className="w-4 h-4 mr-2" />
            Employment (Phase 2)
          </TabsTrigger>
          <TabsTrigger value="entrepreneurship" disabled={!user.selectedForPhase2 || user.phase2Track !== "entrepreneurship"} className="data-[state=active]:bg-white disabled:opacity-50">
            <Briefcase className="w-4 h-4 mr-2" />
            Entrepreneurship (Phase 2)
          </TabsTrigger>
        </TabsList>

        {/* Phase 1: Training Tab */}
        <TabsContent value="training" className="mt-6">
          <Card className="border-border bg-white">
            <CardHeader>
              <CardTitle className="text-foreground">Phase 1: Training & Assessment</CardTitle>
              <CardDescription>Complete your skills assessment and explore career pathways</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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