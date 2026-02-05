import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { 
  UserPlus, 
  UserCheck, 
  ClipboardList,
  Award,
  Building2,
  Briefcase,
  UserCog,
  BarChart3,
  ArrowRight,
  GraduationCap,
  Settings
} from "lucide-react";

export function AdminDashboard() {
  const phase1Actions = [
    { 
      title: "Data Registration", 
      description: "Register new candidates with CSV upload or manual entry", 
      link: "/admin/registration", 
      icon: UserPlus,
    },
    { 
      title: "Beneficiary Selection", 
      description: "Select Phase 2 candidates based on eligibility", 
      link: "/admin/selection", 
      icon: UserCheck,
    },
    { 
      title: "Progress View", 
      description: "View and track Phase 1 beneficiary progress", 
      link: "/admin/progress", 
      icon: ClipboardList,
    },
  ];

  const phase2Actions = [
    { 
      title: "Track Assignment", 
      description: "Assign beneficiaries to Employment or Entrepreneur tracks", 
      link: "/admin/track-assignment", 
      icon: Award,
    },
    { 
      title: "Employment Track View", 
      description: "Monitor employment track progress and completion", 
      link: "/admin/employment-progress", 
      icon: Building2,
    },
    { 
      title: "Entrepreneur Track View", 
      description: "Track entrepreneurship development and outcomes", 
      link: "/admin/entrepreneur-progress", 
      icon: Briefcase,
    },
  ];

  const generalActions = [
    { 
      title: "Account Management", 
      description: "Manage beneficiary accounts and user information", 
      link: "/admin/accounts", 
      icon: UserCog,
    },
    { 
      title: "Analytics", 
      description: "View comprehensive program analytics and insights", 
      link: "/admin/analytics", 
      icon: BarChart3,
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Rwanda MVP Program - Administrative Portal</p>
      </div>

      {/* Phase 1 Management */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Phase 1 Management</h2>
            <p className="text-sm text-muted-foreground">Training phase registration and monitoring</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phase1Actions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="border-border bg-white hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors text-lg">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Access</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Phase 2 Management */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Phase 2 Management</h2>
            <p className="text-sm text-muted-foreground">Employment and entrepreneurship track oversight</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phase2Actions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="border-border bg-white hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors text-lg">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Access</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* General Management */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">General Management</h2>
            <p className="text-sm text-muted-foreground">System administration and analytics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generalActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="border-border bg-white hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer group h-full">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 h-full">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2 text-foreground group-hover:text-primary transition-colors text-lg">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Access</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
