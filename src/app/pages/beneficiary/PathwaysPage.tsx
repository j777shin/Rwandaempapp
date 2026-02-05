import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { ArrowLeft, Briefcase, GraduationCap, Rocket } from "lucide-react";

const pathways = [
  {
    id: 1,
    title: "Digital Skills Training",
    description: "Learn web development, design, and digital marketing",
    duration: "6 months",
    level: "Beginner",
    icon: GraduationCap,
    completion: 45,
    color: "bg-[#00A1DE]",
  },
  {
    id: 2,
    title: "Employment Pathway",
    description: "Job placement assistance and career development",
    duration: "3 months",
    level: "Intermediate",
    icon: Briefcase,
    completion: 30,
    color: "bg-[#FAD201] text-black",
  },
  {
    id: 3,
    title: "Entrepreneurship Program",
    description: "Start and grow your own business",
    duration: "9 months",
    level: "Advanced",
    icon: Rocket,
    completion: 15,
    color: "bg-[#00A651]",
  },
];

export function PathwaysPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/beneficiary">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl mb-2">Learning & Career Pathways</h1>
          <p className="text-muted-foreground">Choose your path to success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((pathway) => (
            <Card key={pathway.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-14 h-14 ${pathway.color} rounded-lg flex items-center justify-center mb-4`}>
                  <pathway.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle>{pathway.title}</CardTitle>
                <CardDescription>{pathway.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant="secondary">{pathway.duration}</Badge>
                  <Badge variant="outline">{pathway.level}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{pathway.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#00A651] h-2 rounded-full"
                      style={{ width: `${pathway.completion}%` }}
                    />
                  </div>
                </div>
                <Button className="w-full bg-[#00A1DE] hover:bg-[#0081B8]">
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
