import React from 'react';
import { motion } from 'framer-motion';

interface FadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  className?: string;
}

export const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 0.5,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
        filter: blur ? 'blur(8px)' : 'blur(0px)',
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
