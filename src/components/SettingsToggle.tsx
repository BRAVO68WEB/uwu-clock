import { Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
};

const SettingsToggle = ({ onClick }: Props) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="fixed top-4 right-4 z-50 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-lg"
    >
      <SettingsIcon className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Open settings</span>
    </Button>
  );
};

export default SettingsToggle;
