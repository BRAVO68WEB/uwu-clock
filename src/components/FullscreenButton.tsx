import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const FullscreenButton = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Button
        onClick={toggleFullscreen}
        size="icon"
        className="h-14 w-14 rounded-full bg-primary/20 backdrop-blur-sm hover:bg-primary/30 border border-primary/30 transition-all duration-300 hover:scale-110"
      >
        {isFullscreen ? (
          <Minimize className="h-6 w-6 text-primary" />
        ) : (
          <Maximize className="h-6 w-6 text-primary" />
        )}
      </Button>
    </motion.div>
  );
};
