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

const TIMER_STATES = {
  POMODORO: "pomodoro",
  SHORT_BREAK: "shortBreak",
  LONG_BREAK: "longBreak",
};

const DEFAULT_TIMES = {
  [TIMER_STATES.POMODORO]: 25 * 60,
  [TIMER_STATES.SHORT_BREAK]: 5 * 60,
  [TIMER_STATES.LONG_BREAK]: 15 * 60,
};

// Global timer states
const globalTimers = {
  [TIMER_STATES.POMODORO]: {
    interval: null,
    startTime: 0,
    timeLeft: DEFAULT_TIMES[TIMER_STATES.POMODORO],
    isRunning: false,
  },
  [TIMER_STATES.SHORT_BREAK]: {
    interval: null,
    startTime: 0,
    timeLeft: DEFAULT_TIMES[TIMER_STATES.SHORT_BREAK],
    isRunning: false,
  },
  [TIMER_STATES.LONG_BREAK]: {
    interval: null,
    startTime: 0,
    timeLeft: DEFAULT_TIMES[TIMER_STATES.LONG_BREAK],
    isRunning: false,
  },
};

let globalPomodorosCompleted = 0;

export function PomodoroSection() {
  const [timers, setTimers] = useState(globalTimers);
  const [currentState, setCurrentState] = useState(TIMER_STATES.POMODORO);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(globalPomodorosCompleted);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  
  const audioRef = useRef(null);
  const { toast } = useToast();

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = volume;

    const savedState = localStorage.getItem("pomodoroState");
    if (savedState) {
      const { soundEnabled: savedSoundEnabled, volume: savedVolume } = JSON.parse(savedState);
      setSoundEnabled(savedSoundEnabled);
      setVolume(savedVolume);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Save sound preferences
  useEffect(() => {
    localStorage.setItem(
      "pomodoroState",
      JSON.stringify({
        soundEnabled,
        volume,
      })
    );
  }, [soundEnabled, volume]);

  // Update global timers and maintain running timers
  useEffect(() => {
    Object.keys(timers).forEach((timerState) => {
      const timer = timers[timerState];
      if (timer.isRunning && !timer.interval) {
        startTimer(timerState);
      }
    });

    // Sync interval
    const syncInterval = setInterval(() => {
      setTimers((currentTimers) => {
        const newTimers = { ...currentTimers };
        Object.keys(newTimers).forEach((timerState) => {
          if (globalTimers[timerState].isRunning) {
            newTimers[timerState] = { ...globalTimers[timerState] };
          }
        });
        return newTimers;
      });
    }, 100);

    return () => clearInterval(syncInterval);
  }, []);

  const startTimer = (timerState) => {
    const timer = globalTimers[timerState];
    if (!timer.startTime) {
      timer.startTime = Date.now() - ((DEFAULT_TIMES[timerState] - timer.timeLeft) * 1000);
    }

    if (timer.interval) {
      clearInterval(timer.interval);
    }

    timer.interval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - timer.startTime) / 1000);
      const newTimeLeft = DEFAULT_TIMES[timerState] - elapsedTime;
      
      if (newTimeLeft <= 0) {
        handleTimerComplete(timerState);
      } else {
        timer.timeLeft = newTimeLeft;
        globalTimers[timerState] = { ...timer };
        
        setTimers((current) => ({
          ...current,
          [timerState]: { ...timer }
        }));
      }
    }, 1000);
  };

  const handleTimerComplete = (timerState) => {
    const timer = globalTimers[timerState];
    clearInterval(timer.interval);
    timer.interval = null;
    timer.isRunning = false;
    timer.startTime = 0;
    timer.timeLeft = DEFAULT_TIMES[timerState];

    setTimers((current) => ({
      ...current,
      [timerState]: { ...timer }
    }));

    if (soundEnabled && audioRef.current) {
      audioRef.current.play();
    }

    if (timerState === TIMER_STATES.POMODORO) {
      const newPomodorosCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodorosCompleted);
      globalPomodorosCompleted = newPomodorosCompleted;

      toast({
        title: "Focus session complete!",
        description: newPomodorosCompleted % 4 === 0 
          ? "Time for a long break!" 
          : "Time for a short break!",
      });
    } else {
      toast({
        title: "Break time's over!",
        description: "Ready for another focus session?",
      });
    }
  };

  const handleStateChange = (newState) => {
    setCurrentState(newState);
  };

  const toggleTimer = () => {
    const timer = globalTimers[currentState];
    const newIsRunning = !timer.isRunning;
    
    timer.isRunning = newIsRunning;
    if (newIsRunning) {
      startTimer(currentState);
    } else {
      clearInterval(timer.interval);
      timer.interval = null;
    }

    setTimers((current) => ({
      ...current,
      [currentState]: { ...timer }
    }));
  };

  const resetTimer = () => {
    const timer = globalTimers[currentState];
    clearInterval(timer.interval);
    timer.interval = null;
    timer.isRunning = false;
    timer.startTime = 0;
    timer.timeLeft = DEFAULT_TIMES[currentState];
    
    setTimers((current) => ({
      ...current,
      [currentState]: { ...timer }
    }));
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

  const currentTimer = timers[currentState];
  const progress = (currentTimer.timeLeft / DEFAULT_TIMES[currentState]) * 100;

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
              Focus {timers[TIMER_STATES.POMODORO].isRunning && "(Running)"}
            </Button>
            <Button
              variant={currentState === TIMER_STATES.SHORT_BREAK ? "default" : "outline"}
              onClick={() => handleStateChange(TIMER_STATES.SHORT_BREAK)}
            >
              <Coffee className="h-4 w-4 mr-2" />
              Short Break {timers[TIMER_STATES.SHORT_BREAK].isRunning && "(Running)"}
            </Button>
            <Button
              variant={currentState === TIMER_STATES.LONG_BREAK ? "default" : "outline"}
              onClick={() => handleStateChange(TIMER_STATES.LONG_BREAK)}
            >
              <TimerIcon className="h-4 w-4 mr-2" />
              Long Break {timers[TIMER_STATES.LONG_BREAK].isRunning && "(Running)"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-6">
            <div className="text-6xl font-mono font-bold tracking-wider">
              {formatTime(currentTimer.timeLeft)}
            </div>
            <div className="flex items-center gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                variant={currentTimer.isRunning ? "destructive" : "default"}
              >
                {currentTimer.isRunning ? (
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