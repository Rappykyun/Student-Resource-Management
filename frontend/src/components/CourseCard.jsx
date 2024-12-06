import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Edit,
  GraduationCap,
  Trash,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:5000/api";

CourseCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    professor: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    schedule: PropTypes.string,
    category: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    milestones: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        dueDate: PropTypes.string,
        completed: PropTypes.bool,
      })
    ),
    progress: PropTypes.shape({
      completedMilestones: PropTypes.number,
      totalMilestones: PropTypes.number,
      lastStudySession: PropTypes.string,
      totalStudyTime: PropTypes.number,
    }),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function CourseCard({ course, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isStudying, setIsStudying] = useState(false);
  const [studyTime, setStudyTime] = useState(0);
  const [timerDuration] = useState(25 * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isStudying) {
      timerRef.current = setInterval(() => {
        setStudyTime((prev) => {
          if (prev + 1 >= timerDuration) {
            handleStopTimer();
            toast({
              title: "Study Session Complete!",
              description: "Take a break and come back refreshed.",
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isStudying, timerDuration]);

  const handleStartTimer = () => {
    setIsStudying(true);
  };

  const handleStopTimer = async () => {
    setIsStudying(false);
    clearInterval(timerRef.current);
    
    if (studyTime > 0) {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${API_BASE_URL}/courses/${course._id}/study-sessions`,
          {
            duration: Math.floor(studyTime / 60),
            topic: activeTab,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast({
          title: "Study Session Saved",
          description: `Added ${Math.floor(studyTime / 60)} minutes to your study time.`,
        });
      } catch (error) {
        console.error("Error saving study session:", error);
        toast({
          title: "Error",
          description: "Failed to save study session.",
          variant: "destructive",
        });
      }
    }
    
    setStudyTime(0);
  };

  const handleResetTimer = () => {
    setStudyTime(0);
    setIsStudying(false);
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculateProgress = () => {
    let totalScore = 0;
    let maxScore = 0;

    // Calculate milestone progress (60% weight)
    if (course.milestones?.length) {
      const milestoneProgress = (course.milestones.filter(m => m.completed).length / course.milestones.length) * 100;
      totalScore += milestoneProgress * 0.6;
      maxScore += 60;
    }

    // Calculate study time progress (40% weight)
    const totalStudyTime = course.progress?.totalStudyTime || 0;
    const targetStudyTime = 3000; // Target: 50 hours (3000 minutes)
    if (totalStudyTime > 0) {
      const studyProgress = Math.min((totalStudyTime / targetStudyTime) * 100, 100);
      totalScore += studyProgress * 0.4;
      maxScore += 40;
    }

    // Return overall progress
    return maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  };

  const toggleMilestone = async (milestoneId, completed) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/courses/${course._id}/milestones/${milestoneId}`,
        { completed },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast({
        title: "Success",
        description: `Milestone marked as ${completed ? "completed" : "incomplete"}.`,
      });
    } catch (error) {
      console.error("Error updating milestone:", error);
      toast({
        title: "Error",
        description: "Failed to update milestone.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold">{course.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span>{course.professor}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(course)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(course._id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {course.category && (
            <Badge variant="secondary">{course.category}</Badge>
          )}
          {course.tags?.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 gap-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="study">Study</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {format(new Date(course.startDate), "PPP")} -{" "}
                  {format(new Date(course.endDate), "PPP")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm">{course.schedule}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {course.description}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(calculateProgress())}%
                </span>
              </div>
              <Progress value={calculateProgress()} />
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Milestones</p>
                  <p className="font-medium">
                    {course.milestones?.filter(m => m.completed).length || 0}/{course.milestones?.length || 0} Completed
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Study Time</p>
                  <p className="font-medium">
                    {Math.floor(course.progress?.totalStudyTime || 0)} minutes
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <ScrollArea className="h-[200px]">
              <div className="space-y-4">
                {course.milestones?.map((milestone) => (
                  <div
                    key={milestone._id}
                    className="flex items-start gap-4 p-3 bg-secondary/20 rounded-lg"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleMilestone(milestone._id, !milestone.completed)}
                    >
                      <CheckCircle2
                        className={cn("h-5 w-5", milestone.completed ? "text-primary" : "text-muted-foreground")}
                      />
                    </Button>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {milestone.description}
                      </p>
                      <p className="text-sm text-primary">
                        Due: {format(new Date(milestone.dueDate), "PPP")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="study" className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-4xl font-bold font-mono">
                {formatTime(studyTime)}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={isStudying ? "destructive" : "default"}
                  onClick={isStudying ? handleStopTimer : handleStartTimer}
                >
                  {isStudying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleResetTimer}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Total Study Time</span>
                  <span>{Math.floor(course.progress?.totalStudyTime || 0)} minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last Session</span>
                  <span>
                    {course.progress?.lastStudySession
                      ? format(new Date(course.progress.lastStudySession), "PPP")
                      : "No sessions yet"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
