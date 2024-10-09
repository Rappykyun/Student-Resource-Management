import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Student Resource Management System
      </h1>
      <p className="text-xl mb-8">
        Manage your courses, resources, and study time efficiently
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/signin">Sign In</Link>
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
