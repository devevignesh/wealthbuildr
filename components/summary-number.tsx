"use client";

import { useEffect, useState } from "react";

import { animate, motion, useMotionValue, useTransform, useMotionValueEvent } from "framer-motion";

import { formatNumber } from "@/lib/numbers";
import { cn } from "@/lib/utils"

type NumberProps = {
  from: number;
  to: number;
  duration?: number;
  className?: string;
};

export function SummaryNumber({ from, to, duration = 0.25, className = "" }: NumberProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, Math.round);

  const [formattedNumber, setFormattedNumber] = useState(formatNumber(from));

  useMotionValueEvent(rounded, "change", latest => {
    setFormattedNumber(
      formatNumber(latest)
    );
  });

  useEffect(() => {
    const controls = animate(count, to, { duration });
    return () => controls.stop();
  }, [duration, count, to]);

  return (
    <motion.span className={cn("font-semibold text-3xl", className)}>
      {formattedNumber}
    </motion.span>
  );
}
