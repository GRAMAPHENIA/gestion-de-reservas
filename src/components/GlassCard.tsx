// components/GlassCard.tsx
export default function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-stone-50/70 backdrop-blur-md rounded-2xl border border-stone-200/50 shadow-xl p-6">
      {children}
    </div>
  );
}
