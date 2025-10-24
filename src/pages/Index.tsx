import { Clock } from "@/components/Clock";
import Background from "@/components/backgrounds";
import { FullscreenButton } from "@/components/FullscreenButton";
import SettingsToggle from "@/components/SettingsToggle";
import RainSounds from "@/components/RainSounds";
import FocusMode from "@/components/FocusMode";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart } from "lucide-react";
import SettingsModal from "@/components/SettingsModal";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";

const Index = () => {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "/" || e.key === "B")) {
        e.preventDefault();
        setOpen((o) => !o);
      }

      // Spacebar: toggle play/pause rain sounds
      // Ignore if typing in inputs or when modifiers are pressed
      const target = e.target as HTMLElement | null;
      const isEditable =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          (target as HTMLElement).isContentEditable ||
          target.tagName === "SELECT");

      if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        if (e.code === "Space") {
          if (!isEditable) {
            e.preventDefault();
            window.dispatchEvent(new Event("uwu:toggle-sound"));
          }
          return;
        }
      }

      // F11: toggle fullscreen (prevent browser default if possible)
      if (e.key === "F11") {
        e.preventDefault();
        window.dispatchEvent(new Event("uwu:toggle-fullscreen"));
        return;
      }

      // Ctrl/Cmd + Shift + F: toggle fullscreen
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === "f" || e.key === "F")
      ) {
        e.preventDefault();
        window.dispatchEvent(new Event("uwu:toggle-fullscreen"));
        return;
      }

      // Ctrl/Cmd + F: open Focus Mode menu
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        (e.key === "f" || e.key === "F")
      ) {
        e.preventDefault();
        window.dispatchEvent(new Event("uwu:open-focus"));
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Background type={settings.background.type} />
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
            onClick={() =>
              window.open("https://github.com/BRAVO68WEB/uwu-clock", "_blank")
            }
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

      {/* Settings Toggle */}
      <SettingsToggle onClick={() => setOpen(true)} />

      {/* Rain Sounds */}
      <RainSounds />

      {/* Settings Modal (Ctrl/Cmd + B) */}
      <SettingsModal open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Index;
