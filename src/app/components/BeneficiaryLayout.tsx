import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
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
  GraduationCap
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

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
  const [expandedItems, setExpandedItems] = useState<string[]>(["Phase 1: Training"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock user data - in real app, this would come from context/state
  const user = {
    name: "Jean Baptiste",
    email: "jean.baptiste@example.com",
    selectedForPhase2: true,
    phase2Track: "entrepreneurship" // "employment" or "entrepreneurship"
  };

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
        { title: "Pathways", path: "/beneficiary/pathways" },
        { title: "Track Assignment", path: "/beneficiary/eligibility" },
      ]
    },
    {
      title: "Phase 2: Employment",
      icon: Building2,
      locked: !user.selectedForPhase2 || user.phase2Track !== "employment",
      badge: user.phase2Track === "employment" ? "Active" : "Locked",
      children: [
        { title: "Pathways Deep Dive", path: "/beneficiary/pathways-deepdive" },
        { title: "Employment Chatbot", path: "/beneficiary/chatbot" },
        { title: "Results & Reports", path: "/beneficiary/results" },
      ]
    },
    {
      title: "Phase 2: Entrepreneur",
      icon: Briefcase,
      locked: !user.selectedForPhase2 || user.phase2Track !== "entrepreneurship",
      badge: user.phase2Track === "entrepreneurship" ? "Active" : "Locked",
      children: [
        { title: "Business Chatbot", path: "/beneficiary/chatbot" },
        { title: "Results & Reports", path: "/beneficiary/results" },
      ]
    }
  ];

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (path: string) => location.pathname === path;

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
                      {!item.locked && (
                        expandedItems.includes(item.title) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </button>
                  {expandedItems.includes(item.title) && !item.locked && (
                    <div className="ml-7 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-3 py-2 rounded text-sm transition-colors ${
                            isActive(child.path)
                              ? "bg-primary text-white font-medium"
                              : "hover:bg-white/5"
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
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </Link>
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