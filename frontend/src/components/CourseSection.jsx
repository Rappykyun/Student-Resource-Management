import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import CourseCard from "./CourseCard";
import CourseForm from "./CourseForm";
import NoteForm from "./NoteForm";
import AssignmentForm from "./AssignmentForm";

const API_BASE_URL = "http://localhost:5000/api";

const CourseSection = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isViewingNotes, setIsViewingNotes] = useState(false);
  const [isViewingAssignments, setIsViewingAssignments] = useState(false);
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

  const handleViewNotes = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/notes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes(response.data.data.notes || []);
      setSelectedCourse(courses.find((course) => course._id === courseId));
      setIsViewingNotes(true);
      setError(null);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Failed to fetch notes. Please try again later.");
    }
  };

  const handleAddNote = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/courses/${selectedCourse._id}/notes`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes([...notes, response.data.data.note]);
      setError(null);
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Failed to add note. Please try again later.");
    }
  };

  const handleViewAssignments = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/courses/${courseId}/assignments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments(response.data.data.assignments || []);
      setSelectedCourse(courses.find((course) => course._id === courseId));
      setIsViewingAssignments(true);
      setError(null);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Failed to fetch assignments. Please try again later.");
    }
  };

  const handleAddAssignment = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/courses/${selectedCourse._id}/assignments`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments([...assignments, response.data.data.assignment]);
      setError(null);
    } catch (error) {
      console.error("Error adding assignment:", error);
      setError("Failed to add assignment. Please try again later.");
    }
  };

  const handleUpdateAssignment = async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/courses/${selectedCourse._id}/assignments/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments(
        assignments.map((assignment) =>
          assignment._id === id ? response.data.data.assignment : assignment
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error updating assignment:", error);
      setError("Failed to update assignment. Please try again later.");
    }
  };

  const handleDeleteAssignment = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/courses/${selectedCourse._id}/assignments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignments(assignments.filter((assignment) => assignment._id !== id));
      setError(null);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setError("Failed to delete assignment. Please try again later.");
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
            onViewNotes={handleViewNotes}
            onViewAssignments={handleViewAssignments}
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

      <Dialog open={isViewingNotes} onOpenChange={setIsViewingNotes}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notes for {selectedCourse?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note._id} className="border p-2 rounded">
                <p>{note.content}</p>
              </div>
            ))}
            <NoteForm onSubmit={handleAddNote} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewingAssignments}
        onOpenChange={setIsViewingAssignments}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assignments for {selectedCourse?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <Card key={assignment._id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{assignment.description}</p>
                  <p>
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      handleUpdateAssignment(assignment._id, {
                        ...assignment,
                        completed: !assignment.completed,
                      })
                    }
                  >
                    {assignment.completed ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            <AssignmentForm onSubmit={handleAddAssignment} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseSection;
