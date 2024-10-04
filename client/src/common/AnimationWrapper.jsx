import { AnimatePresence, motion } from "framer-motion";

const AnimationWrapper = ({
  children,
  intial = { opacity: 0 },
  animate = { opacity: 1 },
  trasition = { duration: 1.2 },
  keyValue,
  className,
}) => {
  return (
    <AnimatePresence>
      {" "}
      <motion.div
        key={keyValue}
        initial={intial}
        animate={animate}
        transition={trasition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
