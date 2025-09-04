import CompoundChart from "@/components/CompoundChart";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center px-4 sm:px-8 pt-16 pb-24">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Compound Effect vs. Inflation
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-slate-200 mt-2 whitespace-nowrap">
          How investing&nbsp;5,000&nbsp;DKK each month can outperform savings eroded by inflation over&nbsp;20&nbsp;years
        </p>
      </header>

      {/* Chart Section */}
      <section className="w-full max-w-6xl">
        <CompoundChart />
      </section>

      {/* Explanation */}
      <section className="max-w-3xl text-center mt-12 px-4">
        <h2 className="text-2xl font-semibold text-white mb-4">Why it matters</h2>
        <p className="text-slate-300 leading-relaxed">
          Regular savings are important, but leaving money idle can mean losing purchasing power every year.
          By investing wisely, you allow compound interest to work in your favor—potentially growing your wealth
          exponentially while inflation quietly diminishes uninvested cash. This visualization highlights the stark
          difference between merely saving and actively investing at varying rates of return.
        </p>
      </section>
    </div>
  );
}
