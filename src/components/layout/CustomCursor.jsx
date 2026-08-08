import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Motion values for exact mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for the outer ring trailing effect
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect touch device to disable cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      // Find closest interactable element
      const target = e.target.closest('a, button, input, textarea, select, [role="button"], .magnetic');
      if (target) {
        setIsHovered(true);
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('a, button, input, textarea, select, [role="button"], .magnetic');
      if (target) {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  if (isTouch) return null;

  // Variants for the outer ring
  const ringVariants = {
    default: {
      width: 40,
      height: 40,
      x: "-50%",
      y: "-50%",
      backgroundColor: "transparent",
      borderColor: "rgba(255, 255, 255, 0.4)",
    },
    hover: {
      width: 60,
      height: 60,
      x: "-50%",
      y: "-50%",
      backgroundColor: "rgba(255, 255, 255, 1)",
      borderColor: "transparent",
      mixBlendMode: "difference"
    }
  };

  // Variants for the inner dot
  const dotVariants = {
    default: {
      x: "-50%",
      y: "-50%",
      opacity: 1
    },
    hover: {
      x: "-50%",
      y: "-50%",
      opacity: 0 // Hide inner dot when hovering to let ring become solid
    }
  };

  return (
    <div className="cursor-wrapper">
      <motion.div
        className="cursor-ring"
        variants={ringVariants}
        animate={isHovered ? "hover" : "default"}
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="cursor-dot"
        variants={dotVariants}
        animate={isHovered ? "hover" : "default"}
        style={{
          left: cursorX, // Dot follows exactly (no spring)
          top: cursorY,
        }}
      />
    </div>
  );
};

export default CustomCursor;
