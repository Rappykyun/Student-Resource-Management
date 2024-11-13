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
  CheckCircle,
  XCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

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
      const response = await axios.delete(
        `${API_BASE_URL}/courses/${course._id}/notes/${noteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 204) {
        setNotes(notes.filter((note) => note._id !== noteId));
        toast({
          title: "Success",
          description: "Note deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Assignment added successfully",
      });
    } catch (error) {
      console.error("Error adding assignment:", error);
      toast({
        title: "Error",
        description: "Failed to add assignment. Please try again.",
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Assignment updated successfully",
      });
    } catch (error) {
      console.error("Error updating assignment:", error);
      toast({
        title: "Error",
        description: "Failed to update assignment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "notes":
        return (
          <div className="space-y-4 h-[300px] p-4">
            <form onSubmit={handleAddNote} className="space-y-2">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note"
                className="w-full resize-none"
              />
              <Button type="submit" size="sm">
                Add Note
              </Button>
            </form>
            <ScrollArea className="h-[180px]">
              <div className="pr-4 space-y-4">
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <div
                      key={note._id}
                      className="p-3 bg-secondary/50 rounded-lg group"
                    >
                      <div className="flex items-start gap-2">
                        <p className="text-sm flex-1 leading-relaxed">
                          {note.content}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
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
              </div>
            </ScrollArea>
          </div>
        );

      case "assignments":
        return (
          <div className="space-y-4 h-[300px] p-4">
            <div className="bg-secondary/30 rounded-lg p-3">
              <form onSubmit={handleAddAssignment} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newAssignment.title}
                    onChange={(e) =>
                      setNewAssignment({
                        ...newAssignment,
                        title: e.target.value,
                      })
                    }
                    placeholder="Assignment title"
                    className="flex-grow h-8 text-sm"
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
                    className="w-32 h-8 text-sm"
                  />
                </div>
                <Textarea
                  value={newAssignment.description}
                  onChange={(e) =>
                    setNewAssignment({
                      ...newAssignment,
                      description: e.target.value,
                    })
                  }
                  placeholder="Assignment description"
                  className="resize-none h-16 text-sm"
                />
                <div className="flex items-center justify-between">
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
                    <Label htmlFor="completed" className="text-sm">
                      Completed
                    </Label>
                  </div>
                  <Button type="submit" size="sm">
                    Add Assignment
                  </Button>
                </div>
              </form>
            </div>
            <ScrollArea className="h-[180px]">
              <div className="pr-4 space-y-3">
                {assignments.length > 0 ? (
                  assignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="p-3 bg-secondary/30 rounded-lg transition-all hover:bg-secondary/50"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          {assignment.title}
                          {assignment.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </h4>
                        <Badge
                          variant={
                            assignment.completed ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {assignment.completed ? "Done" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {assignment.description}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          Due:{" "}
                          {format(new Date(assignment.dueDate), "MMM d, yyyy")}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs"
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
              </div>
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
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-t-lg bg-gradient-to-br from-primary to-secondary"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl font-bold text-primary duration-300">
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
        <div className="h-[300px]">{renderContent()}</div>
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
