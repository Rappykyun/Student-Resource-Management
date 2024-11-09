import { useState } from "react";
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
} from "lucide-react";

export default function CourseCard({
  course,
  onEdit,
  onDelete,
  onViewNotes,
  onViewAssignments,
}) {
  const [progress, setProgress] = useState(0);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (now < startDate) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Upcoming
        </Badge>
      );
    } else if (now > endDate) {
      return (
        <Badge
          variant="outline"
          className="bg-secondary text-secondary-foreground"
        >
          Completed
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          In Progress
        </Badge>
      );
    }
  };

  useState(() => {
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
  }, [course.startDate, course.endDate]);

  return (
    <Card className="w-full max-w-md transition-all duration-300 group">
      <CardHeader className="pb-2 relative">
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300 rounded-t-lg"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-2xl font-bold text-primary  duration-300">
              {course.title}
            </CardTitle>
            {getStatusBadge()}
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Avatar className="w-10 h-10 border-2 border-background">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${course.professor}`}
                alt={course.professor}
              />
              <AvatarFallback>{getInitials(course.professor)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground">
              {course.professor}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Progress value={progress} className="h-1.5 mb-4" />
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
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-wrap gap-2 justify-between p-4">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewNotes(course._id)}
            className="flex-1"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Notes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewAssignments(course._id)}
            className="flex-1"
          >
            <GraduationCap className="mr-2 h-4 w-4" />
            Assignments
          </Button>
        </div>
        <div className="flex gap-2 w-full mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(course)}
            className="flex-1"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(course._id)}
            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
