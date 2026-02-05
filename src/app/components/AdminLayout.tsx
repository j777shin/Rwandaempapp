import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router";
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
  X
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface MenuItem {
  title: string;
  icon: any;
  path?: string;
  children?: { title: string; path: string }[];
}

export function AdminLayout() {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Phase 1 Management"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin"
    },
    {
      title: "Phase 1 Management",
      icon: GraduationCap,
      children: [
        { title: "Data Registration", path: "/admin/registration" },
        { title: "Beneficiary Selection", path: "/admin/selection" },
        { title: "Progress View", path: "/admin/progress" },
      ]
    },
    {
      title: "Phase 2 Management",
      icon: Award,
      children: [
        { title: "Track Assignment", path: "/admin/track-assignment" },
        { title: "Employment Track View", path: "/admin/employment-progress" },
        { title: "Entrepreneur Track View", path: "/admin/entrepreneur-progress" },
      ]
    },
    {
      title: "General Management",
      icon: Settings,
      children: [
        { title: "Account Management", path: "/admin/accounts" },
        { title: "Analytics", path: "/admin/analytics" },
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
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">Government Official</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-semibold">
              AU
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