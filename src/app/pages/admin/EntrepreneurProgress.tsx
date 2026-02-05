import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Briefcase, TrendingUp, Users, CheckCircle2, MessageSquare, FileText } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";

export function EntrepreneurProgress() {
  const stats = [
    { label: "Total Entrepreneur Track", value: "1,200", icon: Briefcase, color: "bg-[#00A651]" },
    { label: "Chatbot Sessions", value: "4,580", icon: MessageSquare, color: "bg-[#00A1DE]" },
    { label: "Business Plans", value: "850", icon: FileText, color: "bg-[#FAD201]" },
    { label: "Avg Progress", value: "72%", icon: TrendingUp, color: "bg-[#00A651]" },
  ];

  const businessSectors = [
    { sector: "Retail & Trade", total: 380, avgProgress: 75, color: "bg-[#00A651]" },
    { sector: "Agriculture Business", total: 320, avgProgress: 68, color: "bg-[#00A1DE]" },
    { sector: "Technology Startups", total: 280, avgProgress: 80, color: "bg-[#FAD201]" },
    { sector: "Service Industry", total: 220, avgProgress: 70, color: "bg-[#00A651]" },
  ];

  const recentActivity = [
    { name: "Emmanuel Habimana", action: "Submitted business plan: Tech Solutions", sector: "Technology", time: "1 hour ago" },
    { name: "Diane Uwera", action: "Completed chatbot session: Marketing strategies", sector: "Retail", time: "3 hours ago" },
    { name: "Samuel Niyonshuti", action: "Started module: Financial Planning", sector: "Agriculture", time: "5 hours ago" },
    { name: "Louise Mukasine", action: "Completed business canvas workshop", sector: "Services", time: "1 day ago" },
  ];

  const milestones = [
    { title: "Business Concept Development", completed: 1150, total: 1200, percentage: 96 },
    { title: "Market Research", completed: 980, total: 1200, percentage: 82 },
    { title: "Business Plan Creation", completed: 850, total: 1200, percentage: 71 },
    { title: "Financial Projections", completed: 720, total: 1200, percentage: 60 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#00A651] rounded-lg flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Entrepreneurship Track Progress</h1>
              <p className="text-muted-foreground">Monitor progress of beneficiaries in the Entrepreneurship Track</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="border-[#00A651] text-[#00A651]">Phase 2</Badge>
            <Badge variant="outline" className="border-[#00A651] text-[#00A651]">Entrepreneurship Track</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-l-4 border-l-[#00A651]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} ${stat.color === "bg-[#FAD201]" ? "text-black" : "text-white"} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Business Sector Distribution */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Business Sector Breakdown</CardTitle>
            <CardDescription>Progress by business sector within Entrepreneurship Track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {businessSectors.map((sector, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${sector.color} rounded-full`}></div>
                      <span className="font-medium">{sector.sector}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{sector.total} beneficiaries</span>
                      <span className="font-bold text-[#00A651]">{sector.avgProgress}%</span>
                    </div>
                  </div>
                  <Progress value={sector.avgProgress} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Program Milestones</CardTitle>
            <CardDescription>Key milestones completion across all entrepreneur track beneficiaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{milestone.title}</h4>
                    <Badge variant="outline" className="border-[#00A651] text-[#00A651]">
                      {milestone.percentage}%
                    </Badge>
                  </div>
                  <Progress value={milestone.percentage} className="h-2 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {milestone.completed} of {milestone.total} completed
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from Entrepreneurship Track beneficiaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#00A651] rounded-full flex items-center justify-center text-white font-bold">
                      {activity.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <Badge variant="outline" className="mt-2 border-[#00A651] text-[#00A651]">
                        {activity.sector}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="outline" className="border-[#00A651] text-[#00A651] hover:bg-[#00A651] hover:text-white">
                <Users className="w-4 h-4 mr-2" />
                View All Beneficiaries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
