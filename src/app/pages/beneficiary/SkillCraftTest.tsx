import { useState } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What is your current level of computer literacy?",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  {
    id: 2,
    question: "How would you rate your communication skills?",
    options: ["Poor", "Fair", "Good", "Excellent"],
  },
  {
    id: 3,
    question: "Do you have experience with project management?",
    options: ["No experience", "Some experience", "Moderate experience", "Extensive experience"],
  },
];

export function SkillCraftTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCompleted(true);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto">
          <Link to="/beneficiary">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-[#00A651]" />
              </div>
              <CardTitle className="text-3xl">Test Completed!</CardTitle>
              <CardDescription>Your responses have been saved successfully</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-[#00A651]/10 p-6 rounded-lg">
                <p className="text-4xl font-bold text-[#00A651] mb-2">85/100</p>
                <p className="text-muted-foreground">Skill Score</p>
              </div>
              <Link to="/beneficiary/results">
                <Button className="bg-[#00A1DE] hover:bg-[#0081B8]">
                  View Detailed Results
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
            <CardTitle>SkillCraft Assessment</CardTitle>
            <CardDescription>
              Question {currentQuestion + 1} of {questions.length}
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl mb-4">{questions[currentQuestion].question}</h3>
              <RadioGroup
                value={answers[questions[currentQuestion].id] || ""}
                onValueChange={handleAnswer}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-3">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <Button
              onClick={handleNext}
              disabled={!answers[questions[currentQuestion].id]}
              className="w-full bg-[#00A1DE] hover:bg-[#0081B8]"
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Complete Test"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
