import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

const RainSounds: React.FC = () => {
  const { settings, setSound } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([settings.sound.volume]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Sync from settings
  useEffect(() => {
    setVolume([settings.sound.volume]);
  }, [settings.sound.volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (settings.sound.type === "none") {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    if (settings.sound.autoplay) {
      void audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [settings.sound.type, settings.sound.autoplay]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setIsPlaying((prev) => {
      if (prev) {
        audio.pause();
      } else {
        void audio.play();
      }
      return !prev;
    });
  }, []);

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    setSound({ volume: newVolume[0] });
  };

  // Global keyboard/control: listen for toggle event
  useEffect(() => {
    const handler = () => {
      // If type is none, ignore
      if (settings.sound.type === "none") return;
      togglePlayPause();
    };
    window.addEventListener("uwu:toggle-sound", handler as EventListener);
    return () =>
      window.removeEventListener("uwu:toggle-sound", handler as EventListener);
  }, [settings.sound.type, togglePlayPause]);

  if (settings.sound.type === "none") return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
      <audio ref={audioRef} loop>
        {/* Currently only "rain" is supported */}
        <source src="https://media.rainymood.com/0.m4a" type="audio/mp4" />
        <source src="https://media.rainymood.com/0.ogg" type="audio/ogg" />
        <source src="https://media.rainymood.com/0.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayPause}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center space-x-2 min-w-[120px]">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={volume}
            onValueChange={handleVolumeChange}
            max={100}
            min={0}
            step={1}
            className="flex-1"
          />
        </div>
      </div>

      <div className="text-xs text-muted-foreground mt-2 text-center">
        Rain Sounds
      </div>
    </div>
  );
};

export default RainSounds;
