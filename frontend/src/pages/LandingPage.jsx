
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Clock, Bot, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="h-full w-full"
  >
    <Card className="h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="space-y-4 p-6">
        <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-lg sm:text-xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  </motion.div>
);

const LandingPage = () => {
  const features = [
    {
      icon: Calendar,
      title: "Course Management",
      description:
        "Organize and track your academic progress with our intuitive course management system.",
    },
    {
      icon: BookOpen,
      title: "Resource Library",
      description:
        "Access a vast collection of study materials, guides, and resources anytime, anywhere.",
    },
    {
      icon: Clock,
      title: "Time Management",
      description:
        "Boost productivity with smart scheduling and time tracking tools designed for students.",
    },
    {
      icon: Bot,
      title: "AI Assistant",
      description:
        "Get instant help and answers from our advanced RASA-powered AI learning companion.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Connect with peers, join study groups, and share resources in real-time.",
    },
    {
      icon: Brain,
      title: "Smart Learning",
      description:
        "Experience personalized learning paths adapted to your unique learning style and pace.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
     
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-12"
        >
 
          <div className="flex justify-center mb-6">
            <Badge variant="secondary" className="px-4 py-1 text-sm">
              AI-Powered Learning Platform
            </Badge>
          </div>

          <motion.h1
            className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-800 leading-tight"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Student Resource
            <br className="hidden md:block" />
            Management System
          </motion.h1>


          <motion.p
            className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Transform your learning experience with AI assistance and smart
            resource management tools designed for modern students.
          </motion.p>


          <motion.div
            className="flex flex-col md:flex-row justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="w-full md:w-auto min-w-[200px]"
            >
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full md:w-auto min-w-[200px]"
            >
              <Link to="/signin">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>


        <div className="mt-12">
          <Tabs defaultValue="features" className="w-full">

            <div className="flex justify-center mb-8">
              <TabsList className="w-full max-w-xs">
                <TabsTrigger value="features" className="w-full">
                  Key Features
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    {...feature}
                    delay={0.2 + index * 0.1}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
