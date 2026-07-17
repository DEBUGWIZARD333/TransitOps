import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 font-sans text-white">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [0, 90, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-transparent blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -90, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-cyan-500/20 to-blue-600/20 blur-[100px]"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center">
        {/* Animated Logo Container */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, duration: 1.5 }}
          className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl"
        >
          {/* Inner glowing element */}
          <motion.div 
            animate={{ 
              boxShadow: ["0px 0px 0px 0px rgba(99,102,241,0)", "0px 0px 40px 10px rgba(99,102,241,0.5)", "0px 0px 0px 0px rgba(99,102,241,0)"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-[2rem]"
          />
          
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
            <motion.path 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              d="M8 12L11 15L16 9" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Animated Text */}
        <motion.div className="overflow-hidden">
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
            className="text-6xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 sm:text-8xl"
          >
            TRANSITOPS
          </motion.h1>
        </motion.div>

        <motion.div className="overflow-hidden mt-6">
          <motion.p 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
            className="text-lg font-medium tracking-widest text-indigo-200/60 uppercase"
          >
            Intelligent Fleet Command
          </motion.p>
        </motion.div>

        {/* Interactive Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-16"
        >
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center gap-4 rounded-full bg-white/10 px-8 py-4 pr-6 backdrop-blur-md border border-white/10 transition-all hover:bg-white/20 hover:border-white/30"
            >
              <span className="text-sm font-bold tracking-widest text-white uppercase">Initialize System</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.6)] group-hover:bg-indigo-400 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default LandingPage;
