"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  GraduationCap,
  Trash,
  Plus,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const API_BASE_URL = "http://localhost:5000/api";

export default function CourseCard({ course, onEdit, onDelete }) {
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    completed: false,
  });

  useEffect(() => {
    fetchNotes();
    fetchAssignments();
    calculateProgress();
  }, [course]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/courses/${course._id}/notes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(response.data.data.notes || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/courses/${course._id}/assignments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments(response.data.data.assignments || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const calculateProgress = () => {
    const now = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsed = now.getTime() - startDate.getTime();
    const calculatedProgress = Math.min(
      Math.max((elapsed / totalDuration) * 100, 0),
      100
    );
    setProgress(calculatedProgress);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/courses/${course._id}/notes`,
        { content: newNote },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes([...notes, response.data.data.note]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE_URL}/courses/${course._id}/notes/${noteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleAddAssignment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/courses/${course._id}/assignments`,
        newAssignment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments([...assignments, response.data.data.assignment]);
      setNewAssignment({
        title: "",
        description: "",
        dueDate: "",
        completed: false,
      });
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  const handleUpdateAssignment = async (assignmentId, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/courses/${course._id}/assignments/${assignmentId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments(
        assignments.map((assignment) =>
          assignment._id === assignmentId
            ? response.data.data.assignment
            : assignment
        )
      );
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className="space-y-4">
            <form onSubmit={handleAddNote} className="space-y-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note"
                className="w-full"
              />
              <Button type="submit" size="sm">
                Add Note
              </Button>
            </form>
            <ScrollArea className="h-[200px] w-full">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <div key={note._id} className="mb-4 group">
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{note.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteNote(note._id)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notes yet
                </p>
              )}
            </ScrollArea>
          </div>
        );

      case "assignments":
        return (
          <div className="space-y-4">
            <form onSubmit={handleAddAssignment} className="space-y-2">
              <Input
                value={newAssignment.title}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, title: e.target.value })
                }
                placeholder="Assignment title"
              />
              <Textarea
                value={newAssignment.description}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    description: e.target.value,
                  })
                }
                placeholder="Assignment description"
              />
              <Input
                type="date"
                value={newAssignment.dueDate}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    dueDate: e.target.value,
                  })
                }
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="completed"
                  checked={newAssignment.completed}
                  onCheckedChange={(checked) =>
                    setNewAssignment({
                      ...newAssignment,
                      completed: checked,
                    })
                  }
                />
                <Label htmlFor="completed">Completed</Label>
              </div>
              <Button type="submit" size="sm">
                Add Assignment
              </Button>
            </form>
            <ScrollArea className="h-[200px] w-full">
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="mb-4 p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {assignment.description}
                        </p>
                      </div>
                      <Badge
                        variant={assignment.completed ? "success" : "outline"}
                      >
                        {assignment.completed ? "Done" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">
                        Due:{" "}
                        {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleUpdateAssignment(assignment._id, {
                            ...assignment,
                            completed: !assignment.completed,
                          })
                        }
                      >
                        {assignment.completed
                          ? "Mark Incomplete"
                          : "Mark Complete"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No assignments yet
                </p>
              )}
            </ScrollArea>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <Progress value={progress} className="h-1.5" />
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <span>
                  {format(new Date(course.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(course.endDate), "MMM d, yyyy")}
                </span>
              </div>
              {course.schedule && (
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <span>{course.schedule}</span>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-md transition-all duration-300 group">
      <CardHeader className="pb-2 relative">
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-t-lg"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl font-bold text-primary  duration-300">
              {course.title}
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-secondary text-secondary-foreground"
            >
              {course.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Avatar className="w-10 h-10 border-2 border-background">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${course.professor}`}
                alt={course.professor}
              />
              <AvatarFallback>
                {course.professor
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground">
              {course.professor}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "notes" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </Button>
          <Button
            variant={activeTab === "assignments" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("assignments")}
          >
            Assignments
          </Button>
        </div>
        {renderContent()}
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between p-4">
        <Button variant="ghost" size="sm" onClick={() => onEdit(course)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(course._id)}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
