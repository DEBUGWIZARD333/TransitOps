import { motion } from 'framer-motion';

const Card = ({ title, children }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="glass-panel p-6 flex flex-col h-full relative overflow-hidden group"
  >
    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
    {title ? <h3 className="mb-5 text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-indigo-500 dark:from-slate-200 dark:to-indigo-300 relative z-10">{title}</h3> : null}
    <div className="relative z-10 flex-1">
      {children}
    </div>
  </motion.section>
);

export default Card;
