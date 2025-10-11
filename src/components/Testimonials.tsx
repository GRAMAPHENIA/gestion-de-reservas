import GlassCard from "./GlassCard";

const SAMPLE = [
  {
    brand: 'AARP',
    quote: 'Foundry and AIP have been terrific for us. We launched the first prototype within 45 days. And that was just amazing from my perspective.'
  },
  {
    brand: "Lowe's",
    quote: 'In less than four months, we created something from POC all the way to production. Palantir has made us faster and smarter.'
  },
  {
    brand: 'CAZ Investments',
    quote: 'With AIP, we can now process over 100 times more leads with the same amount of resources.'
  }
]

export default function Testimonials(){
  return (
    <section className="site-container">
      <h3 className="text-2xl font-semibold mb-6">Lo que dicen nuestros partners</h3>
      <div className="partners-grid">
        {SAMPLE.map((t, i) => (
          <GlassCard key={i}>
            <div className="brand">{t.brand}</div>
            <div className="quote">"{t.quote}"</div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
