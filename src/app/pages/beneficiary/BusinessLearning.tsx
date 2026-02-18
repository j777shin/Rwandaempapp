import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Briefcase, BookOpen, Users, TrendingUp, FileText, Lightbulb } from "lucide-react";

const modules = [
  {
    title: "Introduction to Entrepreneurship",
    description: "Learn the fundamentals of starting and running a business in Rwanda",
    icon: Lightbulb,
    topics: ["What is entrepreneurship?", "Traits of successful entrepreneurs", "Business environment in Rwanda"],
  },
  {
    title: "Business Planning",
    description: "Create a solid business plan that guides your venture",
    icon: FileText,
    topics: ["Business plan components", "Setting goals and milestones", "Writing an executive summary"],
  },
  {
    title: "Market Research & Analysis",
    description: "Understand your market, customers, and competition",
    icon: TrendingUp,
    topics: ["Market research methods", "Customer segmentation", "Competitive analysis"],
  },
  {
    title: "Financial Management",
    description: "Manage your business finances effectively",
    icon: BookOpen,
    topics: ["Bookkeeping basics", "Cash flow management", "Funding and investment"],
  },
  {
    title: "Marketing & Sales",
    description: "Reach your customers and grow your revenue",
    icon: Users,
    topics: ["Digital marketing basics", "Sales techniques", "Customer relationship management"],
  },
];

export function BusinessLearning() {
  return (
    <div className="p-8 space-y-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Business Learning</h1>
        <p className="text-muted-foreground">
          Entrepreneurship track learning resources and modules
        </p>
      </div>

      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">
        <Briefcase className="w-3 h-3 mr-1" /> Entrepreneurship Track
      </Badge>

      <div className="grid gap-4">
        {modules.map((mod, index) => (
          <Card key={index} className="border-border bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <mod.icon className="w-5 h-5 text-primary" />
                Module {index + 1}: {mod.title}
              </CardTitle>
              <CardDescription>{mod.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Topics covered:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {mod.topics.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border bg-white">
        <CardHeader>
          <CardTitle className="text-foreground">Next Step: Entrepreneurship Chatbot</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            After reviewing these learning resources, proceed to the Entrepreneurship Chatbot
            to receive personalized AI-guided mentoring through your business development journey.
            The chatbot will walk you through 5 structured stages from business idea exploration
            to creating your action plan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
