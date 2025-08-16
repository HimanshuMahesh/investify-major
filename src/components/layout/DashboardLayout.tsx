
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Search, 
  MessageSquare, 
  BarChart, 
  Settings, 
  LogOut,
  Menu,
  ChevronLeft,
  User,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { logout } = useAuth();

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Determine which navigation item is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
      setShowLogoutDialog(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setShowLogoutDialog(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar */}
        <Sidebar 
          className="bg-white border-r border-r-investify-mint/50 shadow-sm transition-all duration-300"
          collapsible="icon"
        >
          <SidebarHeader className="p-4 border-b border-investify-mint/20">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-investify-primary font-garrett">
                  {!collapsed ? "Investify" : "I"}
                </span>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="text-investify-primary hover:bg-investify-mint/20"
              >
                {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
              </Button>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="bg-white px-2 py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/dashboard") || isActive("/business-dashboard") || isActive("/investor-dashboard")}
                  tooltip="Dashboard"
                  className={`${isActive("/dashboard") || isActive("/business-dashboard") || isActive("/investor-dashboard") ? "bg-investify-mint/20 text-investify-primary" : ""}`}
                  onClick={() => navigate("/dashboard")}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/matches")}
                  tooltip="Matches"
                  className={isActive("/matches") ? "bg-investify-mint/20 text-investify-primary" : ""}
                  onClick={() => navigate("/matches")}
                >
                  <Search className="h-5 w-5" />
                  <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Matches</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/messages")}
                  tooltip="Messages"
                  className={isActive("/messages") ? "bg-investify-mint/20 text-investify-primary" : ""}
                  onClick={() => navigate("/messages")}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Messages</span>
                  <span className={`${collapsed ? "absolute -top-1 -right-1" : "ml-auto"} bg-investify-primary text-white text-xs px-2 py-0.5 rounded-full`}>
                    3
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/analytics")}
                  tooltip="Analytics"
                  className={isActive("/analytics") ? "bg-investify-mint/20 text-investify-primary" : ""}
                  onClick={() => navigate("/analytics")}
                >
                  <BarChart className="h-5 w-5" />
                  <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/settings")}
                  tooltip="Settings"
                  className={isActive("/settings") ? "bg-investify-mint/20 text-investify-primary" : ""}
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-5 w-5" />
                  <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive("/settings?tab=profile")}
                  tooltip="Profile"
                  className={isActive("/settings?tab=profile") ? "bg-investify-mint/20 text-investify-primary" : ""}
                  onClick={() => navigate("/settings?tab=profile")}
                >
                  <User className="h-5 w-5" />
                  <span className={`ml-3 ${collapsed ? "hidden" : "block"}`}>Profile</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-investify-mint/20 px-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-gray-700 hover:bg-investify-mint/20 hover:text-investify-primary my-4"
              onClick={() => setShowLogoutDialog(true)}
            >
              <LogOut className="mr-3 h-5 w-5" />
              {!collapsed && <span>Log out</span>}
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-10 bg-gray-50">
          {/* Mobile sidebar trigger */}
          <div className="sticky top-0 z-10 bg-white border-b py-2 px-4 flex items-center lg:hidden">
            <SidebarTrigger className="mr-4" />
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-investify-primary font-garrett">Investify</span>
            </Link>
          </div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Logout confirmation dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the login page. Any unsaved changes may be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogoutConfirm} className="bg-investify-primary hover:bg-investify-primary/90">
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default DashboardLayout;
