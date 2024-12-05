"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, GraduationCap, BookOpen, Clock, Trash } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

CourseForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    professor: PropTypes.string,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    schedule: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    milestones: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        dueDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
        completed: PropTypes.bool,
      })
    ),
  }),
};

export default function CourseForm({ onSubmit, initialData = {} }) {
  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      professor: initialData?.professor || "",
      startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
      schedule: initialData?.schedule || "",
      category: initialData?.category || "",
      tags: initialData?.tags?.join(", ") || "",
    },
  });

  const [milestones, setMilestones] = useState(initialData?.milestones || []);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: undefined,
  });

  const handleAddMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      setMilestones([...milestones, { ...newMilestone, completed: false }]);
      setNewMilestone({ title: "", description: "", dueDate: undefined });
    }
  };

  const handleRemoveMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const onSubmitWithMilestones = (data) => {
    const formattedData = {
      ...data,
      tags: data.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      milestones,
    };
    onSubmit(formattedData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {initialData?.id ? "Edit Course" : "Add New Course"}
        </CardTitle>
        <CardDescription>
          Fill in the details below to {initialData?.id ? "update the" : "create a new"} course.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitWithMilestones)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Course title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary/70" />
                          Course Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter course title"
                            className="transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Professor Field */}
                  <FormField
                    control={form.control}
                    name="professor"
                    rules={{ required: "Professor name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary/70" />
                          Professor
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter professor's name"
                            className="transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter course description"
                          className="min-h-[100px] resize-none transition-all duration-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Start Date Field */}
                  <FormField
                    control={form.control}
                    name="startDate"
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01") ||
                                (form.getValues("endDate") &&
                                  date > form.getValues("endDate"))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* End Date Field */}
                  <FormField
                    control={form.control}
                    name="endDate"
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01") ||
                                (form.getValues("startDate") &&
                                  date < form.getValues("startDate"))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Schedule Field */}
                  <FormField
                    control={form.control}
                    name="schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary/70" />
                          Schedule
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Mon/Wed 2:00 PM - 3:30 PM"
                            className="transition-all duration-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Field */}
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
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="programming">Programming</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="science">Science</SelectItem>
                            <SelectItem value="languages">Languages</SelectItem>
                            <SelectItem value="business">Business</SelectItem>
                            <SelectItem value="arts">Arts</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tags Field */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter tags separated by commas (e.g., beginner, web development, javascript)"
                          className="transition-all duration-300"
                        />
                      </FormControl>
                      <FormDescription>
                        Add relevant tags separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="milestones" className="mt-4">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Milestone title"
                        value={newMilestone.title}
                        onChange={(e) =>
                          setNewMilestone({ ...newMilestone, title: e.target.value })
                        }
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !newMilestone.dueDate && "text-muted-foreground"
                            )}
                          >
                            {newMilestone.dueDate ? (
                              format(newMilestone.dueDate, "PPP")
                            ) : (
                              <span>Pick a due date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={newMilestone.dueDate}
                            onSelect={(date) =>
                              setNewMilestone({ ...newMilestone, dueDate: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Textarea
                      placeholder="Milestone description"
                      value={newMilestone.description}
                      onChange={(e) =>
                        setNewMilestone({
                          ...newMilestone,
                          description: e.target.value,
                        })
                      }
                      className="resize-none h-20"
                    />
                    <Button
                      type="button"
                      onClick={handleAddMilestone}
                      className="w-full"
                      disabled={!newMilestone.title || !newMilestone.dueDate}
                    >
                      Add Milestone
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3">Added Milestones</h4>
                    <ScrollArea className="h-[200px]">
                      <div className="space-y-4">
                        {milestones.length > 0 ? (
                          milestones.map((milestone, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-between space-x-4 p-3 bg-secondary/20 rounded-lg"
                            >
                              <div className="space-y-1">
                                <p className="font-medium">{milestone.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {milestone.description}
                                </p>
                                <p className="text-sm text-primary">
                                  Due: {format(new Date(milestone.dueDate), "PPP")}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveMilestone(index)}
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))
                        ) : (
                          <p className="text-center text-muted-foreground py-8">
                            No milestones added yet
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="submit" className="min-w-[120px]">
                {initialData?.id ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
