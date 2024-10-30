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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="h-full"
  >
    <Card className="h-full transition-transform duration-300 hover:scale-105">
      <CardHeader className="space-y-4 p-4 sm:p-6">
        <div className="rounded-full bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-base sm:text-lg lg:text-xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {description}
          </CardDescription>
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
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 md:mb-12"
        >
          <div className="flex justify-center mb-4 sm:mb-6">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-xs sm:px-4 sm:text-sm"
            >
              AI-Powered Learning Platform
            </Badge>
          </div>

          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 text-gray-800 leading-tight px-2"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Student Resource
            <span className="block mt-1">Management System</span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 mb-6 sm:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Transform your learning experience with AI assistance and smart
            resource management tools designed for modern students.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
            >
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto min-w-[200px] text-sm sm:text-base"
            >
              <Link to="/signin">Sign In</Link>
            </Button>
          </motion.div>
        </motion.div>

        <div className="mt-8 sm:mt-12">
          <Tabs defaultValue="features" className="w-full">
            <div className="flex justify-center mb-6 sm:mb-8">
              <TabsList className="w-full max-w-[280px] sm:max-w-xs">
                <TabsTrigger
                  value="features"
                  className="w-full text-xs sm:text-sm"
                >
                  Key Features
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="features" className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-4 md:px-0">
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
