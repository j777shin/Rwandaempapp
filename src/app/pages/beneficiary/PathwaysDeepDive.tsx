import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Building2, TrendingUp, Users, Award, BookOpen, CheckCircle2, Target } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export function PathwaysDeepDive() {
  const careerPathways = [
    {
      id: 1,
      title: "Construction & Trades",
      icon: Building2,
      color: "bg-primary",
      description: "Master skilled trades in construction, carpentry, plumbing, and electrical work",
      progress: 45,
      modules: [
        { name: "Safety Standards & Regulations", completed: true, duration: "2 weeks" },
        { name: "Basic Carpentry Skills", completed: true, duration: "3 weeks" },
        { name: "Electrical Fundamentals", completed: false, duration: "4 weeks" },
        { name: "Plumbing Basics", completed: false, duration: "3 weeks" },
      ],
      jobOpportunities: [
        { role: "Construction Worker", demand: "High", avgSalary: "RWF 150,000/month" },
        { role: "Electrician", demand: "High", avgSalary: "RWF 200,000/month" },
        { role: "Plumber", demand: "Medium", avgSalary: "RWF 180,000/month" },
      ],
      certifications: ["Construction Safety Certificate", "Basic Electrical Certification"],
    },
    {
      id: 2,
      title: "Hospitality & Tourism",
      icon: Users,
      color: "bg-primary",
      description: "Build expertise in hotel management, customer service, and tourism operations",
      progress: 30,
      modules: [
        { name: "Customer Service Excellence", completed: true, duration: "2 weeks" },
        { name: "Hotel Operations Management", completed: false, duration: "3 weeks" },
        { name: "Food & Beverage Service", completed: false, duration: "4 weeks" },
        { name: "Tourism & Event Planning", completed: false, duration: "3 weeks" },
      ],
      jobOpportunities: [
        { role: "Hotel Receptionist", demand: "High", avgSalary: "RWF 120,000/month" },
        { role: "Restaurant Server", demand: "Medium", avgSalary: "RWF 100,000/month" },
        { role: "Tourism Guide", demand: "Medium", avgSalary: "RWF 150,000/month" },
      ],
      certifications: ["Customer Service Professional", "Hospitality Management"],
    },
    {
      id: 3,
      title: "Technology & Digital Skills",
      icon: TrendingUp,
      color: "bg-primary",
      description: "Develop technical skills in IT support, web development, and digital marketing",
      progress: 60,
      modules: [
        { name: "Computer Fundamentals", completed: true, duration: "2 weeks" },
        { name: "Web Development Basics", completed: true, duration: "4 weeks" },
        { name: "Digital Marketing Essentials", completed: true, duration: "3 weeks" },
        { name: "IT Support & Troubleshooting", completed: false, duration: "3 weeks" },
      ],
      jobOpportunities: [
        { role: "IT Support Technician", demand: "High", avgSalary: "RWF 250,000/month" },
        { role: "Digital Marketer", demand: "High", avgSalary: "RWF 200,000/month" },
        { role: "Web Developer", demand: "Medium", avgSalary: "RWF 300,000/month" },
      ],
      certifications: ["Digital Literacy Certificate", "IT Support Fundamentals"],
    },
    {
      id: 4,
      title: "Agriculture & Agribusiness",
      icon: Target,
      color: "bg-primary",
      description: "Learn modern farming techniques, crop management, and agricultural business",
      progress: 20,
      modules: [
        { name: "Modern Farming Techniques", completed: true, duration: "3 weeks" },
        { name: "Crop Management & Irrigation", completed: false, duration: "4 weeks" },
        { name: "Livestock Management", completed: false, duration: "3 weeks" },
        { name: "Agricultural Business Planning", completed: false, duration: "2 weeks" },
      ],
      jobOpportunities: [
        { role: "Farm Manager", demand: "Medium", avgSalary: "RWF 180,000/month" },
        { role: "Agricultural Technician", demand: "High", avgSalary: "RWF 150,000/month" },
        { role: "Agribusiness Specialist", demand: "Medium", avgSalary: "RWF 220,000/month" },
      ],
      certifications: ["Modern Agriculture Certificate", "Agribusiness Management"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/beneficiary">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Pathways Deep Dive</h1>
              <p className="text-muted-foreground">Employment Track - Explore detailed career pathways and opportunities</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="border-primary text-primary">Phase 2</Badge>
            <Badge variant="outline" className="border-primary text-primary">Employment Track</Badge>
            <Badge variant="outline" className="border-primary text-primary">{careerPathways.length} Career Pathways</Badge>
          </div>
        </div>

        {/* Career Pathways Grid */}
        <div className="space-y-6">
          {careerPathways.map((pathway) => (
            <Card key={pathway.id} className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${pathway.color} text-white rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <pathway.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl mb-2">{pathway.title}</CardTitle>
                      <CardDescription className="text-base">{pathway.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{pathway.progress}%</div>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="modules" className="w-full">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="jobs">Job Opportunities</TabsTrigger>
                    <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  </TabsList>

                  {/* Modules Tab */}
                  <TabsContent value="modules" className="mt-4">
                    <div className="space-y-3">
                      <div className="mb-4">
                        <Progress value={pathway.progress} className="h-2" />
                      </div>
                      {pathway.modules.map((module, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                            module.completed
                              ? "bg-primary/5 border-primary"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {module.completed ? (
                              <CheckCircle2 className="w-6 h-6 text-primary" />
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                            )}
                            <div>
                              <p className="font-medium">{module.name}</p>
                              <p className="text-sm text-muted-foreground">Duration: {module.duration}</p>
                            </div>
                          </div>
                          {!module.completed && (
                            <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                              Start Module
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Job Opportunities Tab */}
                  <TabsContent value="jobs" className="mt-4">
                    <div className="space-y-3">
                      {pathway.jobOpportunities.map((job, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{job.role}</h4>
                              <p className="text-sm text-muted-foreground mt-1">Average Salary: {job.avgSalary}</p>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-primary text-primary"
                            >
                              {job.demand} Demand
                            </Badge>
                          </div>
                        </div>
                      ))}
                      <Card className="bg-primary/5 border-primary">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold mb-2">Job Placement Support</h4>
                              <p className="text-sm text-muted-foreground">
                                Complete the pathway modules to access job placement assistance, resume building, interview preparation, and direct connections with employers in this field.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Certifications Tab */}
                  <TabsContent value="certifications" className="mt-4">
                    <div className="space-y-3">
                      {pathway.certifications.map((cert, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border-2 border-primary">
                          <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 text-primary" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{cert}</h4>
                              <p className="text-sm text-muted-foreground">
                                Awarded upon pathway completion
                              </p>
                            </div>
                            <Badge variant="outline" className="border-primary text-primary">
                              Recognized
                            </Badge>
                          </div>
                        </div>
                      ))}
                      <Card className="bg-primary/5 border-primary">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="font-semibold mb-2">Industry-Recognized Certifications</h4>
                              <p className="text-sm text-muted-foreground">
                                All certifications are recognized by industry partners and employers across Rwanda, enhancing your employment opportunities and career advancement prospects.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Progress Summary */}
        <Card className="mt-8 border-2 border-primary">
          <CardHeader>
            <CardTitle>Your Overall Pathway Progress</CardTitle>
            <CardDescription>Track your progress across all career pathways</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {careerPathways.map((pathway, idx) => (
                <div key={idx} className="text-center">
                  <div className={`w-12 h-12 ${pathway.color} text-white rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <pathway.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium mb-2">{pathway.title}</p>
                  <Progress value={pathway.progress} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">{pathway.progress}% Complete</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}