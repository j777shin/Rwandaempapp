import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
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

interface SurveyConfig {
  key: string;
  title: string;
  description: string;
  statusKey: string;
  submitFn: (data: Record<string, string>) => Promise<any>;
  commentPlaceholder: string;
  questions: { id: string; label: string }[];
}

const SURVEYS: SurveyConfig[] = [
  {
    key: "phase1",
    title: "Phase 1 Training Survey",
    description:
      "Please rate your experience with the Phase 1 training program. Your honest feedback helps us improve the quality of training for future participants.",
    statusKey: "phase1_completed",
    submitFn: (data) => api.submitPhase1Survey(data),
    commentPlaceholder: "Share any additional thoughts about the Phase 1 training...",
    questions: [
      { id: "overall_training_quality", label: "How would you rate the overall quality of the Phase 1 training?" },
      { id: "content_relevance", label: "How relevant was the training content to your goals?" },
      { id: "instructor_quality", label: "How would you rate the quality of the instructors?" },
      { id: "facility_quality", label: "How would you rate the quality of the training facilities?" },
      { id: "would_recommend", label: "How likely are you to recommend this program to others?" },
    ],
  },
  {
    key: "employment",
    title: "Employment Survey",
    description:
      "Please rate your experience with the Employment track. Your feedback on job preparation, skills training, and placement support helps us strengthen the program.",
    statusKey: "employment_completed",
    submitFn: (data) => api.submitEmploymentSurvey(data),
    commentPlaceholder: "Share any additional thoughts about the Employment track...",
    questions: [
      { id: "job_preparation_quality", label: "How would you rate the quality of job preparation you received?" },
      { id: "skills_relevance", label: "How relevant were the skills taught to the current job market?" },
      { id: "career_guidance_helpfulness", label: "How helpful was the career guidance provided during the program?" },
      { id: "interview_preparation", label: "How well did the program prepare you for job interviews?" },
      { id: "job_placement_support", label: "How would you rate the job placement support you received?" },
    ],
  },
  {
    key: "entrepreneurship",
    title: "Entrepreneurship Survey",
    description:
      "Please rate your experience with the Entrepreneurship track. Your feedback on the chatbot, business planning, and financial guidance helps us improve the program.",
    statusKey: "entrepreneurship_completed",
    submitFn: (data) => api.submitEntrepreneurshipSurvey(data),
    commentPlaceholder: "Share any additional thoughts about the Entrepreneurship track...",
    questions: [
      { id: "chatbot_helpfulness", label: "How helpful was the Business Chatbot in developing your business idea?" },
      { id: "business_plan_quality", label: "How would you rate the quality of the business plan guidance you received?" },
      { id: "market_analysis_guidance", label: "How useful was the market analysis guidance provided?" },
      { id: "financial_planning_support", label: "How would you rate the financial planning support you received?" },
      { id: "overall_readiness_confidence", label: "How confident are you in your overall readiness to start a business?" },
    ],
  },
];

const VALID_KEYS = SURVEYS.map((s) => s.key);

function SurveyForm({ config }: { config: SurveyConfig }) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setResponses({});
    setComments("");
    setSubmitted(false);
    setAlreadyCompleted(false);
    setError(null);
    setLoading(true);

    async function checkStatus() {
      try {
        const status = await api.getSurveyStatus();
        if (status?.[config.statusKey]) {
          setAlreadyCompleted(true);
        }
      } catch {
        // Allow user to proceed
      } finally {
        setLoading(false);
      }
    }
    checkStatus();
  }, [config.key]);

  const allAnswered = config.questions.every((q) => responses[q.id]);

  const handleSubmit = async () => {
    if (!allAnswered) return;
    setSubmitting(true);
    setError(null);
    try {
      await config.submitFn({ ...responses, comments });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (alreadyCompleted) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Survey Already Completed
          </h2>
          <p className="text-muted-foreground">
            You have already submitted the {config.title}. Thank you for your feedback!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Thank You for Your Feedback!
          </h2>
          <p className="text-muted-foreground">
            Your {config.title} responses have been submitted successfully.
            Your feedback helps us improve the program.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {config.questions.map((question, index) => (
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
                    <RadioGroupItem value={value} id={`${config.key}-${question.id}-${value}`} />
                    <Label
                      htmlFor={`${config.key}-${question.id}-${value}`}
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
          <Label htmlFor={`${config.key}-comments`} className="text-base font-medium">
            Additional Comments
          </Label>
          <Textarea
            id={`${config.key}-comments`}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={config.commentPlaceholder}
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
  );
}

export function SurveyPage() {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const survey = SURVEYS.find((s) => s.key === typeParam) || SURVEYS[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/beneficiary">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{survey.title}</h1>
          <p className="text-muted-foreground mt-1">
            Share your feedback to help us improve the programme
          </p>
        </div>

        <SurveyForm key={survey.key} config={survey} />
      </div>
    </div>
  );
}
