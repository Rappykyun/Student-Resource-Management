import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Loader, Star } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "DevOps",
  "Design",
  "Data Structures",
  "Algorithms",
  "System Design",
  "Database",
  "Security",
  "Machine Learning",
  "Cloud Computing",
  "Other",
];

const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const ResourcesSection = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // Changed from empty string
  const [selectedDifficulty, setSelectedDifficulty] = useState("all"); // Changed from empty string
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    topics: "",
    fileUrl: "",
    prerequisites: "",
    learningOutcomes: "",
    tags: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newResource.category || !newResource.difficulty) {
      toast({
        title: "Error",
        description: "Please select a category and difficulty level",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Format the resource data
      const formattedResource = {
        ...newResource,
        topics: newResource.topics
          .split(",")
          .map((topic) => topic.trim())
          .filter(Boolean),
        prerequisites: newResource.prerequisites
          .split(",")
          .map((prereq) => prereq.trim())
          .filter(Boolean),
        learningOutcomes: newResource.learningOutcomes
          .split(",")
          .map((outcome) => outcome.trim())
          .filter(Boolean),
        tags: newResource.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        // Ensure these match exactly what the backend expects
        difficulty: newResource.difficulty.toLowerCase(),
        category: newResource.category.toLowerCase(),
        approved: false, // Set initial approval status
      };

      // Make the API request
      const response = await axios.post(
        `${API_BASE_URL}/resources`,
        formattedResource,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === "success") {
        setIsSubmitDialogOpen(false);
        setNewResource({
          title: "",
          description: "",
          category: "",
          difficulty: "",
          topics: "",
          fileUrl: "",
          prerequisites: "",
          learningOutcomes: "",
          tags: "",
        });

        toast({
          title: "Success",
          description: "Resource submitted successfully and pending approval",
        });

        fetchResources();
      } else {
        throw new Error(response.data.message || "Failed to submit resource");
      }
    } catch (error) {
      console.error("Error submitting resource:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to submit resource. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      let endpoint = `${API_BASE_URL}/resources`;

      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (selectedDifficulty !== "all")
        params.append("difficulty", selectedDifficulty);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${endpoint}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.data?.resources) {
        setResources(response.data.data.resources);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Error",
        description: "Failed to fetch resources. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold">Resource Library</h2>
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button>Submit Resource</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submit a New Resource</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <Input
                  placeholder="Title"
                  value={newResource.title}
                  onChange={(e) =>
                    setNewResource({ ...newResource, title: e.target.value })
                  }
                  required
                />

                <Textarea
                  placeholder="Description"
                  value={newResource.description}
                  onChange={(e) =>
                    setNewResource({
                      ...newResource,
                      description: e.target.value,
                    })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={newResource.category}
                    onValueChange={(value) =>
                      setNewResource({ ...newResource, category: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem
                          key={category}
                          value={category.toLowerCase()}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={newResource.difficulty}
                    onValueChange={(value) =>
                      setNewResource({ ...newResource, difficulty: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase()}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Input
                  placeholder="Topics (comma-separated)"
                  value={newResource.topics}
                  onChange={(e) =>
                    setNewResource({ ...newResource, topics: e.target.value })
                  }
                  required
                />

                <Input
                  placeholder="Prerequisites (comma-separated)"
                  value={newResource.prerequisites}
                  onChange={(e) =>
                    setNewResource({
                      ...newResource,
                      prerequisites: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="Learning Outcomes (comma-separated)"
                  value={newResource.learningOutcomes}
                  onChange={(e) =>
                    setNewResource({
                      ...newResource,
                      learningOutcomes: e.target.value,
                    })
                  }
                  required
                />

                <Input
                  placeholder="File URL"
                  value={newResource.fileUrl}
                  onChange={(e) =>
                    setNewResource({ ...newResource, fileUrl: e.target.value })
                  }
                  required
                />

                <Input
                  placeholder="Tags (comma-separated)"
                  value={newResource.tags}
                  onChange={(e) =>
                    setNewResource({ ...newResource, tags: e.target.value })
                  }
                />
              </div>
              <DialogFooter>
                <Button type="submit">Submit Resource</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category.toLowerCase()}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedDifficulty}
          onValueChange={setSelectedDifficulty}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {DIFFICULTY_LEVELS.map((level) => (
              <SelectItem key={level} value={level.toLowerCase()}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={fetchResources}>Search</Button>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader className="h-6 w-6 animate-spin" />
          </div>
        ) : resources.length > 0 ? (
          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {resource.title}
                      </CardTitle>
                      <CardDescription>
                        {resource.category} • {resource.views || 0} views
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        resource.difficulty === "beginner"
                          ? "default"
                          : resource.difficulty === "intermediate"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {resource.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                  <div className="mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{(resource.rating || 0).toFixed(1)}</span>
                      <span>({resource.reviews?.length || 0} reviews)</span>
                    </div>
                  </div>
                  {resource.topics?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {resource.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {resource.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    By {resource.submittedBy?.name || "Anonymous"}
                  </div>
                  <Button asChild>
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resource
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            No resources found
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ResourcesSection;
