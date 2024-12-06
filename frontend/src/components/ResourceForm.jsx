import { useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Image, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ResourceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default function ResourceForm({ onSubmit, initialData = {} }) {
  const [topics, setTopics] = useState(initialData.topics || []);
  const [newTopic, setNewTopic] = useState("");
  const [prerequisites, setPrerequisites] = useState(initialData.prerequisites || []);
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [learningOutcomes, setLearningOutcomes] = useState(initialData.learningOutcomes || []);
  const [newOutcome, setNewOutcome] = useState("");

  const form = useForm({
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      category: initialData.category || "",
      difficulty: initialData.difficulty || "",
      fileUrl: initialData.fileUrl || "",
      imageUrl: initialData.imageUrl || "",
      thumbnailUrl: initialData.thumbnailUrl || "",
      tags: initialData.tags?.join(", ") || "",
    },
  });

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      setTopics([...topics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setPrerequisites([...prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite("");
    }
  };

  const handleRemovePrerequisite = (index) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
      setNewOutcome("");
    }
  };

  const handleRemoveOutcome = (index) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleSubmit = (data) => {
    const formattedData = {
      ...data,
      topics,
      prerequisites,
      learningOutcomes,
      tags: data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };
    onSubmit(formattedData);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData._id ? "Edit Resource" : "Add New Resource"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="content">Content & URLs</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter resource title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category Field */}
                  <FormField
                    control={form.control}
                    name="category"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="frontend">Frontend</SelectItem>
                            <SelectItem value="backend">Backend</SelectItem>
                            <SelectItem value="devOps">DevOps</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="data Structures">Data Structures</SelectItem>
                            <SelectItem value="algorithms">Algorithms</SelectItem>
                            <SelectItem value="system Design">System Design</SelectItem>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="machine Learning">Machine Learning</SelectItem>
                            <SelectItem value="cloud Computing">Cloud Computing</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter resource description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Difficulty Field */}
                <FormField
                  control={form.control}
                  name="difficulty"
                  rules={{ required: "Difficulty level is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags Field */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags separated by commas"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Add relevant tags separated by commas (e.g., javascript, react, web)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="content" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {/* Resource File URL */}
                  <FormField
                    control={form.control}
                    name="fileUrl"
                    rules={{ required: "Resource file URL is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Resource File URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the URL of your resource file" {...field} />
                        </FormControl>
                        <FormDescription>
                          Direct link to your downloadable resource (PDF, ZIP, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Preview Image URL */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Preview Image URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the URL of your preview image" {...field} />
                        </FormControl>
                        <FormDescription>
                          A full-size preview image of your resource (recommended size: 1200x630px)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Thumbnail URL */}
                  <FormField
                    control={form.control}
                    name="thumbnailUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          Thumbnail URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the URL of your thumbnail image" {...field} />
                        </FormControl>
                        <FormDescription>
                          A smaller thumbnail image for cards (recommended size: 400x300px)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image Preview */}
                  {(form.watch("imageUrl") || form.watch("thumbnailUrl")) && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Image Preview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {form.watch("imageUrl") && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Preview Image:</p>
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                              <img
                                src={form.watch("imageUrl")}
                                alt="Preview"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.src = "https://placehold.co/1200x630?text=Invalid+Image+URL";
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {form.watch("thumbnailUrl") && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Thumbnail:</p>
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                              <img
                                src={form.watch("thumbnailUrl")}
                                alt="Thumbnail"
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.src = "https://placehold.co/400x300?text=Invalid+Image+URL";
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-4">
                {/* Topics Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Topics</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a topic"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
                    />
                    <Button type="button" onClick={handleAddTopic}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {topic}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveTopic(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prerequisites Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Prerequisites</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a prerequisite"
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddPrerequisite()}
                    />
                    <Button type="button" onClick={handleAddPrerequisite}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {prerequisites.map((prerequisite, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {prerequisite}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemovePrerequisite(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Learning Outcomes</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a learning outcome"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddOutcome()}
                    />
                    <Button type="button" onClick={handleAddOutcome}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {learningOutcomes.map((outcome, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {outcome}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveOutcome(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" className="min-w-[200px]">
                {initialData._id ? "Update Resource" : "Submit Resource"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
