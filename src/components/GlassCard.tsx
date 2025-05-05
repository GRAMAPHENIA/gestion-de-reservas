// components/GlassCard.tsx
export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/30 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl p-6">
      {children} 
    </div>
  );
}
