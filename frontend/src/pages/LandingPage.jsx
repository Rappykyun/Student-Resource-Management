import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        Welcome to Student Resource Management System
      </motion.h1>
      <motion.p
        className="text-xl mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Manage your courses, resources, and study time efficiently
      </motion.p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
        <Button
          asChild
          variant="outline"
        >
          <Link to="/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
