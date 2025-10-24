import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  useSettings,
  ThemeOption,
  SoundOption,
  PaletteOption,
  ClockOrder,
} from "@/hooks/useSettings";
import { useTheme } from "next-themes";
import { BackgroundOption } from "@/components/backgrounds";

type SettingsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { settings, setTheme, setSound, setBackground, setPalette, setClock } =
    useSettings();
  const { setTheme: setThemeNext } = useTheme();

  // Sync next-themes when settings.theme changes via modal
  useEffect(() => {
    setThemeNext(settings.theme);
  }, [settings.theme, setThemeNext]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize theme, background, and sounds. Tip: Press Ctrl/Cmd + B to
            toggle this panel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Clock */}
          <section className="space-y-3">
            <Label className="text-base">Clock</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="col-span-1 flex items-center gap-2">
                <Switch
                  checked={settings.clock.showSeconds}
                  onCheckedChange={(c) => setClock({ showSeconds: c })}
                  id="show-seconds"
                />
                <Label htmlFor="show-seconds">Show seconds</Label>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Switch
                  checked={settings.clock.blinkSeparators}
                  onCheckedChange={(c) => setClock({ blinkSeparators: c })}
                  id="blink-separators"
                />
                <Label htmlFor="blink-separators">Blink separators</Label>
              </div>
              <div className="col-span-1">
                <Label className="text-sm">Layout</Label>
                <Select
                  value={settings.clock.order}
                  onValueChange={(v) => setClock({ order: v as ClockOrder })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="time-date">
                      Clock first, then date
                    </SelectItem>
                    <SelectItem value="date-time">
                      Date first, then clock
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Color Palette */}
          <section className="space-y-2">
            <Label className="text-base">Color palette</Label>
            <Select
              value={settings.palette}
              onValueChange={(v) => setPalette(v as PaletteOption)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select palette" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rose">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: "hsl(341 91% 60%)" }}
                    />
                    <span>Rose</span>
                  </div>
                </SelectItem>
                <SelectItem value="violet">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: "hsl(262 83% 58%)" }}
                    />
                    <span>Violet</span>
                  </div>
                </SelectItem>
                <SelectItem value="blue">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: "hsl(217.2 91.2% 59.8%)" }}
                    />
                    <span>Blue</span>
                  </div>
                </SelectItem>
                <SelectItem value="emerald">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: "hsl(142.1 70.6% 45.3%)" }}
                    />
                    <span>Emerald</span>
                  </div>
                </SelectItem>
                <SelectItem value="amber">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: "hsl(38 92% 50%)" }}
                    />
                    <span>Amber</span>
                  </div>
                </SelectItem>
                <SelectItem value="cyan">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: "hsl(188 94% 42%)" }}
                    />
                    <span>Cyan</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Theme */}
          <section className="space-y-2">
            <Label className="text-base">Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={(v) => setTheme(v as ThemeOption)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Sounds */}
          <section className="space-y-3">
            <Label className="text-base">Background sounds</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="col-span-1">
                <Label className="text-sm">Type</Label>
                <Select
                  value={settings.sound.type}
                  onValueChange={(v) => setSound({ type: v as SoundOption })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select sound" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="rain">Rain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label className="text-sm">
                  Volume: {settings.sound.volume}
                </Label>
                <Slider
                  value={[settings.sound.volume]}
                  onValueChange={(v) => setSound({ volume: v[0] })}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-3"
                />
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <Switch
                  checked={settings.sound.autoplay}
                  onCheckedChange={(c) => setSound({ autoplay: c })}
                  id="autoplay"
                />
                <Label htmlFor="autoplay">Autoplay on load</Label>
              </div>
            </div>
          </section>

          {/* Background */}
          <section className="space-y-3">
            <Label className="text-base">Background</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div className="col-span-1">
                <Label className="text-sm">Direction</Label>
                <Select
                  value={settings.background.type}
                  onValueChange={(v) =>
                    setBackground({
                      type: v as (typeof BackgroundOption)[keyof typeof BackgroundOption],
                    })
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Types" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="diagonal">Diagonal</SelectItem> */}
                    {Object.entries(BackgroundOption).map(([key, value]) => (
                      <SelectItem key={value} value={value}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
