import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Image as ImageIcon,
  User,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:5000/api";

export default function AdminResourcesSection() {
  const [pendingResources, setPendingResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPendingResources();
  }, []);

  const fetchPendingResources = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/resources/admin/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingResources(response.data.data.resources);
    } catch (error) {
      console.error("Error fetching pending resources:", error);
      toast({
        title: "Error",
        description: "Failed to fetch pending resources",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (approved = true) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/resources/admin/${selectedResource._id}/approve`,
        {
          feedback,
          approved,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Success",
        description: `Resource ${approved ? "approved" : "rejected"} successfully`,
      });

      setIsDialogOpen(false);
      setSelectedResource(null);
      setFeedback("");
      fetchPendingResources();
    } catch (error) {
      console.error("Error approving resource:", error);
      toast({
        title: "Error",
        description: "Failed to process resource",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResource = (resource) => {
    setSelectedResource(resource);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pending Resources</CardTitle>
          <CardDescription>
            Review and approve submitted resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingResources.map((resource) => (
                <Card
                  key={resource._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{resource.category}</Badge>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "capitalize",
                          resource.difficulty === "beginner" &&
                            "bg-green-100 text-green-800",
                          resource.difficulty === "intermediate" &&
                            "bg-yellow-100 text-yellow-800",
                          resource.difficulty === "advanced" &&
                            "bg-red-100 text-red-800"
                        )}
                      >
                        {resource.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {resource.description}
                    </p>
                    {(resource.imageUrl || resource.thumbnailUrl) && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={resource.thumbnailUrl || resource.imageUrl}
                          alt={resource.title}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/400x300?text=No+Image";
                          }}
                        />
                      </div>
                    )}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewResource(resource)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No pending resources to review
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle>{selectedResource?.title}</DialogTitle>
            <DialogDescription>
              Review resource details and provide feedback
            </DialogDescription>
          </DialogHeader>

          {selectedResource && (
            <div className="space-y-4">
              {/* Resource Preview */}
              {(selectedResource.imageUrl || selectedResource.thumbnailUrl) && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedResource.imageUrl || selectedResource.thumbnailUrl}
                    alt={selectedResource.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/1200x630?text=No+Image";
                    }}
                  />
                </div>
              )}

              {/* Resource Details */}
              <div className="grid gap-4">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedResource.description}
                  </p>
                </div>

                {/* Topics & Prerequisites */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Topics</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedResource.topics?.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Prerequisites</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedResource.prerequisites?.map((prerequisite, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prerequisite}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submission Info & Links */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h3 className="font-medium mb-1">Submission Details</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{selectedResource.submittedBy?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {format(new Date(selectedResource.createdAt), "PPP")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Resource Links</h3>
                    <div className="space-y-1">
                      <a
                        href={selectedResource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-500 hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        View Resource
                      </a>
                      {selectedResource.imageUrl && (
                        <a
                          href={selectedResource.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-500 hover:underline"
                        >
                          <ImageIcon className="w-3 h-3" />
                          View Image
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div>
                  <h3 className="text-sm font-medium mb-1">Admin Feedback</h3>
                  <Textarea
                    placeholder="Enter feedback for the submitter..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="h-20 resize-none text-sm"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(false)}
                    disabled={isLoading}
                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(true)}
                    disabled={isLoading}
                    className="bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
