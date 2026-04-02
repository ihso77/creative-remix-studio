import { motion } from "framer-motion";
import { GraduationCap, Globe, Shield, Zap, Heart, Star } from "lucide-react";

const aboutPoints = [
  {
    icon: GraduationCap,
    title: "تعليمي 100%",
    desc: "مصمم خصيصاً للبيئة التعليمية والرحلات المدرسية",
  },
  {
    icon: Globe,
    title: "وجهات متنوعة",
    desc: "اقتراحات لأفضل الوجهات في الخليج العربي والعالم",
  },
  {
    icon: Shield,
    title: "آمن وموثوق",
    desc: "بياناتك محمية بأعلى معايير الأمان",
  },
  {
    icon: Zap,
    title: "سريع وذكي",
    desc: "ذكاء اصطناعي يقدم اقتراحات فورية ودقيقة",
  },
  {
    icon: Heart,
    title: "مجاني للجميع",
    desc: "استخدم التطبيق مجاناً بدون أي رسوم",
  },
  {
    icon: Star,
    title: "تقييمات ومراجعات",
    desc: "شارك تجربتك وقيّم الرحلات السابقة",
  },
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">نبذة عن التطبيق</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            مخطط الرحلات الذكي هو تطبيق يساعد المعلمين والطلاب على تخطيط الرحلات المدرسية بسهولة
            باستخدام أحدث تقنيات الذكاء الاصطناعي. يقدم اقتراحات ذكية ومخصصة بناءً على احتياجاتكم.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {aboutPoints.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-card rounded-xl p-5 card-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <point.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
