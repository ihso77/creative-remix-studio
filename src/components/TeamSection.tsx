import { motion } from "framer-motion";

const teamMembers = [
  { name: "مها موسى البلوشية", initials: "مم" },
  { name: "مهره عبدالله البلوشي", initials: "مع" },
  { name: "نورة سلطان العربية", initials: "نس" },
  { name: "ميرة سليمان الرئيسية", initials: "مس" },
  { name: "آمنة إسماعيل البلوشية", initials: "آا" },
];

const TeamSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">فريقنا</h2>
          <p className="text-muted-foreground text-lg">فريق صناع الأثر</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                {member.initials}
              </div>
              <h3 className="text-sm font-bold text-foreground text-center">{member.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
