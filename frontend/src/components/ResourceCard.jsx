import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Star, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:5000/api";

ResourceCard.propTypes = {
  resource: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    fileUrl: PropTypes.string.isRequired,
    submittedBy: PropTypes.shape({
      name: PropTypes.string,
      profilePicture: PropTypes.string,
    }),
    rating: PropTypes.shape({
      average: PropTypes.number,
      count: PropTypes.number,
    }),
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string,
        rating: PropTypes.number,
        comment: PropTypes.string,
      })
    ),
    createdAt: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func,
};

export default function ResourceCard({ resource, onUpdate }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userReview, setUserReview] = useState(null);

  useEffect(() => {
    // Find user's existing review
    const userId = localStorage.getItem("userId");
    const existingReview = resource.reviews?.find(
      (review) => review.user === userId
    );
    if (existingReview) {
      setUserReview(existingReview);
      setRating(existingReview.rating);
      setReviewText(existingReview.comment || "");
    }
  }, [resource.reviews]);

  // Function to ensure URL has proper protocol
  const getValidUrl = (url) => {
    try {
      new URL(url);
      return url;
    } catch {
      return url.startsWith("http") ? url : `https://${url}`;
    }
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      toast({
        title: "Error",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const endpoint = userReview
        ? `${API_BASE_URL}/resources/${resource._id}/reviews/${userReview._id}`
        : `${API_BASE_URL}/resources/${resource._id}/reviews`;

      const method = userReview ? "patch" : "post";

      await axios[method](
        endpoint,
        {
          rating,
          comment: reviewText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsReviewOpen(false);
      if (onUpdate) onUpdate();
      toast({
        title: "Success",
        description: `Review ${
          userReview ? "updated" : "submitted"
        } successfully!`,
      });
    } catch (error) {
      console.error("Error with review:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to process review",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (count, onSelect) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-5 h-5 transition-colors",
            onSelect && "cursor-pointer",
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          )}
          onClick={() => onSelect?.(i + 1)}
        />
      ));
  };

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle>{resource.title}</CardTitle>
            <div className="flex items-center gap-2">
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
          </div>
          <div className="flex items-center">
            <div className="flex items-center">
              {renderStars(Math.round(resource.rating?.average || 0))}
              <span className="ml-2 text-sm text-muted-foreground">
                ({resource.rating?.count || 0})
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
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

        <CardDescription>{resource.description}</CardDescription>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={resource.submittedBy?.profilePicture}
              alt={resource.submittedBy?.name}
            />
            <AvatarFallback>
              {resource.submittedBy?.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {resource.submittedBy?.name} •{" "}
            {format(new Date(resource.createdAt), "MMM d, yyyy")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                {userReview ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Rating
                  </>
                ) : (
                  "Rate"
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {userReview ? "Update Your Rating" : "Rate this Resource"}
                </DialogTitle>
                <DialogDescription>
                  {userReview
                    ? "Update your rating and feedback for this resource"
                    : "Share your rating and feedback for this resource"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center gap-1">
                  {renderStars(rating, setRating)}
                </div>
                <Textarea
                  placeholder="Write your review (optional)..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="h-24 resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsReviewOpen(false);
                    if (userReview) {
                      setRating(userReview.rating);
                      setReviewText(userReview.comment || "");
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={isLoading}>
                  {userReview ? "Update Rating" : "Submit Rating"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              window.open(
                getValidUrl(resource.fileUrl),
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Resource
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
