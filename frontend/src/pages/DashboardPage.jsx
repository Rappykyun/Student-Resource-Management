import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Bell,
  Book,
  Calendar,
  FileText,
  Home,
  LogOut,
  Settings,
  User,
  Search,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Bot,
  Menu,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePicture: "",
    bio: "",
    phoneNumber: "",
    studentId: "",
  });
  const [courses, setCourses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [resources, setResources] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfileUpdate = (updatedUser) => {
    setUserData(updatedUser);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/dashboard/data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { user, courses, tasks, studySessions, resources } =
          response.data.data;
        setUserData(user);
        setCourses(courses);
        setTasks(tasks);
        setStudySessions(studySessions);
        setResources(resources);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        if (error.response?.status === 401) {
          navigate("/");
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: BookOpen, label: "Courses" },
    { icon: FileText, label: "Resources" },
    { icon: Calendar, label: "Study Planner" },
    { icon: Bot, label: "AI Assistant" },
    { icon: Settings, label: "Settings" },
  ];

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
            {sidebarItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
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
            {sidebarItems.map((item, index) => (
              <Button key={index} variant="ghost" className="justify-start">
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
                      src={userData.profilePicture}
                      alt={userData.name}
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
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Course Progress Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Course Progress
                          <Badge variant="secondary">4 Active</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {courses.slice(0, 3).map((course, index) => (
                          <div key={index} className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{course.name}</span>
                              <span className="text-muted-foreground">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Upcoming Tasks Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Tasks</CardTitle>
                        <CardDescription>Next 7 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          {tasks.map((task, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center mb-4"
                            >
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {task.course}
                                </p>
                              </div>
                              <Badge variant="outline">{task.due}</Badge>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>

                    {/* Study Sessions Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Todays Schedule</CardTitle>
                        <CardDescription>Your study sessions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[200px]">
                          {studySessions.map((session, index) => (
                            <div key={index} className="mb-4">
                              <div className="flex justify-between items-center">
                                <p className="font-medium">{session.subject}</p>
                                <Badge>{session.time}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {session.topic}
                              </p>
                            </div>
                          ))}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Assistant Card */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bot className="mr-2 h-5 w-5" />
                        AI Study Assistant
                      </CardTitle>
                      <CardDescription>
                        Get help with your studies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-secondary p-4 rounded-lg flex items-center justify-between">
                        <p className="text-secondary-foreground">
                          Ask me anything about your courses or study material!
                        </p>
                        <Button>Start Chat</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="courses">
                  {/* Course content here */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{course.name}</CardTitle>
                          <CardDescription>{course.instructor}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress value={75} className="mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Next class: {course.nextClass}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="resources">
                  {/* Resources content here */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {resources.map((resource, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle>{resource.title}</CardTitle>
                          <CardDescription>{resource.type}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                          <Button className="mt-4" variant="outline">
                            View Resource
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
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