"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useForm, FormProvider } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, Plus, Trash2, Edit2, Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

export function StudySessionSection() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filter, setFilter] = useState({
    startDate: null,
    endDate: null,
    category: "",
  });
  const [studyStats, setStudyStats] = useState({
    totalHours: 0,
    completionRate: 0,
    categoryBreak: {

    }
  })

  const { toast } = useToast();

  const filterForm = useForm({
    defaultValues: {
      filterStartDate: "",
      filterEndDate: "",
      filterCategory: "",
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      category: "",
      startTime: "",
      endTime: "",
      description: "",
      recurring: {
        enabled: false,
        frequency: "",
        endDate: "",
      },
      reminder: {
        enabled: false,
        time: 30,
      },
    },
  });

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filter.startDate) params.append("startDate", filter.startDate);
      if (filter.endDate) params.append("endDate", filter.endDate);
      if (filter.category) params.append("category", filter.category);

      const response = await axios.get(
        `${API_BASE_URL}/studySessions?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSessions(response.data.data.sessions);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch study sessions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.patch(
          `${API_BASE_URL}/studySessions/${selectedSession._id}`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast({
          title: "Success",
          description: "Study session updated successfully",
        });
      } else {
        await axios.post(`${API_BASE_URL}/studySessions`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast({
          title: "Success",
          description: "Study session created successfully",
        });
      }
      fetchSessions();
      setIsCreating(false);
      setIsEditing(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Operation failed",
        variant: "destructive",
      });
    }
  };

  const updateProgress = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/studySessions/${id}/progress`,
        {
          status,
          duration:
            status === "completed"
              ? calculateDuration(sessions.find((s) => s._id === id))
              : null,
          notes: form.getValues("progressNotes"),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSessions();
      toast({
        title: "Success",
        description: "Progress updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  };

  const deleteSession = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/studySessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSessions();
      toast({
        title: "Success",
        description: "Study session deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const calculateDuration = (session) => {
    if (!session) return 0;
    return Math.round(
      (new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60)
    );
  };

  const handleOpenCreateDialog = () => {
    form.reset();
    setIsCreating(true);
  };

  const handleOpenEditDialog = (session) => {
    form.reset({
      title: session.title,
      category: session.category,
      startTime: format(new Date(session.startTime), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(session.endTime), "yyyy-MM-dd'T'HH:mm"),
      description: session.description,
      recurring: {
        enabled: session.recurring?.enabled || false,
        frequency: session.recurring?.frequency || "",
        endDate: session.recurring?.endDate || "",
      },
      reminder: {
        enabled: session.reminder?.enabled || false,
        time: session.reminder?.time || 30,
      },
    });
    setSelectedSession(session);
    setIsEditing(true);
    setIsCreating(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Study Sessions</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Study Session" : "Create Study Session"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Session title" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="exam_prep">
                            Exam Preparation
                          </SelectItem>
                          <SelectItem value="homework">Homework</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Session description"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {isEditing ? "Update Session" : "Create Session"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <FormProvider {...filterForm}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            control={filterForm.control}
            name="filterStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFilter({ ...filter, startDate: e.target.value });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={filterForm.control}
            name="filterEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setFilter({ ...filter, endDate: e.target.value });
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={filterForm.control}
            name="filterCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) =>
                    setFilter({
                      ...filter,
                      category: value === "all" ? "" : value,
                    })
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="exam_prep">Exam Preparation</SelectItem>
                    <SelectItem value="homework">Homework</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="practice">Practice</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            onClick={() => {
              setFilter({ startDate: null, endDate: null, category: "" });
              filterForm.reset();
            }}
          >
            Clear Filters
          </Button>
        </div>
      </FormProvider>

      <ScrollArea className="h-[600px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <Card key={session._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{session.title}</CardTitle>
                    <Badge variant="outline">{session.category}</Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(session.startTime), "PPp")}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Duration: {calculateDuration(session)} minutes
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary">
                      Status: {session.progress.status}
                    </Badge>
                    {session.recurring?.enabled && (
                      <Badge variant="outline">
                        Recurring: {session.recurring.frequency}
                      </Badge>
                    )}
                    {session.reminder?.enabled && (
                      <Badge variant="outline">
                        Reminder: {session.reminder.time}min before
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Update Progress
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Session Progress</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Select
                          onValueChange={(value) =>
                            updateProgress(session._id, value)
                          }
                          defaultValue={session.progress.status}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not_started">
                              Not Started
                            </SelectItem>
                            <SelectItem value="in_progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="missed">Missed</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormField
                          control={form.control}
                          name="progressNotes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Progress Notes</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Add notes about your progress..."
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditDialog(session)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Session</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this study session?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSession(session._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      {sessions.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No study sessions found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsCreating(true)}
          >
            Create your first session
          </Button>
        </div>
      )}
    </div>
  );
}
