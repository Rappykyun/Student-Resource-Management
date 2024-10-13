import React from "react";
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
import {
  CalendarIcon,
  BookOpenIcon,
  GraduationCapIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
} from "lucide-react";
import { format } from "date-fns";

const CourseCard = ({
  course,
  onEdit,
  onDelete,
  onViewNotes,
  onViewAssignments,
}) => {
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
      return <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>;
    } else if (now > endDate) {
      return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">In Progress</Badge>;
    }
  };

  const getProgressBar = () => {
    const now = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const totalDuration = endDate - startDate;
    const elapsed = now - startDate;
    const progress = Math.min(
      Math.max((elapsed / totalDuration) * 100, 0),
      100
    );

    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-all duration-300 bg-white">
      <CardHeader className="pb-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {course.title}
            </CardTitle>
            {getStatusBadge()}
          </div>
          <div className="flex items-center space-x-2">
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${course.professor}`}
              />
              <AvatarFallback>{getInitials(course.professor)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700">
              {course.professor}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {getProgressBar()}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
            <span>
              {format(new Date(course.startDate), "MMM d, yyyy")} -{" "}
              {format(new Date(course.endDate), "MMM d, yyyy")}
            </span>
          </div>
          {course.schedule && (
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-4 w-4 text-blue-500" />
              <span>{course.schedule}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between bg-gray-50 rounded-b-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewNotes(course._id)}
          className="flex-1 bg-white hover:bg-blue-50 text-blue-600 border-blue-200"
        >
          <BookOpenIcon className="mr-2 h-4 w-4" /> Notes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewAssignments(course._id)}
          className="flex-1 bg-white hover:bg-purple-50 text-purple-600 border-purple-200"
        >
          <GraduationCapIcon className="mr-2 h-4 w-4" /> Assignments
        </Button>
        <div className="flex gap-2 mt-2 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(course)}
            className="flex-1"
          >
            <EditIcon className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(course._id)}
            className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <TrashIcon className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
