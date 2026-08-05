import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
  style,
  className,
}) => {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    current.toFixed(decimals)
  );

  const [renderedValue, setRenderedValue] = useState(display.get());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setRenderedValue(latest);
    });
  }, [display]);

  return (
    <motion.span style={style} className={className}>
      {prefix}
      {renderedValue}
      {suffix}
    </motion.span>
  );
};
