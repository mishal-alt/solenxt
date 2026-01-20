import React, { useState } from 'react';
import { Mail, Phone, MapPin, Search, Heart, User } from 'lucide-react';

// Mock data for navigation links
const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Men', href: '#' },
    { name: 'Women', href: '#' },
    { name: 'Sale', href: '#' },
];

// Mock component for the site header
const Header = () => (
    <header className="bg-black text-white p-4 shadow-lg sticky top-0 z-10 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}    
            <div className="text-2xl font-extrabold tracking-wider">
                <span className="text-white">SOLE</span><span className="text-gray-400">NXT</span>
            </div>

            {/* Navigation (Hidden on small screens) */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
                {navLinks.map((link) => (
                    <a key={link.name} href={link.href} className="hover:text-gray-400 transition duration-150">
                        {link.name}
                    </a>
                ))}
                {/* Active link for Contact page is simulated here */}
                <a href="#" className="text-gray-400">
                    Contact
                </a>
            </nav>

            {/* Actions and Search */}
            <div className="flex items-center space-x-4">
                <div className="relative hidden lg:block">
                    <input
                        type="search"
                        placeholder="Search for shoes..."
                        className="w-64 p-2 pl-10 rounded-full bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                </div>

                <div className="flex space-x-4">
                    <button className="p-2 hover:text-gray-400 transition duration-150 rounded-full">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:text-gray-400 transition duration-150 rounded-full">
                        <User className="w-5 h-5" />
                    </button>
                </div>

                {/* Login Button (Matching style from image) */}
                <button className="bg-white text-black font-semibold py-2 px-4 rounded-xl hover:bg-gray-200 transition duration-150 text-sm hidden sm:block">
                    Login
                </button>
            </div>
        </div>
    </header>
);

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'loading'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('loading');

        // --- Mock API Call Simulation ---
        // In a real application, you would make a fetch or axios call here
        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            console.log('Form Submitted:', formData);
            setSubmissionStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } catch (error) {
            console.error('Submission failed:', error);
            setSubmissionStatus('error');
        }
        // --- End Mock API Call Simulation ---
    };

    const contactInfo = [
        { icon: Mail, title: 'Email Us', detail: 'support@solenxt.com' },
        { icon: Phone, title: 'Call Us', detail: '+1 (555) 123-4567' },
        { icon: MapPin, title: 'Our Location', detail: '123 Sneaker St, Cityville, CA 90210' },
    ];

    const InputField = ({ label, name, type = 'text', required = true }) => (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-gray-400 focus:outline-none transition duration-150"
            />
        </div>
    );

    const TextAreaField = ({ label, name, required = true }) => (
        <div className="mb-6">
            <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                id={name}
                name={name}
                rows="4"
                value={formData[name]}
                onChange={handleChange}
                required={required}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 text-white rounded-xl focus:border-gray-400 focus:outline-none transition duration-150 resize-none"
            ></textarea>
        </div>
    );

    return (
        <div className="bg-neutral-950 min-h-screen pt-40 pb-20 px-6 relative overflow-hidden selection:bg-cyan-500/30">
            {/* Ambient Background Effects */}
            <div className="fixed top-0 right-1/4 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[800px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <main className="max-w-7xl mx-auto relative z-10">

                {/* Title Section */}
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-8xl font-thin tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-8 uppercase">
                        GET IN <span className="font-black">TOUCH</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed tracking-wide italic">
                        Whether you have a question about an exclusive drop or just want to join the network, our team is ready.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Contact Information Cards (Left) */}
                    <div className="lg:col-span-1 space-y-8">
                        {contactInfo.map((item) => (
                            <div
                                key={item.title}
                                className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-cyan-500/50 hover:bg-white/[0.08] group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wider">{item.title}</h3>
                                <p className="text-gray-500 font-light">{item.detail}</p>
                            </div>
                        ))}

                        {/* Map Placeholder */}
                        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[3rem] shadow-2xl h-80 border border-white/10 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.22743588938!2d-122.41941648468166!3d37.7749299797587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d4f6c44b%3A0x6b772b1a039d91f!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1686940000000!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0, borderRadius: '2rem', filter: 'grayscale(1) invert(1) brightness(0.8)' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Our Location Map"
                            ></iframe>
                        </div>
                    </div>

                    {/* Contact Form (Right) */}
                    <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[4rem] shadow-2xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-3xl -z-10" />

                        <h2 className="text-4xl font-thin text-white mb-12 uppercase">
                            Send Us a <span className="font-black tracking-tight">Transmission</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Identity</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300 placeholder-gray-700"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Portal (Email)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300 placeholder-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Order #882 / Partnership Inquiry"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300 placeholder-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message Content</label>
                                <textarea
                                    name="message"
                                    rows="6"
                                    placeholder="Write your transmission here..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white rounded-3xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300 resize-none placeholder-gray-700 font-light"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-white text-black font-bold py-5 mt-6 rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:bg-cyan-500 hover:text-white transition-all duration-500 uppercase tracking-[0.3em] text-xs disabled:opacity-30"
                                disabled={submissionStatus === 'loading'}
                            >
                                {submissionStatus === 'loading' ? 'Transmitting...' : 'Send Transmission'}
                            </button>

                            {submissionStatus === 'success' && (
                                <p className="mt-6 text-cyan-400 text-center text-xs font-bold uppercase tracking-widest">
                                    Transmission Received. We will respond shortly.
                                </p>
                            )}
                            {submissionStatus === 'error' && (
                                <p className="mt-6 text-rose-400 text-center text-xs font-bold uppercase tracking-widest">
                                    Connection Failure. Please attempt again.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};
const Contact = () => <ContactPage />;
export default Contact;