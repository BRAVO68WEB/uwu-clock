import { useState, useEffect } from "react";
import { format } from "date-fns";
import { AnimatedDigit } from "./AnimatedDigit";
import { motion } from "framer-motion";

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = format(time, "HH");
  const minutes = format(time, "mm");
  const seconds = format(time, "ss");
  const dateStr = format(time, "EEEE, dd MMMM, yyyy");

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Time Display */}
      <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
        {/* Hours */}
        <div className="flex">
          <AnimatedDigit
            value={hours[0]}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display text-clock-hour leading-none"
          />
          <AnimatedDigit
            value={hours[1]}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display text-clock-hour leading-none"
          />
        </div>

        {/* Separator */}
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="text-[6rem] md:text-[10rem] lg:text-[14rem] font-display text-clock-separator leading-none"
        >
          :
        </motion.span>

        {/* Minutes */}
        <div className="flex">
          <AnimatedDigit
            value={minutes[0]}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display text-clock-minute leading-none"
          />
          <AnimatedDigit
            value={minutes[1]}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display text-clock-minute leading-none"
          />
        </div>

        {/* Separator */}
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="text-[6rem] md:text-[10rem] lg:text-[14rem] font-display text-clock-separator leading-none"
        >
          :
        </motion.span>

        {/* Seconds */}
        <div className="flex">
          <AnimatedDigit
            value={seconds[0]}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display text-clock-second leading-none"
          />
          <AnimatedDigit
            value={seconds[1]}
            className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-display text-clock-second leading-none"
          />
        </div>
      </div>

      {/* Date Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="px-6 py-3 bg-date-bg rounded-full"
      >
        <span className="text-lg md:text-xl lg:text-2xl font-date text-date-text">
          {dateStr}
        </span>
      </motion.div>
    </div>
  );
};
