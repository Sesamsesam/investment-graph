import CompoundChart from "@/components/CompoundChart";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center px-4 sm:px-8 py-12">
      {/* Subtle animated background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top-left floating circle */}
        <div className="absolute -top-32 -left-32 w-[450px] h-[450px] rounded-full bg-blue-500/20 blur-3xl animate-pulse motion-safe:animate-[pulse_28s_ease-in-out_infinite]" />
        {/* Bottom-right floating circle */}
        <div className="absolute -bottom-40 -right-40 w-[550px] h-[550px] rounded-full bg-emerald-400/20 blur-3xl animate-pulse motion-safe:animate-[pulse_35s_ease-in-out_infinite]" />
      </div>

      {/* Chart Section */}
      <section className="w-full max-w-6xl">
        <CompoundChart />
      </section>
    </div>
  );
}
