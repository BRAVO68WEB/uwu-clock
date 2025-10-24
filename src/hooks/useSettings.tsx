/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { idbGet, idbSet } from "@/lib/settings-db";
import { BackgroundOption } from "@/components/backgrounds";

export type ThemeOption = "light" | "dark" | "system";
export type SoundOption = "none" | "rain";
export type PaletteOption =
  | "rose"
  | "violet"
  | "blue"
  | "emerald"
  | "amber"
  | "cyan";
export type ClockOrder = "time-date" | "date-time";

export interface BackgroundSettings {
  type: (typeof BackgroundOption)[keyof typeof BackgroundOption];
}

export interface SoundSettings {
  type: SoundOption;
  volume: number; // 0..100
  autoplay: boolean;
}

export interface ClockSettings {
  showSeconds: boolean;
  blinkSeparators: boolean;
  order: ClockOrder;
}

export interface SettingsState {
  theme: ThemeOption;
  palette: PaletteOption;
  sound: SoundSettings;
  background: BackgroundSettings;
  clock: ClockSettings;
}

const DEFAULT_SETTINGS: SettingsState = {
  theme: "dark",
  palette: "rose",
  sound: {
    type: "rain",
    volume: 50,
    autoplay: false,
  },
  background: {
    type: BackgroundOption.Squares,
  },
  clock: {
    showSeconds: true,
    blinkSeparators: true,
    order: "time-date",
  },
};

type SettingsContextValue = {
  settings: SettingsState;
  setTheme: (theme: ThemeOption) => void;
  setPalette: (palette: PaletteOption) => void;
  setSound: (partial: Partial<SoundSettings>) => void;
  setBackground: (partial: Partial<BackgroundSettings>) => void;
  setClock: (partial: Partial<ClockSettings>) => void;
  refreshFromDB: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await idbGet<SettingsState>("settings");
        if (saved) {
          setSettings({
            ...DEFAULT_SETTINGS,
            ...saved,
            sound: { ...DEFAULT_SETTINGS.sound, ...saved.sound },
            background: { ...DEFAULT_SETTINGS.background, ...saved.background },
          });
        }
      } catch (e) {
        // ignore
      } finally {
        setLoaded(true);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    void idbSet("settings", settings);
  }, [settings, loaded]);

  // Apply palette to document attribute for CSS to consume
  useEffect(() => {
    document.documentElement.setAttribute("data-palette", settings.palette);
  }, [settings.palette]);

  const api = useMemo<SettingsContextValue>(
    () => ({
      settings,
      setTheme: (theme) => setSettings((s) => ({ ...s, theme })),
      setPalette: (palette) => setSettings((s) => ({ ...s, palette })),
      setSound: (partial) =>
        setSettings((s) => ({ ...s, sound: { ...s.sound, ...partial } })),
      setBackground: (partial) =>
        setSettings((s) => ({
          ...s,
          background: { ...s.background, ...partial },
        })),
      setClock: (partial) =>
        setSettings((s) => ({ ...s, clock: { ...s.clock, ...partial } })),
      refreshFromDB: async () => {
        const saved = await idbGet<SettingsState>("settings");
        if (saved)
          setSettings({
            ...DEFAULT_SETTINGS,
            ...saved,
            sound: { ...DEFAULT_SETTINGS.sound, ...saved.sound },
            background: { ...DEFAULT_SETTINGS.background, ...saved.background },
            clock: { ...DEFAULT_SETTINGS.clock, ...(saved.clock ?? {}) },
          });
      },
    }),
    [settings],
  );

  return (
    <SettingsContext.Provider value={api}>{children}</SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx)
    throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
