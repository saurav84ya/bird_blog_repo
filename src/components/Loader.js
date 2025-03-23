"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center  h-screen">
      <motion.div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-5 h-5 rounded-full bg-blue-500"
            animate={{
              y: [0, -10, 0], // Smooth bouncing effect
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2, // Staggered effect
            }}
          />
        ))}
      </motion.div>
      <p className="text-white mt-4 text-lg">Loading...</p>
    </div>
  );
};

export default Loading;
