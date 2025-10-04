import { Clock } from "@/components/Clock";
import { WavyBackground } from "@/components/WavyBackground";
import { FullscreenButton } from "@/components/FullscreenButton";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Gradient Overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gradient-start/10 via-gradient-mid/10 to-gradient-end/10 opacity-50" />
      </div>

      {/* Wavy Background */}
      <WavyBackground />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex min-h-screen items-center justify-center p-4"
      >
        <Clock />
      </motion.div>

      {/* Fullscreen Button */}
      <FullscreenButton />
    </div>
  );
};

export default Index;
