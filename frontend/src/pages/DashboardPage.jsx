import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  Bot,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProfileDialog } from "@/components/ProfileDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import DashboardSection from "@/components/DashboardSection";
import CourseSection from "@/components/CourseSection";
import ResourcesSection from "@/components/ResourcesSection";
import AdminResourcesSection from "@/components/AdminResourcesSection";

const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePicture: "",
    bio: "",
    phoneNumber: "",
    studentId: "",
    isAdmin: false,
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfileUpdate = (updatedUser) => {
    setUserData(updatedUser);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: BookOpen, label: "Courses", key: "courses" },
    { icon: FileText, label: "Resources", key: "resources" },
    { icon: Calendar, label: "Study Planner", key: "studyPlanner" },
    { icon: Bot, label: "AI Assistant", key: "aiAssistant" },
    { icon: Settings, label: "Settings", key: "settings" },
  ];

  if (userData.isAdmin) {
    sidebarItems.push({ icon: ShieldCheck, label: "Admin", key: "admin" });
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "courses":
        return <CourseSection />;
      case "resources":
        return <ResourcesSection />;
      case "admin":
        return userData.isAdmin ? <AdminResourcesSection /> : null;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden lg:flex flex-col w-64 bg-white border-r"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">StudyMate.</h2>
        </div>
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className={`w-full justify-start ${
                  activeSection === item.key ? "bg-secondary" : ""
                }`}
                onClick={() => setActiveSection(item.key)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </motion.aside>

      {/* Mobile Header */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>StudyMate.</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-1 mt-4">
            {sidebarItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className={`justify-start ${
                  activeSection === item.key ? "bg-secondary" : ""
                }`}
                onClick={() => {
                  setActiveSection(item.key);
                  document.body.click();
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center flex-1">
            <form className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search resources..." className="pl-8" />
              </div>
            </form>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${userData.name}`}
                    />
                    <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {renderActiveSection()}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Profile Dialog */}
      <ProfileDialog
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={userData}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Dashboard;
