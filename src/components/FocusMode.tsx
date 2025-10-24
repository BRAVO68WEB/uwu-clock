import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, X, Clock, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FocusSession {
  goal: string;
  endTime: string;
  isActive: boolean;
}

const FocusMode: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusSession, setFocusSession] = useState<FocusSession | null>(null);
  const [goal, setGoal] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeRemaining, setTimeRemaining] = useState("");

  // Audio element for sound alert
  const playAlertSound = () => {
    const audio = new Audio("/cat-meow-1-fx-306178.mp3");
    audio.volume = 0.5; // 50% volume
    audio.play().catch((error) => {
      console.log("Could not play alert sound:", error);
    });
  };

  // Load focus session from localStorage on component mount
  useEffect(() => {
    const savedSession = localStorage.getItem("focusSession");
    if (savedSession) {
      const session: FocusSession = JSON.parse(savedSession);
      const now = new Date();
      const sessionEndTime = new Date(session.endTime);

      if (sessionEndTime > now && session.isActive) {
        setFocusSession(session);
      } else {
        // Session expired, clear it
        localStorage.removeItem("focusSession");
      }
    }
  }, []);

  // Update time remaining every second
  useEffect(() => {
    if (!focusSession?.isActive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const endTime = new Date(focusSession.endTime);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        // Session ended - play alert sound
        playAlertSound();
        setFocusSession(null);
        localStorage.removeItem("focusSession");
        setTimeRemaining("");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [focusSession]);

  const startFocusSession = () => {
    if (!goal.trim() || !endTime) return;

    const session: FocusSession = {
      goal: goal.trim(),
      endTime,
      isActive: true,
    };

    setFocusSession(session);
    localStorage.setItem("focusSession", JSON.stringify(session));
    setGoal("");
    setEndTime("");
    setIsOpen(false);
  };

  const endFocusSession = () => {
    setFocusSession(null);
    localStorage.removeItem("focusSession");
    setTimeRemaining("");
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Default to 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  // Global open event: allow keyboard shortcut to open the menu
  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("uwu:open-focus", handler as EventListener);
    return () =>
      window.removeEventListener("uwu:open-focus", handler as EventListener);
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Focus Mode Toggle Button */}
      <Button
        variant={focusSession?.isActive ? "default" : "outline"}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          focusSession?.isActive
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-background/80 backdrop-blur-sm border-border"
        } transition-all duration-200`}
      >
        <Target className="h-4 w-4 mr-2" />
        {focusSession?.isActive ? "Focus Active" : "Focus Mode"}
        {focusSession?.isActive && timeRemaining && (
          <Badge variant="secondary" className="ml-2 text-xs">
            {timeRemaining}
          </Badge>
        )}
      </Button>

      {/* Active Focus Session Display */}
      {focusSession?.isActive && !isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-background/90 backdrop-blur-sm border border-border rounded-lg shadow-lg max-w-xs"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">
                Current Goal:
              </p>
              <p className="text-sm text-muted-foreground">
                {focusSession.goal}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={endFocusSession}
              className="h-6 w-6 p-0 ml-2"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Focus Mode Setup Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 w-80"
          >
            <Card className="bg-background/95 backdrop-blur-sm border-border shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Focus Mode
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {focusSession?.isActive ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm font-medium text-foreground mb-1">
                        Active Goal:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {focusSession.goal}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {timeRemaining} remaining
                      </div>
                    </div>
                    <Button
                      onClick={endFocusSession}
                      variant="outline"
                      className="w-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        What's your goal?
                      </label>
                      <Input
                        placeholder="e.g., Complete project proposal"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Focus until when?
                      </label>
                      <Input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        min={getCurrentDateTime()}
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      onClick={startFocusSession}
                      disabled={!goal.trim() || !endTime}
                      className="w-full"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Start Focus Session
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusMode;
