import { useState, useEffect } from "react";
import { Link } from "react-router";
import { api } from "@/app/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

const RATING_LABELS = ["Poor", "Fair", "Good", "Very Good", "Excellent"] as const;

const QUESTIONS = [
  {
    id: "overall_training_quality",
    label: "How would you rate the overall quality of the Phase 1 training?",
  },
  {
    id: "content_relevance",
    label: "How relevant was the training content to your goals?",
  },
  {
    id: "instructor_quality",
    label: "How would you rate the quality of the instructors?",
  },
  {
    id: "facility_quality",
    label: "How would you rate the quality of the training facilities?",
  },
  {
    id: "would_recommend",
    label: "How likely are you to recommend this program to others?",
  },
] as const;

export function Phase1Survey() {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const status = await api.getSurveyStatus();
        if (status?.phase1_completed) {
          setAlreadyCompleted(true);
        }
      } catch {
        // If status check fails, allow the user to proceed with the survey
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, []);

  const allAnswered = QUESTIONS.every((q) => responses[q.id]);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.submitPhase1Survey({
        ...responses,
        comments,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/beneficiary">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Survey Already Completed
              </h2>
              <p className="text-muted-foreground mb-6">
                You have already submitted the Phase 1 Training Survey. Thank
                you for your feedback!
              </p>
              <Link to="/beneficiary">
                <Button>Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/beneficiary">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Thank You for Your Feedback!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your Phase 1 Training Survey responses have been submitted
                successfully. Your feedback helps us improve the program.
              </p>
              <Link to="/beneficiary">
                <Button>Return to Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/beneficiary">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Phase 1 Training Survey
            </CardTitle>
            <CardDescription>
              Please rate your experience with the Phase 1 training program.
              Your honest feedback helps us improve the quality of training for
              future participants.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {QUESTIONS.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">
                  {index + 1}. {question.label}
                </Label>
                <RadioGroup
                  value={responses[question.id] || ""}
                  onValueChange={(value) =>
                    setResponses((prev) => ({ ...prev, [question.id]: value }))
                  }
                  className="flex flex-wrap gap-4"
                >
                  {RATING_LABELS.map((label, i) => {
                    const value = String(i + 1);
                    return (
                      <div key={value} className="flex items-center gap-2">
                        <RadioGroupItem
                          value={value}
                          id={`${question.id}-${value}`}
                        />
                        <Label
                          htmlFor={`${question.id}-${value}`}
                          className="font-normal cursor-pointer"
                        >
                          {value} - {label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}

            <div className="space-y-3">
              <Label htmlFor="comments" className="text-base font-medium">
                Additional Comments
              </Label>
              <Textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share any additional thoughts about the Phase 1 training..."
                className="min-h-[120px]"
              />
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Survey"
                )}
              </Button>
              {!allAnswered && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  Please answer all questions before submitting.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
