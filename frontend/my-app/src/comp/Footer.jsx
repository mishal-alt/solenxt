import React from "react";
import { Instagram, Twitter, Facebook, ArrowRight, Sparkles, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-neutral-950 border-t border-white/5 pt-32 pb-12 overflow-hidden selection:bg-cyan-500/30">
      {/* Ambient Background Effects */}
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          {/* Brand Section */}
          <div className="md:col-span-4 space-y-8">
            <div className="group cursor-default">
              <h2 className="text-3xl font-thin tracking-[0.2em] text-white uppercase">
                SOLE <span className="font-black text-gray-500 group-hover:text-cyan-500 transition-colors duration-500 tracking-normal italic">NXT</span>
              </h2>
              <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em] mt-2">The Final Frontier</p>
            </div>
            <p className="text-gray-500 text-sm font-light leading-relaxed italic max-w-sm">
              "Archiving the rarest grails and performance elites for those who recognize the edge of innovation."
            </p>
            <div className="flex gap-6">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-500 group">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white border-b border-white/10 pb-4">Selection</h4>
              <ul className="space-y-4">
                {['Men\'s Pro', 'Women\'s Elite', 'Limited Edition', 'New Drops'].map((item) => (
                  <li key={item}>
                    <Link to="/product" className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-500 transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-cyan-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white border-b border-white/10 pb-4">Archive</h4>
              <ul className="space-y-4">
                {['About Us', 'Verification', 'Contact', 'Terms'].map((item) => (
                  <li key={item}>
                    <Link to={item === 'About Us' ? '/about' : item === 'Contact' ? '/contact' : '/'} className="text-gray-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-500 transition-colors flex items-center gap-2 group">
                      <div className="w-1 h-1 bg-purple-500 rounded-full scale-0 group-hover:scale-100 transition-transform" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter / Priority Access */}
          <div className="md:col-span-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <Sparkles className="w-3 h-3" />
                Priority Access
              </div>
              <h4 className="text-xl font-thin text-white uppercase tracking-wider">Join The <span className="font-black italic">Archive</span></h4>
              <p className="text-gray-500 text-xs font-light italic">Secure your spot for the next limited drop.</p>
            </div>

            <div className="relative group/input">
              <input
                type="email"
                placeholder="ACCESS@DOMAIN.COM"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white placeholder:text-gray-700 focus:outline-none focus:border-cyan-500/50 backdrop-blur-xl transition-all"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all duration-500 flex items-center gap-2 group/btn">
                Enter
                <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.5em]">
            © {new Date().getFullYear()} SOLE NXT ARCHIVE — ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8 text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Order Tracking</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;