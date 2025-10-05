import { Clock } from "@/components/Clock";
import { Background } from "@/components/Background";
import { FullscreenButton } from "@/components/FullscreenButton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import RainSounds from "@/components/RainSounds";
import FocusMode from "@/components/FocusMode";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Background />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex min-h-screen items-center justify-center p-4"
      >
        <Clock />
      </motion.div>

      {/* Attribution Button */}
      <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 shadow-lg"
            onClick={() => window.open('https://github.com/BRAVO68WEB/uwu-clock', '_blank')}
          >
            <span className="text-sm font-medium">Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-red-500" />
            <span className="text-sm font-medium">by @bravo68web</span>
            <ExternalLink className="h-3 w-3 ml-2 opacity-70" />
          </Button>
        </motion.div>
      </div>

      {/* Focus Mode */}
      <FocusMode />

      {/* Fullscreen Button */}
      <FullscreenButton />

      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Rain Sounds */}
      <RainSounds />
    </div>
  );
};

export default Index;
