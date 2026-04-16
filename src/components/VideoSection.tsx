import { motion } from "framer-motion";
import { MonitorPlay } from "lucide-react";

const VideoSection = () => {
  return (
    <section id="video-section" className="py-24 relative overflow-hidden gradient-mesh">
      {/* Decorative elements */}
      <div className="absolute top-10 right-20 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-20 w-40 h-40 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <MonitorPlay className="w-4 h-4" />
            عرض توضيحي
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            شاهد كيف يعمل <span className="text-gradient-primary">التطبيق</span>
          </h2>
          <p className="text-muted-foreground">فيديو توضيحي قصير يشرح ميزات التطبيق وواجهة الاستخدام</p>
        </motion.div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto relative group"
        >
          {/* Glow behind video */}
          <div className="absolute -inset-4 bg-gradient-to-r from-teal-200/30 via-emerald-200/20 to-sky-200/30 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

          <div className="relative bg-white rounded-2xl overflow-hidden card-shadow group-hover:card-hover-shadow transition-shadow duration-500 border border-white/60">
            {/* Gradient border top */}
            <div className="h-1 bg-gradient-to-l from-teal-400 via-emerald-400 to-sky-400" />
            <video
              controls
              className="w-full aspect-video"
              poster=""
            >
              <source src="/video/demo.mp4" type="video/mp4" />
              المتصفح لا يدعم تشغيل الفيديو
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
