'use client'

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function AIHero() {
  return (
    <div className="min-h-screen w-full bg-[#05010a] text-white flex items-center justify-center px-6 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight">
            Stop Chasing
            <br />
            Leads. Start
            <br />
            <span className="text-gray-300">Closing Them.</span>
          </h1>

          <p className="text-gray-400 text-base max-w-lg">
            AI-powered outbound calling that works leads at scale, qualifies
            intent in real-time, and either transfers hot prospects to your
            closers instantly or books meetings directly on their calendar.
          </p>

          <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full shadow-xl hover:scale-105 transition">
            Try it now
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative h-[500px] flex items-center justify-center">

          {/* GLOW BACKGROUND */}
          <div className="absolute w-[500px] h-[500px] bg-purple-700/20 blur-[120px] rounded-full" />

          {/* CURVED PATH */}
          <div className="absolute bottom-0 w-[400px] h-[200px] rounded-t-full border-t border-purple-500/30" />

          {/* FLOATING PILLS */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 right-10 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-sm border border-white/10"
          >
            ✨ Your smart scheduling assistant
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-20 right-0 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-sm border border-white/10"
          >
            ✔ Qualified appointment only
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-40 right-16 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full text-sm border border-white/10"
          >
            🚀 Increases efficiency by 80%
          </motion.div>

          {/* CENTER DEVICE */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-[260px] h-[360px] rounded-[40px] bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center"
          >
            <div className="w-[180px] h-[240px] rounded-2xl bg-white/10 flex items-center justify-center shadow-inner">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                ✓
              </div>
            </div>
          </motion.div>

          {/* FLOATING CARDS */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10"
          >
            ✓
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute bottom-28 left-32 w-20 h-20 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10"
          >
            ✓
          </motion.div>
        </div>
      </div>
    </div>
  );
}
