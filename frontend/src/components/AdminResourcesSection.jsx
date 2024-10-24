import { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000/api";

const AdminResourcesSection = () => {
  const [pendingResources, setPendingResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedResource, setSelectedResource] = useState(null);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

  useEffect(() => {
    fetchPendingResources();
  }, []);

  const fetchPendingResources = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/resources/admin/pending`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPendingResources(response.data.data.resources);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/resources/admin/${id}/approve`,
        { feedback },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPendingResources();
      setSelectedResource(null);
      setFeedback("");
      setIsFeedbackDialogOpen(false);
      toast({
        title: "Success",
        description: "Resource approved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve resource",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id) => {
    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please provide feedback for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/resources/admin/${id}/reject`,
        { feedback },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchPendingResources();
      setSelectedResource(null);
      setFeedback("");
      setIsFeedbackDialogOpen(false);
      toast({
        title: "Success",
        description: "Resource rejected successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject resource",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Pending Resources</h2>
        <Badge variant="secondary" className="text-lg">
          {pendingResources.length} Pending
        </Badge>
      </div>

      <ScrollArea className="h-[600px] rounded-md border">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingResources.map((resource) => (
              <Card key={resource._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {resource.title}
                      </CardTitle>
                      <CardDescription>{resource.category}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        resource.difficulty === "Beginner"
                          ? "default"
                          : resource.difficulty === "Intermediate"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {resource.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {resource.description}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm font-medium">Topics:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {resource.topics?.map((topic, index) => (
                        <Badge key={index} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Submitted by: {resource.submittedBy?.name || "Anonymous"}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2 justify-end">
                  <Dialog
                    open={
                      isPreviewDialogOpen &&
                      selectedResource?._id === resource._id
                    }
                    onOpenChange={(open) => {
                      setIsPreviewDialogOpen(open);
                      if (!open) setSelectedResource(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedResource(resource)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Resource Preview</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Description</h3>
                          <p className="mt-1 text-sm">{resource.description}</p>
                        </div>
                        <div>
                          <h3 className="font-medium">Prerequisites</h3>
                          <ul className="mt-1 list-disc list-inside text-sm">
                            {resource.prerequisites?.map((prereq, index) => (
                              <li key={index}>{prereq}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium">Learning Outcomes</h3>
                          <ul className="mt-1 list-disc list-inside text-sm">
                            {resource.learningOutcomes?.map(
                              (outcome, index) => (
                                <li key={index}>{outcome}</li>
                              )
                            )}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-medium">Resource URL</h3>
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {resource.fileUrl}
                          </a>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog
                    open={
                      isFeedbackDialogOpen &&
                      selectedResource?._id === resource._id
                    }
                    onOpenChange={(open) => {
                      setIsFeedbackDialogOpen(open);
                      if (!open) {
                        setSelectedResource(null);
                        setFeedback("");
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedResource(resource)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Feedback
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Provide Feedback</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Enter feedback for the submitter..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="min-h-[100px]"
                        />
                      </div>
                      <DialogFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleReject(resource._id)}
                          className="flex items-center"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleApprove(resource._id)}
                          className="flex items-center"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default AdminResourcesSection;
