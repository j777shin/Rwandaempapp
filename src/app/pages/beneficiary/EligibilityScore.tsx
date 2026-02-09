import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Award, CheckCircle2, XCircle, Building2, Briefcase } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

export function EligibilityScore() {
  const user = {
    selectedForPhase2: true, // true if user is selected for phase 2
    phase2Track: "entrepreneurship", // "employment" or "entrepreneurship"
    totalScore: 78,
    criteria: [
      { name: "Age Requirement", score: 100, met: true },
      { name: "Education Level", score: 85, met: true },
      { name: "SkillCraft Assessment", score: 72, met: true },
      { name: "Pathway Completion", score: 65, met: true },
    ],
  };

  const trackInfo = {
    employment: {
      name: "Employment Track",
      color: "bg-primary",
      icon: Building2,
      description: "You have been assigned to the Employment Track based on your assessment results and career preferences. This track focuses on job readiness, employment opportunities, and career placement support.",
      benefits: [
        "Employment guidance chatbot services",
        "Resume and interview preparation",
        "Job placement assistance",
        "Networking opportunities with employers",
        "Career counseling and mentorship",
      ]
    },
    entrepreneurship: {
      name: "Entrepreneurship Track",
      color: "bg-primary",
      icon: Briefcase,
      description: "You have been assigned to the Entrepreneurship Track based on your assessment results and business aspirations. This track focuses on business development, startup support, and entrepreneurial skills.",
      benefits: [
        "Entrepreneurship chatbot guidance",
        "Business planning and development support",
        "Access to startup funding opportunities",
        "Mentorship from successful entrepreneurs",
        "Business networking and pitch events",
      ]
    }
  };

  const currentTrack = user.selectedForPhase2 ? trackInfo[user.phase2Track] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/beneficiary">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Track Assignment Card */}
        {user.selectedForPhase2 && currentTrack && (
          <Card className="mb-6 border-l-4 border-l-primary">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className={`w-32 h-32 ${currentTrack.color} rounded-full flex items-center justify-center`}>
                  <currentTrack.icon className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 mb-2">
                <CardTitle className="text-3xl">{currentTrack.name}</CardTitle>
                <Badge variant="outline" className="border-primary text-primary">Phase 2</Badge>
              </div>
              <CardDescription>Your assigned track for Phase 2 of the MVP program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">{currentTrack.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Track Benefits & Services</h3>
                <div className="space-y-3">
                  {currentTrack.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Eligibility Score Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
                <Award className="w-16 h-16 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Eligibility Score</CardTitle>
            <CardDescription>Your program eligibility assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-primary mb-2">{user.totalScore}</div>
              <div className="text-2xl text-muted-foreground mb-4">/100</div>
              <div className={`inline-block px-6 py-2 rounded-full ${user.selectedForPhase2 ? "bg-primary" : "bg-primary"} text-white text-xl`}>
                {user.selectedForPhase2 ? "Phase 2 Selected" : "Phase 1 Active"}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl mb-4">Criteria Breakdown</h3>
              {user.criteria.map((criterion, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {criterion.met ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <span>{criterion.name}</span>
                  </div>
                  <span className="font-semibold">{criterion.score}/100</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phase 1 Message for Users Not Yet Selected */}
        {!user.selectedForPhase2 && (
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Continue Your Progress</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete all Phase 1 training requirements to be considered for Phase 2 selection. 
                    Based on your performance and preferences, you will be assigned to either the Employment Track or Entrepreneurship Track.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 border-2 border-primary rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-6 h-6 text-primary" />
                        <h4 className="font-semibold text-primary">Employment Track</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Job placement and career development</p>
                    </div>
                    <div className="p-4 border-2 border-primary rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        <h4 className="font-semibold text-primary">Entrepreneurship Track</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">Business startup and entrepreneurial support</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}