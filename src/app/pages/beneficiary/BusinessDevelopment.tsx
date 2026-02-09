import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Lightbulb, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";

export function BusinessDevelopment() {
  const [wantsEntrepreneurship, setWantsEntrepreneurship] = useState(false);
  const [businessGoal, setBusinessGoal] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    setBusinessGoal(text);
  };

  const handleSubmit = () => {
    if (wantsEntrepreneurship && businessGoal.trim()) {
      setIsSubmitted(true);
      // Here you would typically save the data to your backend
      console.log("Business Development Goal Submitted:", {
        wantsEntrepreneurship,
        businessGoal,
      });
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setWantsEntrepreneurship(false);
    setBusinessGoal("");
    setWordCount(0);
  };

  const isWordLimitExceeded = wordCount > 200;

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Business Development</h1>
        <p className="text-muted-foreground">
          Express your interest in entrepreneurship and share your business development goals
        </p>
      </div>

      {/* Main Content */}
      {isSubmitted ? (
        <Alert className="border-primary bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="text-foreground">Successfully Submitted!</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Your business development goal has been saved. You've expressed interest in the Entrepreneurship track for Phase 2.
          </AlertDescription>
          <Button onClick={handleReset} className="mt-4 bg-primary hover:bg-primary/90">
            Edit Submission
          </Button>
        </Alert>
      ) : (
        <Card className="border-border bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="w-6 h-6 text-primary" />
              Entrepreneurship Track Interest
            </CardTitle>
            <CardDescription>
              Let us know if you're interested in pursuing entrepreneurship and share your vision
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Checkbox for Entrepreneurship Interest */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="entrepreneurship-interest"
                checked={wantsEntrepreneurship}
                onCheckedChange={(checked) => {
                  setWantsEntrepreneurship(checked as boolean);
                  if (!checked) {
                    setBusinessGoal("");
                    setWordCount(0);
                  }
                }}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="entrepreneurship-interest"
                  className="text-base font-medium text-foreground cursor-pointer"
                >
                  I want to participate in the Entrepreneurship track in the future
                </Label>
                <p className="text-sm text-muted-foreground">
                  Check this box if you're interested in starting your own business and want to be considered for the Entrepreneurship track in Phase 2
                </p>
              </div>
            </div>

            {/* Business Development Goal Text Area */}
            {wantsEntrepreneurship && (
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
                disabled={!wantsEntrepreneurship || !businessGoal.trim() || isWordLimitExceeded}
                className="bg-primary hover:bg-primary/90 disabled:bg-neutral-300 disabled:text-neutral-500"
              >
                Submit Business Development Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">About the Entrepreneurship Track</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">What to Expect</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>AI-powered business guidance and mentorship through our Entrepreneurship Chatbot</li>
              <li>Resources and tools for developing your business plan</li>
              <li>Access to entrepreneurship training materials and case studies</li>
              <li>Progress tracking and comprehensive results reporting</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Selection Process</h3>
            <p className="text-muted-foreground">
              After completing Phase 1 (Training), your business development goal will be reviewed as part of the 
              selection process for Phase 2. Selected beneficiaries will be assigned to either the Employment or 
              Entrepreneurship track based on their goals, performance, and program capacity.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
