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
import { ProfileDialog } from "@/components/ProfileDialog";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        className="w-64 bg-white shadow-md"
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold">SRMS</h2>
        </div>
        <nav className="mt-6">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2" /> Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Book className="mr-2" /> Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2" /> Resources
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="mr-2" /> Study Planner
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start"
            onClick={() => setIsProfileOpen(true)}
          >
            <User className="mr-2" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2" /> Settings
          </Button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <motion.header
          className="bg-white shadow-sm p-4 flex justify-between items-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell />
            </Button>
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2"
              onClick={() => setIsProfileOpen(true)}
            >
              <Avatar>
                <AvatarImage src={userData.profilePicture || "https://github.com/shadcn.png"} />
                <AvatarFallback>{userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
        </motion.header>

        {/* Dashboard Content */}
        <main className="p-6">
          <motion.h2
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Welcome, {userData.name}!
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Course Overview Card */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                  <CardDescription>Your enrolled courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {courses.map((course) => (
                      <li key={course.id} className="flex items-center">
                        <Book className="mr-2 h-4 w-4" />
                        {course.name}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
  <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Tasks</CardTitle>
                  <CardDescription>
                    Your next assignments and deadlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tasks.map((task) => (
                      <li
                        key={task.id}
                        className="flex justify-between items-center"
                      >
                        <span>{task.title}</span>
                        <span className="text-sm text-gray-500">
                          {task.due}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Study Planner Card */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Study Planner</CardTitle>
                  <CardDescription>
                    Your study sessions for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {studySessions.map((session) => (
                      <li
                        key={session.id}
                        className="flex justify-between items-center"
                      >
                        <span>{session.subject}</span>
                        <span className="text-sm text-gray-500">
                          {session.time}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Resources Card */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Recent Resources</CardTitle>
                  <CardDescription>
                    Latest additions to the resource library
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {resources.map((resource) => (
                      <li
                        key={resource.id}
                        className="flex justify-between items-center"
                      >
                        <span>{resource.title}</span>
                        <span className="text-sm text-gray-500">
                          {resource.type}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat with AI Assistant Card */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chat with AI Assistant</CardTitle>
                  <CardDescription>Get help with your studies</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Placeholder for chat interface */}
                  <div className="bg-gray-100 h-40 rounded flex items-center justify-center">
                    Chat interface coming soon...
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </motion.div>
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

