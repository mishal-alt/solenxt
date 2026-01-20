import React from "react";
import video from '../assets/bg1.mp4'
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom'

const HeroSection = () => {
    return (
        <section className="relative w-full h-[100vh] overflow-hidden flex items-center justify-center pt-10">
            {/* Dark Video Background with Premium Overlay */}
            <div className="absolute inset-0 z-0 ">
                <video
                    src={video}
                    className="w-full h-full object-cover grayscale brightness-50"
                    autoPlay
                    loop
                    muted
                    playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.1)_0%,_transparent_70%)]" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-fade-in">
                    The Next Evolution in Footwear
                </div>

                <h1 className="text-6xl md:text-9xl font-thin tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-12 uppercase leading-none">
                    STEP INTO <br />
                    <span className="font-black tracking-normal text-white">THE FUTURE</span>
                </h1>

                <p className="max-w-xl mx-auto text-gray-400 text-lg md:text-xl font-light leading-relaxed tracking-wide mb-12 italic">
                    "Curating the rarest soles for those who define what's coming next."
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link to='/product'>
                        <button className="group relative px-12 py-5 bg-white text-black font-bold text-xs uppercase tracking-[0.3em] rounded-full overflow-hidden transition-all duration-500 hover:bg-cyan-500 hover:text-white">
                            <span className="relative z-10 flex items-center gap-2">
                                Explore Collection
                                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </button>
                    </Link>
                </div>
            </div>

         
        </section>
    );
};

export default HeroSection;
