import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Users, MapPin, Award } from "lucide-react";

const stats = [
  { icon: MapPin, value: 50, suffix: "+", label: "وجهة متاحة" },
  { icon: Users, value: 1000, suffix: "+", label: "مستخدم نشط" },
  { icon: TrendingUp, value: 500, suffix: "+", label: "رحلة مخططة" },
  { icon: Award, value: 4.9, suffix: "", label: "تقييم المستخدمين" },
];

/* Animated counter component */
const AnimatedCounter = ({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const display = value % 1 !== 0 ? count.toFixed(1) : count;

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
};

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden gradient-primary-section">
      {/* Animated decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating shapes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 right-[10%] w-20 h-20 border-2 border-white/10 rounded-xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -180, -360] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-8 left-[15%] w-16 h-16 border-2 border-white/10 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-[30%] w-3 h-3 bg-white/15 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] left-[40%] w-2 h-2 bg-white/10 rounded-full"
        />
        {/* Gradient orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 z-[5] rotate-180">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V20C360 50 720 55 1080 30C1260 15 1380 10 1440 15V60H0Z" fill="hsl(0 0% 100%)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="text-center group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-3 group-hover:bg-white/15 transition-colors">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
              </motion.div>
              <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
              </p>
              <p className="text-sm text-white/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 z-[5]">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0V20C360 50 720 55 1080 30C1260 15 1380 10 1440 15V0H0Z" fill="hsl(0 0% 100%)" />
        </svg>
      </div>
    </section>
  );
};

export default StatsSection;
