import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface AnimatedDigitProps {
  value: string;
  className?: string;
}

export const AnimatedDigit = ({ value, className = "" }: AnimatedDigitProps) => {
  const digitRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (digitRef.current) {
      gsap.fromTo(
        digitRef.current,
        { scale: 0.95, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [value]);

  return (
    <div className="inline-flex justify-center items-center w-[4.5rem] md:w-[7rem] lg:w-[9.5rem]">
      <AnimatePresence mode="wait">
        <motion.span
          key={value}
          ref={digitRef}
          initial={{ y: -20, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          className={`inline-block text-center ${className}`}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
