import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, Play } from "lucide-react";
import logo from "@/assets/logo.png";

const HeroSection = () => {
  const scrollToVideo = () => {
    document.getElementById("video-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-gradient min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <img src={logo} alt="مخطط الرحلات" className="mx-auto w-80 h-80 md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              مدعوم بالذكاء الاصطناعي
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-4">
              مخطط الرحلات الذكي
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 lg:mr-0">
              خطط لرحلاتك المدرسية بمساعدة الذكاء الاصطناعي
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/plan"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl text-base font-bold hover:opacity-90 transition-opacity"
              >
                ابدأ التخطيط
              </Link>
              <button
                onClick={scrollToVideo}
                className="flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-xl border border-border hover:bg-secondary transition-colors text-base font-medium"
              >
                شاهد الفيديو
                <Play className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
