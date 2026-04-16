import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden gradient-primary-section py-12">
      {/* Animated decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-4 right-[20%] w-2 h-2 bg-white/15 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 8, 0], x: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-4 left-[30%] w-3 h-3 bg-white/10 rounded-full"
        />
      </div>

      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 z-[5] rotate-180">
        <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 40V15C240 35 480 40 720 25C960 10 1200 5 1440 15V40H0Z" fill="hsl(0 0% 100%)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2 text-white/80">
            <span>صُنع بكل</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
            </motion.div>
          </div>
          <p className="text-sm text-white/60 font-medium">
            عمل الطالبات — مخطط الرحلات الذكي &copy; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
