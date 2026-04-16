import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sparkles, Play, ArrowDown, MapPin, Plane, Globe } from "lucide-react";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToVideo = () => {
    document.getElementById("video-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden gradient-animated noise-overlay">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 - Large teal */}
        <div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-teal-200/40 to-emerald-300/30 blob-shape opacity-60"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />
        {/* Blob 2 - Warm orange */}
        <div
          className="absolute top-1/3 -left-32 w-[400px] h-[400px] bg-gradient-to-tr from-orange-200/30 to-amber-200/20 blob-shape-delayed opacity-50"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        />
        {/* Blob 3 - Blue accent */}
        <div
          className="absolute bottom-10 right-1/4 w-[300px] h-[300px] bg-gradient-to-bl from-sky-200/30 to-cyan-200/20 blob-shape opacity-40"
          style={{ transform: `translateY(${scrollY * 0.06}px)` }}
        />
        {/* Floating decorative elements */}
        <div className="absolute top-32 left-[15%] w-3 h-3 bg-teal-400/40 rounded-full animate-float" />
        <div className="absolute top-48 right-[20%] w-4 h-4 bg-amber-400/30 rounded-full animate-float-slow" />
        <div className="absolute bottom-40 left-[30%] w-2 h-2 bg-sky-400/40 rounded-full animate-float-reverse" />
        <div className="absolute top-[60%] right-[10%] w-5 h-5 bg-emerald-400/20 rounded-full animate-particle-drift" />
        <div className="absolute top-[20%] left-[50%] w-3 h-3 bg-orange-300/30 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        {/* Floating icons */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[25%] right-[8%] text-teal-300/30"
        >
          <MapPin className="w-8 h-8" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[30%] left-[12%] text-amber-300/30"
        >
          <Plane className="w-7 h-7" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[15%] left-[25%] text-sky-300/25"
        >
          <Globe className="w-10 h-10" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          {/* Logo/Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative"
          >
            {/* Glow behind logo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 bg-gradient-to-r from-teal-300/20 to-emerald-300/20 rounded-full blur-3xl animate-pulse-glow" />
            </div>
            <img
              src={logo}
              alt="مخطط الرحلات"
              className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] animate-float-slow drop-shadow-2xl"
            />
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 text-center lg:text-right"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-sm font-medium mb-6 hover-lift cursor-default"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-gradient-warm font-bold">مدعوم بالذكاء الاصطناعي</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4"
            >
              مخطط الرحلات{" "}
              <span className="text-gradient-primary">الذكي</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 lg:mr-0 leading-relaxed"
            >
              خطط لرحلاتك المدرسية بمساعدة الذكاء الاصطناعي — وجهات ذكية، جداول محسّنة، وتجربة تخطيط سلسة
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/plan"
                className="group relative bg-primary text-primary-foreground px-8 py-3.5 rounded-xl text-base font-bold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">ابدأ التخطيط</span>
                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <button
                onClick={scrollToVideo}
                className="flex items-center gap-2 glass px-6 py-3.5 rounded-xl hover:shadow-md transition-all duration-300 text-base font-medium hover-lift"
              >
                شاهد الفيديو
                <Play className="w-4 h-4 text-primary" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-1 text-muted-foreground/50"
        >
          <span className="text-xs font-medium">اكتشف المزيد</span>
          <ArrowDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      {/* Bottom wave transition */}
      <div className="absolute bottom-0 left-0 right-0 z-[5]">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 80V40C240 10 480 0 720 20C960 40 1200 50 1440 20V80H0Z"
            fill="hsl(0 0% 100%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
