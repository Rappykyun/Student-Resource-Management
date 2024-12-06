import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader,
  GraduationCap,
  Clock,
  Trophy,
  Target,
  BarChart,
  Brain,
  CheckCircle,
  Timer,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const DashboardSection = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyStats, setStudyStats] = useState({
    weeklyStudyTime: 0,
    monthlyStudyTime: 0,
    averageSessionLength: 0,
    totalSessions: 0,
    completionRate: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/dashboard/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data.data);
      
      // Calculate study statistics
      if (response.data.data.studySessions) {
        const sessions = response.data.data.studySessions;
        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        const weeklyTime = sessions
          .filter(s => new Date(s.startTime) > oneWeekAgo)
          .reduce((acc, s) => acc + (s.duration || 0), 0);

        const monthlyTime = sessions
          .filter(s => new Date(s.startTime) > oneMonthAgo)
          .reduce((acc, s) => acc + (s.duration || 0), 0);

        const completedSessions = sessions.filter(s => s.progress?.status === 'completed').length;

        setStudyStats({
          weeklyStudyTime: weeklyTime,
          monthlyStudyTime: monthlyTime,
          averageSessionLength: sessions.length ? monthlyTime / sessions.length : 0,
          totalSessions: sessions.length,
          completionRate: sessions.length ? (completedSessions / sessions.length) * 100 : 0,
        });
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const { courses = [], studySessions = [] } = dashboardData || {};

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!courses.length) return 0;
    return courses.reduce((acc, course) => {
      const progress = course.progress || {};
      return acc + (progress.completedMilestones || 0) / (progress.totalMilestones || 1);
    }, 0) / courses.length * 100;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
        <p className="text-muted-foreground">
          Here's an overview of your academic progress.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <GraduationCap className="h-4 w-4 inline-block mr-2" />
              Active Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{courses.length}</div>
            <p className="text-blue-100 text-sm">Enrolled & In Progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <Target className="h-4 w-4 inline-block mr-2" />
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(studyStats.completionRate)}%
            </div>
            <p className="text-green-100 text-sm">Study Sessions Completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <Clock className="h-4 w-4 inline-block mr-2" />
              Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(studyStats.weeklyStudyTime)} min</div>
            <p className="text-purple-100 text-sm">This Week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              <Trophy className="h-4 w-4 inline-block mr-2" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{studyStats.totalSessions}</div>
            <p className="text-orange-100 text-sm">Study Sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Progress Card */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Overall Progress
              <Badge variant="secondary" className="ml-2">
                {Math.round(calculateOverallProgress())}% Complete
              </Badge>
            </CardTitle>
            <CardDescription>Your academic journey progress</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={calculateOverallProgress()} className="h-2" />
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {courses.length}
                </div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {studyStats.totalSessions}
                </div>
                <p className="text-sm text-muted-foreground">Study Sessions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(studyStats.monthlyStudyTime)} min
                </div>
                <p className="text-sm text-muted-foreground">Monthly Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Course Progress
              <Badge variant="secondary">{courses.length} Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {courses.map((course, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{course.title}</span>
                    <span className="text-muted-foreground">
                      {Math.round(
                        ((course.progress?.completedMilestones || 0) /
                          (course.progress?.totalMilestones || 1)) *
                          100
                      )}%
                    </span>
                  </div>
                  <Progress
                    value={
                      ((course.progress?.completedMilestones || 0) /
                        (course.progress?.totalMilestones || 1)) *
                      100
                    }
                    className="h-2"
                  />
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Study Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Study Statistics</CardTitle>
            <CardDescription>Your learning analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm">Average Session</span>
                </div>
                <span className="font-medium">
                  {Math.round(studyStats.averageSessionLength)} min
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Completion Rate</span>
                </div>
                <span className="font-medium">
                  {Math.round(studyStats.completionRate)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 text-purple-500 mr-2" />
                  <span className="text-sm">Weekly Time</span>
                </div>
                <span className="font-medium">{studyStats.weeklyStudyTime} min</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-sm">Monthly Time</span>
                </div>
                <span className="font-medium">{studyStats.monthlyStudyTime} min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
