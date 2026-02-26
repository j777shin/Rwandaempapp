import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import {
  Home,
  BookOpen,
  Route,
  Trophy,
  MessageCircle,
  FileText,
  Building2,
  Briefcase,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  X,
  User,
  GraduationCap,
  Lightbulb,
  Lock,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { useAuth } from "@/app/context/AuthContext";

interface MenuItem {
  title: string;
  icon: any;
  path?: string;
  children?: { title: string; path: string }[];
  locked?: boolean;
  badge?: string;
}

export function BeneficiaryLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Phase 1: Training", "Phase 2: Employment", "Phase 2: Entrepreneur"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Use auth context data, fall back to defaults for display
  const beneficiary = authUser?.beneficiary;
  const user = {
    name: beneficiary?.name || authUser?.email || "User",
    email: authUser?.email || "",
    selectedForPhase2: beneficiary?.selection_status === "selected",
    phase2Track: beneficiary?.track || null,
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isEmploymentTrack = user.phase2Track === "employment" || user.phase2Track === "both";
  const isEntrepreneurshipTrack = user.phase2Track === "entrepreneurship" || user.phase2Track === "both";

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/beneficiary"
    },
    {
      title: "Phase 1: Training",
      icon: GraduationCap,
      children: [
        { title: "SkillCraft Test", path: "/beneficiary/skillcraft" },
        { title: "eLearning- Ingazi", path: "/beneficiary/ingazi" },
        { title: "Business Development", path: "/beneficiary/business-development" },
        { title: "Completion Survey", path: "/beneficiary/survey?type=phase1" },
      ]
    },
    {
      title: "Phase 2: Employment",
      icon: Building2,
      locked: !isEmploymentTrack,
      children: [
        { title: "eLearning- Ingazi", path: "/beneficiary/ingazi-deepdive" },
        { title: "Completion Survey", path: "/beneficiary/survey?type=employment" },
      ]
    },
    {
      title: "Phase 2: Entrepreneur",
      icon: Briefcase,
      locked: !isEntrepreneurshipTrack,
      children: [
        { title: "Business Chatbot", path: "/beneficiary/chatbot" },
        { title: "Results & Reports", path: "/beneficiary/results" },
        { title: "Completion Survey", path: "/beneficiary/survey?type=entrepreneurship" },
      ]
    }
  ];

  // Route-level protection: redirect if accessing a locked phase via URL
  const employmentPaths = ["/beneficiary/ingazi-deepdive"];
  const entrepreneurPaths = ["/beneficiary/chatbot", "/beneficiary/results"];
  const currentPath = location.pathname;
  const currentSearch = location.search;

  useEffect(() => {
    const isEmploymentRoute = employmentPaths.some(p => currentPath === p) ||
      (currentPath === "/beneficiary/survey" && currentSearch === "?type=employment");
    const isEntrepreneurRoute = entrepreneurPaths.some(p => currentPath === p) ||
      (currentPath === "/beneficiary/survey" && currentSearch === "?type=entrepreneurship");

    if (isEmploymentRoute && !isEmploymentTrack) {
      navigate("/beneficiary", { replace: true });
    } else if (isEntrepreneurRoute && !isEntrepreneurshipTrack) {
      navigate("/beneficiary", { replace: true });
    }
  }, [currentPath, currentSearch, isEmploymentTrack, isEntrepreneurshipTrack, navigate]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => {
    if (path.includes("?")) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-[#171717] text-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        } overflow-hidden flex-shrink-0`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Rwanda MVP</span>
          </div>
          <p className="text-xs text-white/60 mt-2">Beneficiary Portal</p>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    onClick={() => !item.locked && toggleExpanded(item.title)}
                    disabled={item.locked}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors text-sm ${
                      item.locked 
                        ? "opacity-50 cursor-not-allowed" 
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs h-5 ${
                            item.badge === "Active" 
                              ? "bg-primary/20 border-primary text-primary" 
                              : "bg-white/10 border-white/30 text-white/60"
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.locked ? (
                        <Lock className="w-3.5 h-3.5 text-white/40" />
                      ) : (
                        expandedItems.includes(item.title) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </button>
                  {expandedItems.includes(item.title) && !item.locked && (
                    <div className="ml-4 mt-1 space-y-1 bg-white/10 rounded-lg p-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-3 py-2 rounded text-sm transition-colors ${
                            isActive(child.path)
                              ? "bg-primary text-white font-medium"
                              : "hover:bg-white/10"
                          }`}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path!}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-sm ${
                    isActive(item.path!)
                      ? "bg-primary text-white font-medium"
                      : "hover:bg-white/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="flex items-center gap-3">
            {user.selectedForPhase2 && (
              <Badge variant="outline" className="border-primary text-primary">
                Phase 2 - {user.phase2Track === "employment" ? "Employment" : "Entrepreneurship"}
              </Badge>
            )}
            <div className="text-right">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <Button variant="ghost" size="sm" className="text-foreground hover:text-primary" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}