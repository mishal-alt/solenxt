import React from 'react';
import { Sparkles, Zap, Users, ShieldCheck, Footprints } from 'lucide-react';
import { Link } from 'react-router-dom';
// Main, single-file component for the About Page
const About = () => {

    // Data for the Core Values section
    const coreValues = [
        {
            icon: ShieldCheck,
            title: "Authenticity Guaranteed",
            description: "Every pair is meticulously inspected to ensure 100% authenticity. We stand behind our curated collection."
        },
        {
            icon: Sparkles,
            title: "Unrivaled Craftsmanship",
            description: "We partner only with brands dedicated to innovation and the highest standards of material quality and design."
        },
        {
            icon: Users,
            title: "The SOLE NXT Community",
            description: "More than a store, we're a hub for sneaker culture. Join the movement and share your passion."
        },
        {
            icon: Footprints,
            title: "Style Forward",
            description: "We are constantly scanning the horizon for the next trend, bringing you styles before they hit the mainstream."
        },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen pt-15 pb-20 px-6 relative overflow-hidden selection:bg-cyan-500/30">
            {/* Ambient Background Effects */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* Hero Section */}
            <section className="text-center py-20 max-w-7xl mx-auto relative z-10">
                <h1 className="text-5xl md:text-8xl font-thin tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-8 uppercase">
                    OUR <span className="font-black">STORY</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-500 max-w-4xl mx-auto font-light leading-relaxed tracking-wide italic">
                    "We are the curators of tomorrow's footwear, connecting enthusiasts with the rarest, most innovative, and most authentic soles."
                </p>
            </section>

            {/* --- Main Content Section --- */}
            <main className="max-w-7xl mx-auto space-y-32 relative z-10">

                {/* The SOLE NXT Story */}
                <div className="grid md:grid-cols-2 gap-20 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                            The Foundation
                        </div>
                        <h3 className="text-4xl md:text-5xl font-thin text-white leading-tight uppercase">
                            The Genesis of <span className="font-black">Innovation</span>
                        </h3>
                        <div className="space-y-6 text-gray-400 font-light leading-relaxed text-lg">
                            <p>
                                SOLE NXT was founded by a collective of lifelong sneakerheads frustrated by fragmented marketplaces and uncertain authenticity. We saw a future where finding your grail—that perfect, next-level shoe—was seamless, trustworthy, and inspiring.
                            </p>
                            <p>
                                Every product in our collection is hand-selected and verified. Our mission is simple: to honor the legacy of iconic designs while championing the **next era** of footwear innovation.
                            </p>
                        </div>
                    </div>

                    <div className="order-1 md:order-2">
                        <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl -z-10 group-hover:bg-cyan-500/20 transition-colors" />
                            <Zap className="w-16 h-16 text-cyan-500 mb-8 transform group-hover:scale-110 transition-transform" />
                            <p className="text-2xl text-white font-thin italic leading-snug">
                                "The right pair of shoes isn't just an accessory; it's a statement about where you're going next."
                            </p>
                        </div>
                    </div>
                </div>

                {/* Our Core Values Grid */}
                <div>
                    <h3 className="text-3xl font-black text-center mb-16 text-white uppercase tracking-[0.4em]">
                        Core <span className="text-cyan-500">Values</span>
                    </h3>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {coreValues.map((value, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:border-cyan-500/50 hover:bg-white/[0.08] transition-all duration-500 group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                                    <value.icon className="w-7 h-7" />
                                </div>
                                <h4 className="text-lg font-bold mb-4 text-white uppercase tracking-wider">{value.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed font-light">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact/CTA Footer Section */}
                <div className="text-center py-20 bg-white/5 rounded-[4rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)]" />
                    <h3 className="text-4xl md:text-5xl font-thin mb-6 text-white uppercase relative z-10">
                        Ready to Discover Your <span className="font-black">Next Sole?</span>
                    </h3>
                    <p className="text-gray-500 mb-12 max-w-2xl mx-auto font-light tracking-wide relative z-10">
                        Explore our curated collections, dive into the culture, or reach out to our team of dedicated sole experts.
                    </p>
                    <Link to='/product' className="relative z-10">
                        <button className="px-12 py-5 text-sm font-bold tracking-[0.3em] text-black bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-cyan-500 hover:text-white transition-all duration-300 uppercase">
                            Shop The Collection
                        </button>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default About;
