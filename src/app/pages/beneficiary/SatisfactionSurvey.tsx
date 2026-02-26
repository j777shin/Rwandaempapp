import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Star, CheckCircle2 } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface SurveyQuestion {
  id: string;
  question: string;
  type: "rating" | "text";
}

interface SatisfactionSurveyProps {
  phase: "phase1" | "employment" | "entrepreneurship";
}

const surveyQuestions: Record<string, SurveyQuestion[]> = {
  phase1: [
    { id: "q1", question: "How satisfied are you with the SkillCraft Test experience?", type: "rating" },
    { id: "q2", question: "How useful were the Ingazi exploration resources?", type: "rating" },
    { id: "q3", question: "How would you rate the Business Development writing exercise?", type: "rating" },
    { id: "q4", question: "How satisfied are you with the overall Phase 1 training program?", type: "rating" },
    { id: "q5", question: "What did you like most about Phase 1?", type: "text" },
    { id: "q6", question: "What could be improved in Phase 1?", type: "text" },
  ],
  employment: [
    { id: "q1", question: "How satisfied are you with the eLearning- Ingazi content?", type: "rating" },
    { id: "q2", question: "How useful was the career guidance provided?", type: "rating" },
    { id: "q3", question: "How well did the program prepare you for employment?", type: "rating" },
    { id: "q4", question: "How satisfied are you with the overall Employment track?", type: "rating" },
    { id: "q5", question: "What did you like most about the Employment track?", type: "text" },
    { id: "q6", question: "What could be improved in the Employment track?", type: "text" },
  ],
  entrepreneurship: [
    { id: "q1", question: "How satisfied are you with the Business Learning modules?", type: "rating" },
    { id: "q2", question: "How helpful was the Business Chatbot in your planning?", type: "rating" },
    { id: "q3", question: "How useful were the Results & Reports provided?", type: "rating" },
    { id: "q4", question: "How satisfied are you with the overall Entrepreneurship track?", type: "rating" },
    { id: "q5", question: "What did you like most about the Entrepreneurship track?", type: "text" },
    { id: "q6", question: "What could be improved in the Entrepreneurship track?", type: "text" },
  ],
};

const phaseLabels: Record<string, string> = {
  phase1: "Phase 1: Training",
  employment: "Phase 2: Employment",
  entrepreneurship: "Phase 2: Entrepreneurship",
};

export function SatisfactionSurvey({ phase }: SatisfactionSurveyProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [textResponses, setTextResponses] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = surveyQuestions[phase];

  const handleRatingClick = (questionId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const handleTextChange = (questionId: string, value: string) => {
    setTextResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    // Check if all rating questions are answered
    const ratingQuestions = questions.filter(q => q.type === "rating");
    const allRatingsAnswered = ratingQuestions.every(q => ratings[q.id] !== undefined);

    if (!allRatingsAnswered) {
      alert("Please answer all rating questions before submitting.");
      return;
    }

    // In a real app, this would send data to backend
    console.log("Survey submitted:", { phase, ratings, textResponses });
    setSubmitted(true);
  };

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

          <Card className="border-primary/20 bg-white">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Thank You for Your Feedback!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your responses have been submitted successfully. Your feedback helps us improve the Rwanda MVP program.
              </p>
              <Link to="/beneficiary">
                <Button className="bg-primary hover:bg-primary/90">
                  Return to Dashboard
                </Button>
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Completion Survey</CardTitle>
                <Badge variant="outline" className="border-primary text-primary mt-2">
                  {phaseLabels[phase]}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              Please take a moment to share your feedback about your experience. Your input is valuable and helps us improve the program.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <p className="font-medium text-foreground">
                  {index + 1}. {question.question}
                </p>
                
                {question.type === "rating" ? (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatingClick(question.id, rating)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          ratings[question.id] === rating
                            ? "border-primary bg-primary text-white"
                            : "border-neutral-300 hover:border-primary/50 text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-lg font-semibold">{rating}</span>
                        </div>
                      </button>
                    ))}
                    <div className="flex items-center ml-3 text-sm text-muted-foreground">
                      <span className="mr-auto">1 = Very Poor</span>
                      <span className="ml-4">5 = Excellent</span>
                    </div>
                  </div>
                ) : (
                  <textarea
                    value={textResponses[question.id] || ""}
                    onChange={(e) => handleTextChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full min-h-[120px] p-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                )}
              </div>
            ))}

            <div className="pt-4 border-t border-border">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Submit Survey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}