import luxuryBg from '../assets/luxury_bg.png';
import archiveBg from '../assets/archive_bg.png';
import catMen from '../assets/cat-men.png';
import catWomen from '../assets/cat-women.png';
import video from '../assets/bg1.mp4';
import { Link } from 'react-router-dom';
import HeroSection from '../comp/HeroSection';
import { TrendingUp, ShieldCheck, Zap, ArrowRight, Layers, Globe } from 'lucide-react';
import heroShoe from '../assets/hero-shoe.png';

function Home() {
    return (
        <div className="bg-neutral-950 min-h-screen relative overflow-hidden selection:bg-cyan-500/30">
            {/* Global Ambient Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* Hero Section */}
            <HeroSection />

            {/* Featured Categories / Collections - Hero Style */}
            <section className="relative min-h-screen flex items-center overflow-hidden py-32">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src={luxuryBg} alt="Luxury Background" className="w-full h-full object-cover grayscale brightness-[0.3]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-transparent to-neutral-950" />
                </div>

                <div className="relative z-10 container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
                        <div className="space-y-4">
                            <div className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em]">Curated Selections</div>
                            <h2 className="text-4xl md:text-5xl font-thin text-white uppercase tracking-wider">
                                Elite <span className="font-black">Collections</span>
                            </h2>
                        </div>
                        <Link to="/product" className="group flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white transition-colors">
                            View All Drops <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Men's Pro", label: "Performance & Style", icon: Zap, link: "/product", bg: catMen },
                            { title: "Women's Elite", label: "Grace & Power", icon: TrendingUp, link: "/product", bg: catWomen },
                            { title: "Limited Edition", label: "The Rare Finds", icon: ShieldCheck, link: "/product", bg: luxuryBg }
                        ].map((item, i) => (
                            <Link to={item.link} key={i} className="group relative block aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/10 backdrop-blur-xl transition-all duration-700 hover:border-cyan-500/50">
                                {/* Card Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <img src={item.bg} alt={item.title} className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                                    <div>
                                        <item.icon className="w-12 h-12 text-cyan-500 mb-8 transform group-hover:scale-110 transition-transform" />
                                        <div className="space-y-4">
                                            <h3 className="text-3xl font-thin text-white uppercase leading-tight">
                                                {item.title.split(' ')[0]} <br />
                                                <span className="font-black">{item.title.split(' ')[1]}</span>
                                            </h3>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{item.label}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Luxury Standards - Hero Style */}
            <section className="relative min-h-screen flex items-center py-32 overflow-hidden">
                {/* Background Image with Dark Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src={archiveBg} alt="Archive Background" className="w-full h-full object-cover grayscale brightness-[0.2]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <div className="text-center mb-24 space-y-4">
                        <div className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em]">The SoleNxt Edge</div>
                        <h2 className="text-4xl md:text-6xl font-thin text-white uppercase tracking-[0.2em]">
                            Luxury <span className="font-black">Standards</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                        {[
                            { icon: ShieldCheck, title: "Verified Source", desc: "Every sole is multi-point inspected by our elite verification network." },
                            { icon: Globe, title: "Global Network", desc: "Sourcing rarest drops from limited releases across the globe." },
                            { icon: Layers, title: "Archive Grade", desc: "Access to deadstock and archive collections unavailable elsewhere." }
                        ].map((item, i) => (
                            <div key={i} className="text-center space-y-8 group">
                                <div className="mx-auto w-24 h-24 rounded-[2rem] bg-white/5 backdrop-blur-xl flex items-center justify-center text-cyan-500 shadow-2xl border border-white/10 group-hover:border-cyan-500/50 transition-all duration-500 group-hover:scale-110">
                                    <item.icon className="w-10 h-10" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold text-white uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-gray-400 font-light leading-relaxed text-sm max-w-[280px] mx-auto italic opacity-70 group-hover:opacity-100 transition-opacity">
                                        "{item.desc}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Drop - Hero Style with Image */}
            <section className="relative min-h-[90vh] flex items-center justify-center py-40 px-6 text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src={heroShoe} alt="The Grail" className="w-full h-full object-cover grayscale brightness-[0.2]" />
                    <div className="absolute inset-0 bg-neutral-950/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950" />
                </div>

                <div className="relative z-10">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/20 text-cyan-500/50 text-[10px] font-bold uppercase tracking-[0.4em] mb-12">
                        The Final Frontier
                    </div>
                    <h2 className="text-5xl md:text-9xl font-thin text-white uppercase tracking-[0.3em] mb-12 leading-none">
                        YOUR NEXT <br />
                        <span className="font-black tracking-normal">GRAIL AWAITS</span>
                    </h2>
                    <Link to="/product">
                        <button className="group relative px-16 py-6 bg-white text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-full overflow-hidden hover:bg-cyan-500 hover:text-white transition-all duration-500 shadow-2xl">
                            <span className="relative z-10 flex items-center justify-center gap-4">
                                Enter The Forge
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                            </span>
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;