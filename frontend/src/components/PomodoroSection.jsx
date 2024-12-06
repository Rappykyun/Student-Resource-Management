import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Brain,
  Timer as TimerIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TIMER_STATES = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
};

const DEFAULT_TIMES = {
  [TIMER_STATES.POMODORO]: 25 * 60, // 25 minutes
  [TIMER_STATES.SHORT_BREAK]: 5 * 60, // 5 minutes
  [TIMER_STATES.LONG_BREAK]: 15 * 60, // 15 minutes
};

export function PomodoroSection() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMES[TIMER_STATES.POMODORO]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentState, setCurrentState] = useState(TIMER_STATES.POMODORO);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const { toast } = useToast();

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3"); // You'll need to add this sound file
    audioRef.current.volume = volume;
  }, []);

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem("pomodoroState");
    if (savedState) {
      const { timeLeft, isRunning, currentState, pomodorosCompleted, soundEnabled, volume } = JSON.parse(savedState);
      setTimeLeft(timeLeft);
      setIsRunning(isRunning);
      setCurrentState(currentState);
      setPomodorosCompleted(pomodorosCompleted);
      setSoundEnabled(soundEnabled);
      setVolume(volume);
    }
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({
        timeLeft,
        isRunning,
        currentState,
        pomodorosCompleted,
        soundEnabled,
        volume,
      })
    );
  }, [timeLeft, isRunning, currentState, pomodorosCompleted, soundEnabled, volume]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);

    if (soundEnabled && audioRef.current) {
      audioRef.current.play();
    }

    if (currentState === TIMER_STATES.POMODORO) {
      const newPomodorosCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodorosCompleted);

      if (newPomodorosCompleted % 4 === 0) {
        setCurrentState(TIMER_STATES.LONG_BREAK);
        setTimeLeft(DEFAULT_TIMES[TIMER_STATES.LONG_BREAK]);
        toast({
          title: "Time for a long break!",
          description: "Great job! Take 15 minutes to recharge.",
        });
      } else {
        setCurrentState(TIMER_STATES.SHORT_BREAK);
        setTimeLeft(DEFAULT_TIMES[TIMER_STATES.SHORT_BREAK]);
        toast({
          title: "Time for a short break!",
          description: "Good work! Take 5 minutes to refresh.",
        });
      }
    } else {
      setCurrentState(TIMER_STATES.POMODORO);
      setTimeLeft(DEFAULT_TIMES[TIMER_STATES.POMODORO]);
      toast({
        title: "Break time's over!",
        description: "Let's focus on the next task.",
      });
    }
  };

  const handleStateChange = (newState) => {
    setCurrentState(newState);
    setTimeLeft(DEFAULT_TIMES[newState]);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIMES[currentState]);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressColor = () => {
    switch (currentState) {
      case TIMER_STATES.POMODORO:
        return "bg-red-500";
      case TIMER_STATES.SHORT_BREAK:
        return "bg-green-500";
      case TIMER_STATES.LONG_BREAK:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const progress = (timeLeft / DEFAULT_TIMES[currentState]) * 100;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="relative overflow-hidden">
        <div
          className={`absolute bottom-0 left-0 h-1 transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Pomodoro Timer</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
              {soundEnabled && (
                <div className="w-24">
                  <Slider
                    value={[volume * 100]}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    max={100}
                    step={1}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <Button
              variant={currentState === TIMER_STATES.POMODORO ? "default" : "outline"}
              onClick={() => handleStateChange(TIMER_STATES.POMODORO)}
            >
              <Brain className="h-4 w-4 mr-2" />
              Focus
            </Button>
            <Button
              variant={currentState === TIMER_STATES.SHORT_BREAK ? "default" : "outline"}
              onClick={() => handleStateChange(TIMER_STATES.SHORT_BREAK)}
            >
              <Coffee className="h-4 w-4 mr-2" />
              Short Break
            </Button>
            <Button
              variant={currentState === TIMER_STATES.LONG_BREAK ? "default" : "outline"}
              onClick={() => handleStateChange(TIMER_STATES.LONG_BREAK)}
            >
              <TimerIcon className="h-4 w-4 mr-2" />
              Long Break
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-6xl font-mono font-bold tracking-wider">
              {formatTime(timeLeft)}
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                variant={isRunning ? "destructive" : "default"}
              >
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button variant="outline" size="icon" onClick={resetTimer}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-sm">
              Pomodoros Completed: {pomodorosCompleted}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 