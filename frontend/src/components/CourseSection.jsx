import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import CourseCard from "./CourseCard";
import CourseForm from "./CourseForm";

const API_BASE_URL = "http://localhost:5000/api";

export default function CourseSection() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(response.data.data.courses || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Failed to fetch courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/courses`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses([...courses, response.data.data.course]);
      setIsAddingCourse(false);
      setError(null);
    } catch (error) {
      console.error("Error adding course:", error);
      setError("Failed to add course. Please try again later.");
    }
  };

  const handleEditCourse = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/courses/${selectedCourse._id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCourses(
        courses.map((course) =>
          course._id === selectedCourse._id ? response.data.data.course : course
        )
      );
      setIsEditingCourse(false);
      setSelectedCourse(null);
      setError(null);
    } catch (error) {
      console.error("Error editing course:", error);
      setError("Failed to edit course. Please try again later.");
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(courses.filter((course) => course._id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Failed to delete course. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Courses</h2>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={() => setIsAddingCourse(true)}>Add New Course</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onEdit={() => {
              setSelectedCourse(course);
              setIsEditingCourse(true);
            }}
            onDelete={handleDeleteCourse}
          />
        ))}
      </div>

      <Dialog open={isAddingCourse} onOpenChange={setIsAddingCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <CourseForm onSubmit={handleAddCourse} initialData={{}} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingCourse} onOpenChange={setIsEditingCourse}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <CourseForm
            onSubmit={handleEditCourse}
            initialData={selectedCourse || {}}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
