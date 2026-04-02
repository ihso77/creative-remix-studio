import { motion } from "framer-motion";
import { Brain, Users, CheckSquare } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "ذكاء اصطناعي متقدم",
    description: "اقتراحات ذكية للوجهات بناءً على احتياجاتك",
  },
  {
    icon: Users,
    title: "سهولة الاستخدام",
    description: "واجهة بسيطة وسهلة للمعلمين والطلاب",
  },
  {
    icon: CheckSquare,
    title: "إدارة شاملة",
    description: "تتبع الرحلات والمشاركين والتقييمات",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold text-center text-foreground mb-14"
        >
          مميزات التطبيق
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-2xl p-8 text-center card-shadow hover:card-hover-shadow transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mx-auto mb-5">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
