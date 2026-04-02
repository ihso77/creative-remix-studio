const Footer = () => {
  return (
    <footer className="py-6 bg-card border-t border-border text-center">
      <p className="text-sm text-muted-foreground">
        عمل الطالبات — مخطط الرحلات الذكي © {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
