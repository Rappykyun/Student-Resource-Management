import { useState, useEffect } from "react";
import axios from "axios";
import { Bot } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_BASE_URL = "http://localhost:5000/api";

const DashboardSection = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to fetch dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const { courses, tasks, studySessions } = dashboardData || {};

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Course Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Course Progress
              <Badge variant="secondary">{courses?.length || 0} Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {courses?.slice(0, 3).map((course, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{course.name}</span>
                  <span className="text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {tasks?.map((task, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center mb-4"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.course}
                    </p>
                  </div>
                  <Badge variant="outline">{task.due}</Badge>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Study Sessions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Todays Schedule</CardTitle>
            <CardDescription>Your study sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {studySessions?.map((session, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{session.subject}</p>
                    <Badge>{session.time}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.topic}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant Card */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            AI Study Assistant
          </CardTitle>
          <CardDescription>Get help with your studies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary p-4 rounded-lg flex items-center justify-between">
            <p className="text-secondary-foreground">
              Ask me anything about your courses or study material!
            </p>
            <Button>Start Chat</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardSection;
