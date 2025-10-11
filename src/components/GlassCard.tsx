// components/GlassCard.tsx
export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="testimonial-card">
      {children}
    </div>
  );
}
