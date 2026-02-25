import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router";
import {
  Users,
  Settings,
  BarChart3,
  UserCheck,
  Award,
  Building2,
  Briefcase,
  UserCog,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/context/AuthContext";
import { api } from "@/app/lib/api";

interface MenuItem {
  title: string;
  icon: any;
  path?: string;
  children?: { title: string; path: string }[];
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: authUser, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>(["General Management", "Phase 1 Management", "Phase 2 Management"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      // Reset phase 2 first (needs selection_status still set), then reset phase 1
      await api.adminResetPhase2();
      await api.adminResetSelection();
    } catch {
      // Ensure logout completes even if reset fails
    }
    await logout();
    navigate("/");
  };

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin"
    },
    {
      title: "General Management",
      icon: Settings,
      children: [
        { title: "Data Registration", path: "/admin/registration" },
        { title: "Account Management", path: "/admin/accounts" },
        { title: "Analytics", path: "/admin/analytics" },
        { title: "Survey Results", path: "/admin/surveys" },
      ]
    },
    {
      title: "Phase 1 Management",
      icon: GraduationCap,
      children: [
        { title: "Phase 1 Selection", path: "/admin/phase1-selection" },
        { title: "Progress View", path: "/admin/progress" },
      ]
    },
    {
      title: "Phase 2 Management",
      icon: Award,
      children: [
        { title: "Phase 2 Selection", path: "/admin/selection" },
        { title: "Employment Track View", path: "/admin/employment-progress" },
        { title: "Entrepreneur Track View", path: "/admin/entrepreneur-progress" },
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
          sidebarOpen ? "w-56" : "w-0"
        } overflow-hidden flex-shrink-0`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Rwanda MVP</span>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)]">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded hover:bg-white/5 transition-colors text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && (
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
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{authUser?.email || "Admin"}</p>
              <p className="text-xs text-muted-foreground">Government Official</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-semibold">
              {(authUser?.email || "A")[0].toUpperCase()}
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