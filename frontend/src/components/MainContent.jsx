import React from 'react';
import { ChevronRight, Zap, Users, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainContent = () => {

    const navigate = useNavigate();

    return (
        <div className="relative z-10">
            {/* Hero Section */}
            <section className="flex flex-col justify-center px-6 py-20 max-w-6xl mx-auto w-full min-h-[calc(100vh-80px)] items-center">
                <div className="space-y-8 animate-fade-in">
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                            Code Together,
                            <span className="block bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                In Real-Time
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl">
                            Collaborate with your team on code instantly. No delays, no friction. Just pure development flow with live cursors, instant synchronization, and intelligent conflict resolution.
                        </p>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button className="group px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl cursor-pointer font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:scale-105 flex items-center gap-2" onClick={() => navigate("/login")}>
                            Start Coding Now
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Code Editor Preview */}
                <div className="mt-20 relative group w-full">
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative bg-slate-950 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                        <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="p-6 font-mono text-sm space-y-2 overflow-auto max-h-96">
                            <div className="text-slate-500">// Collaborative editing in action</div>
                            <div><span className="text-purple-400">function</span> <span className="text-cyan-400">buildTogether</span>() {'{'}</div>
                            <div className="ml-4">
                                <span className="text-slate-500">// Sarah's cursor</span>
                                <div className="flex items-center gap-2 mt-1 mb-1">
                                    <div className="w-2 h-6 bg-pink-500 animate-pulse"></div>
                                    <span className="text-slate-400">const data = <span className="text-green-400">fetchData</span>()</span>
                                </div>
                            </div>
                            <div className="ml-4">
                                <span className="text-slate-500">// Your cursor</span>
                                <div className="flex items-center gap-2 mt-1 mb-1">
                                    <div className="w-2 h-6 bg-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                    <span className="text-slate-400"><span className="text-purple-400">return</span> <span className="text-green-400">processData</span>(data)</span>
                                </div>
                            </div>
                            <div>{'}'}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-20 max-w-6xl mx-auto w-full">
                <h2 className="text-4xl font-bold text-center mb-16">Why Choose CodeSync?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Zap,
                            title: 'Lightning Fast',
                            description: 'Sub-millisecond synchronization with operational transformation ensures your team stays in perfect sync.'
                        },
                        {
                            icon: Users,
                            title: 'See Everyone',
                            description: 'Live cursor positions, selections, and user avatars show you exactly what your teammates are doing.'
                        },
                        {
                            icon: Lock,
                            title: 'Secure & Private',
                            description: 'Enterprise-grade encryption keeps your code safe. Self-hosted options available.'
                        }
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 bg-slate-800/40 border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-all hover:bg-slate-800/60 cursor-pointer"
                        >
                            <feature.icon className="w-12 h-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-slate-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer CTA */}
            <section className="px-6 py-20 max-w-4xl mx-auto w-full text-center border-t border-slate-700/50">
                <h2 className="text-3xl font-bold mb-6">Ready to collaborate?</h2>
                <p className="text-slate-300 mb-8 text-lg">Join thousands of developers building together</p>
                <button className="px-10 py-4 bg-linear-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold cursor-pointer text-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all hover:scale-105" onClick={() => navigate("/signup")}>
                    Create Free Account
                </button>
            </section>
        </div>
    );
};

export default MainContent;