import { Clock } from "@/components/Clock";
import { Background } from "@/components/Background";
import { FullscreenButton } from "@/components/FullscreenButton";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import RainSounds from "@/components/RainSounds";
import FocusMode from "@/components/FocusMode";
import { motion } from "framer-motion";

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
