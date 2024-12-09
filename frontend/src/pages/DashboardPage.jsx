import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Menu,
  LayoutDashboard,
  BookOpen,
  FileText,
  ShieldCheck,
  Sun,
  Moon,
  Loader,
  Rocket,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProfileDialog } from "@/components/ProfileDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import DashboardSection from "@/components/DashboardSection";
import { ChatBot } from "@/components/ChatBot";
import CourseSection from "@/components/CourseSection";
import ResourcesSection from "@/components/ResourcesSection";
import AdminResourcesSection from "@/components/AdminResourcesSection";

import { PomodoroSection } from "@/components/PomodoroSection";

const API_BASE_URL = "http://localhost:5000/api";

export default function Dashboard() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleProfileUpdate = (updatedUser) => {
    setUserData(updatedUser);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.notifications.filter((n) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const baseSidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
    { icon: BookOpen, label: "Courses", key: "courses" },
    { icon: FileText, label: "Resources", key: "resources" },
    { icon: Timer, label: "Pomodoro", key: "pomodoro" },
  ];

  const sidebarItems = userData?.isAdmin
    ? [...baseSidebarItems, { icon: ShieldCheck, label: "Admin", key: "admin" }]
    : baseSidebarItems;

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "courses":
        return <CourseSection />;
      case "resources":
        return <ResourcesSection />;
      case "pomodoro":
        return <PomodoroSection />;
      case "admin":
        return userData?.isAdmin ? <AdminResourcesSection /> : null;
      default:
        return <DashboardSection />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
        <div className="flex justify-center items-center h-full">
          <Loader className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "dark" : ""
      } bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
    >
      {/* Desktop Sidebar */}
      <motion.aside
        className={`hidden lg:flex flex-col w-64 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-800/95 to-gray-900/95"
            : "bg-gradient-to-b from-indigo-500 to-purple-500"
        } text-white transition-colors duration-300`}
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-6">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Rocket className="h-8 w-8 text-white" />
            <h2 className="text-2xl font-bold text-white">StudyMate</h2>
          </motion.div>
        </div>
        <ScrollArea className="flex-1 py-6">
          <nav className="space-y-2 px-4">
            {sidebarItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className={`w-full justify-start transition-all duration-200 ease-in-out text-white hover:text-white ${
                  activeSection === item.key
                    ? "bg-white/20 font-medium"
                    : "hover:bg-white/10"
                }`}
                onClick={() => setActiveSection(item.key)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </motion.aside>

      {/* Mobile Header */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden absolute top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className={`${
            isDarkMode
              ? "bg-gradient-to-b from-gray-800 to-gray-900"
              : "bg-gradient-to-b from-blue-600 to-purple-600"
          } text-white transition-colors duration-300`}
        >
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <Rocket className="h-8 w-8" />
              EduLaunch
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-2 mt-8">
            {sidebarItems.map((item) => (
              <Button
                key={item.key}
                variant="ghost"
                className={`justify-start transition-all duration-200 ease-in-out text-white hover:text-white ${
                  activeSection === item.key
                    ? "bg-white/20 font-medium"
                    : "hover:bg-white/10"
                }`}
                onClick={() => {
                  setActiveSection(item.key);
                  document.body.click();
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-end px-4 lg:px-8 gap-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Notifications</h4>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 py-2">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`py-2 ${
                            !notification.read
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }`}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(
                              notification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setIsProfileOpen(true)}
                  className="cursor-pointer"
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                className="grid gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderActiveSection()}
              </motion.div>
            </AnimatePresence>
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
      <ChatBot />
    </div>
  );
}
