import { motion } from "framer-motion";

const VideoSection = () => {
  return (
    <section id="video-section" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            شاهد كيف يعمل التطبيق
          </h2>
          <p className="text-muted-foreground">فيديو توضيحي قصير يشرح ميزات التطبيق</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden card-shadow bg-card"
        >
          <video
            controls
            className="w-full aspect-video"
            poster=""
          >
            <source src="/video/demo.mp4" type="video/mp4" />
            المتصفح لا يدعم تشغيل الفيديو
          </video>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
