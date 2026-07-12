import { ArrowRight, ShieldCheck, TrendingUp, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const LandingPage = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_40%),linear-gradient(135deg,_#020617,_#0f172a)] text-slate-100">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 sm:px-8 lg:px-10">
      <div className="text-xl font-semibold tracking-[0.3em] text-white">TRANSITOPS</div>
      <Link to="/login">
        <Button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100">
          Login
        </Button>
      </Link>
    </header>

    <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 sm:px-8 lg:flex-row lg:gap-16 lg:px-10 lg:py-24">
      <section className="max-w-2xl text-center lg:text-left">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-slate-200 backdrop-blur">
          <ShieldCheck size={16} />
          Smart transport operations, designed for modern fleets
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
          TRANSITOPS brings your fleet, drivers, and operations into one intelligent command center.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          Monitor trips, manage vehicles and maintenance, track fuel and expenses, and keep every operation moving with clarity. Built for transport organizations that demand speed, safety, and visibility.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/login">
            <Button className="flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-base text-slate-950 hover:bg-cyan-400">
              Open portal <ArrowRight size={18} />
            </Button>
          </Link>
          <button className="rounded-full border border-white/15 px-6 py-3 text-base text-slate-200 transition hover:bg-white/10">
            Explore platform
          </button>
        </div>
      </section>

      <section className="mt-12 w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl lg:mt-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <Truck className="mb-3 text-cyan-400" size={24} />
            <h3 className="font-semibold text-white">Fleet Orchestration</h3>
            <p className="mt-2 text-sm text-slate-300">Coordinate vehicles, routes, and dispatch updates in real time.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <TrendingUp className="mb-3 text-cyan-400" size={24} />
            <h3 className="font-semibold text-white">Data-driven Decisions</h3>
            <p className="mt-2 text-sm text-slate-300">Track analytics, costs, and performance with dependable visibility.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
);

export default LandingPage;
