import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Lightbulb, CheckCircle2, Briefcase } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { api } from "@/app/lib/api";

type TrackChoice = "entrepreneurship" | "wage_employment" | null;

export function BusinessDevelopment() {
  const [choice, setChoice] = useState<TrackChoice>(null);
  const [businessGoal, setBusinessGoal] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedChoice, setSubmittedChoice] = useState<TrackChoice>(null);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);

  // Load existing submission on mount
  useEffect(() => {
    api.getBusinessDev().then((data) => {
      if (data.wants_entrepreneurship === true) {
        setChoice("entrepreneurship");
        setBusinessGoal(data.business_development_text || "");
        setWordCount(
          (data.business_development_text || "").trim().split(/\s+/).filter((w: string) => w.length > 0).length
        );
        setSubmittedChoice("entrepreneurship");
        setIsSubmitted(true);
      } else if (data.wants_entrepreneurship === false && data.business_development_text !== null) {
        // User explicitly chose wage employment
        setChoice("wage_employment");
        setSubmittedChoice("wage_employment");
        setIsSubmitted(true);
      }
    }).catch(() => {});
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setBusinessGoal(text);
  };

  const handleSubmit = async () => {
    if (!choice) return;
    if (choice === "entrepreneurship" && !businessGoal.trim()) return;

    setSaving(true);
    try {
      await api.submitBusinessDev({
        wants_entrepreneurship: choice === "entrepreneurship",
        business_development_text: choice === "entrepreneurship" ? businessGoal : "",
      });
      setIsSubmitted(true);
      setSubmittedChoice(choice);
    } catch (err) {
      console.error("Failed to submit:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setIsSubmitted(false);
  };

  const isWordLimitExceeded = wordCount > 200;
  const canSubmit =
    choice === "wage_employment" ||
    (choice === "entrepreneurship" && businessGoal.trim() && !isWordLimitExceeded);

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Business Development</h1>
        <p className="text-muted-foreground">
          Tell us about your career preference for Phase 2
        </p>
      </div>

      {/* Main Content */}
      {isSubmitted ? (
        <Alert className="border-primary bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-foreground">Successfully Submitted!</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            {submittedChoice === "entrepreneurship"
              ? "Your business development goal has been saved. You've expressed interest in the Entrepreneurship track for Phase 2."
              : "You've indicated your interest in wage employment for Phase 2."}
          </AlertDescription>
          <Button onClick={handleEdit} className="mt-4 bg-primary hover:bg-primary/90">
            Edit Submission
          </Button>
        </Alert>
      ) : (
        <Card className="border-border bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="w-6 h-6 text-primary" />
              Phase 2 Track Preference
            </CardTitle>
            <CardDescription>
              Choose your preferred track for Phase 2 of the program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Radio Group for Track Choice */}
            <RadioGroup
              value={choice || ""}
              onValueChange={(value) => {
                setChoice(value as TrackChoice);
                if (value === "wage_employment") {
                  setBusinessGoal("");
                  setWordCount(0);
                }
              }}
              className="space-y-4"
            >
              <label
                htmlFor="choice-entrepreneurship"
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  choice === "entrepreneurship"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value="entrepreneurship" id="choice-entrepreneurship" className="mt-1" />
                <div className="space-y-1">
                  <span className="text-base font-medium text-foreground">
                    I want to participate in the Entrepreneurship track
                  </span>
                  <p className="text-sm text-muted-foreground">
                    I'm interested in starting my own business and want to be considered for the Entrepreneurship track in Phase 2
                  </p>
                </div>
              </label>

              <label
                htmlFor="choice-wage"
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  choice === "wage_employment"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <RadioGroupItem value="wage_employment" id="choice-wage" className="mt-1" />
                <div className="space-y-1 flex items-start gap-2">
                  <div>
                    <span className="text-base font-medium text-foreground">
                      I am more interested in wage employment
                    </span>
                    <p className="text-sm text-muted-foreground">
                      I prefer to focus on finding employment opportunities and want to be considered for the Employment track in Phase 2
                    </p>
                  </div>
                </div>
              </label>
            </RadioGroup>

            {/* Business Development Goal Text Area — only for entrepreneurship */}
            {choice === "entrepreneurship" && (
              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <Label htmlFor="business-goal" className="text-base font-medium text-foreground">
                    Business Development Goal
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Describe your business idea, goals, and what you hope to achieve through the Entrepreneurship track (Maximum 200 words)
                  </p>
                </div>
                <Textarea
                  id="business-goal"
                  placeholder="Example: I want to start a digital marketing agency that helps local businesses establish their online presence. My goal is to create employment opportunities for young professionals while supporting the growth of small businesses in Rwanda..."
                  value={businessGoal}
                  onChange={handleTextChange}
                  rows={8}
                  className="resize-none border-border focus:border-primary"
                />
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${isWordLimitExceeded ? 'text-red-600' : 'text-muted-foreground'}`}>
                    Word count: {wordCount} / 200
                    {isWordLimitExceeded && <span className="ml-2 font-medium">Exceeded word limit!</span>}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || saving}
                className="bg-primary hover:bg-primary/90 disabled:bg-neutral-300 disabled:text-neutral-500"
              >
                {saving ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">About Phase 2 Tracks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" /> Entrepreneurship Track
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>AI-powered business guidance and mentorship through our Entrepreneurship Chatbot</li>
              <li>Step-by-step business development across 5 stages</li>
              <li>Personalized results and reports based on your progress</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Employment Track
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Continued Pathways Deep Dive for career development</li>
              <li>Focused training on employment readiness and job market skills</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Selection Process</h3>
            <p className="text-muted-foreground">
              After completing Phase 1, your preference and performance will be reviewed as part of the
              selection process for Phase 2. Selected beneficiaries will be assigned to either the Employment or
              Entrepreneurship track.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
