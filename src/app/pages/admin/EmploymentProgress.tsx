import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Building2, TrendingUp, Users, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";

export function EmploymentProgress() {
  const stats = [
    { label: "Total Employment Track", value: "1,800", icon: Building2, color: "bg-[#00A1DE]" },
    { label: "Active in Training", value: "1,450", icon: Clock, color: "bg-[#FAD201]" },
    { label: "Completed Training", value: "350", icon: CheckCircle2, color: "bg-[#00A651]" },
    { label: "Avg Progress", value: "68%", icon: TrendingUp, color: "bg-[#00A1DE]" },
  ];

  const pathwayProgress = [
    { pathway: "Construction & Trades", total: 520, avgProgress: 72, color: "bg-[#00A1DE]" },
    { pathway: "Hospitality & Tourism", total: 380, avgProgress: 65, color: "bg-[#00A651]" },
    { pathway: "Technology & Digital", total: 450, avgProgress: 78, color: "bg-[#FAD201]" },
    { pathway: "Agriculture", total: 450, avgProgress: 60, color: "bg-[#00A1DE]" },
  ];

  const recentActivity = [
    { name: "Jean Baptiste", action: "Completed module: Electrical Fundamentals", pathway: "Construction", time: "2 hours ago" },
    { name: "Marie Claire", action: "Started module: Customer Service Excellence", pathway: "Hospitality", time: "4 hours ago" },
    { name: "Patrick Uwase", action: "Completed pathway: Technology & Digital", pathway: "Technology", time: "1 day ago" },
    { name: "Grace Mukamana", action: "Started module: Modern Farming", pathway: "Agriculture", time: "2 days ago" },
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
            <div className="w-16 h-16 bg-[#00A1DE] rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl">Employment Track Progress</h1>
              <p className="text-muted-foreground">Monitor progress of beneficiaries in the Employment Track</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant="outline" className="border-[#00A651] text-[#00A651]">Phase 2</Badge>
            <Badge variant="outline" className="border-[#00A1DE] text-[#00A1DE]">Employment Track</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-l-4 border-l-[#00A1DE]">
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

        {/* Pathway Progress */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Career Pathway Breakdown</CardTitle>
            <CardDescription>Progress by career pathway within Employment Track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {pathwayProgress.map((pathway, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 ${pathway.color} rounded-full`}></div>
                      <span className="font-medium">{pathway.pathway}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{pathway.total} beneficiaries</span>
                      <span className="font-bold text-[#00A651]">{pathway.avgProgress}%</span>
                    </div>
                  </div>
                  <Progress value={pathway.avgProgress} className="h-3" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from Employment Track beneficiaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#00A1DE] rounded-full flex items-center justify-center text-white font-bold">
                      {activity.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                      <Badge variant="outline" className="mt-2 border-[#00A1DE] text-[#00A1DE]">
                        {activity.pathway}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button variant="outline" className="border-[#00A1DE] text-[#00A1DE] hover:bg-[#00A1DE] hover:text-white">
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
