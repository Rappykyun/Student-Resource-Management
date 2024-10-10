import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Clock, Bot, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <Icon className="w-8 h-8 mb-2 text-primary" />
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
);

const LandingPage = () => {
  const features = [
    {
      icon: Calendar,
      title: "Course Management",
      description: "Organize and track your courses effortlessly",
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Access study materials anytime, anywhere",
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Optimize your study schedule for better results",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description: "Get help from our intelligent RASA chatbot",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Connect with peers for group study sessions",
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description: "Personalized learning paths powered by AI",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            AI-Powered Learning
          </Badge>
          <motion.h1
            className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Student Resource Management System
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Transform your learning experience with AI assistance and smart
            resource management
          </motion.p>

          <motion.div
            className="space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button asChild size="lg">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/signin">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>

        <Tabs defaultValue="features" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Key Features</TabsTrigger>
            <TabsTrigger value="demo">How It Works</TabsTrigger>
          </TabsList>
          <TabsContent value="features">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  {...feature}
                  delay={0.2 + index * 0.1}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="demo">
            <Card>
              <CardContent className="pt-6">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Demo Video Placeholder</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LandingPage;
