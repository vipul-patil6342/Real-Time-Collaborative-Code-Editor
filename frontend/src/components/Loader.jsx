import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 min-h-[calc(100vh-80px)]">
            {/* Main Loader */}
            <div className="relative w-24 h-24">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-blue-500 rounded-full animate-spin"></div>

                {/* Middle rotating ring (counter-clockwise) */}
                <div className="absolute inset-2 border-4 border-transparent border-b-purple-500 border-l-cyan-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>

                {/* Inner pulsing dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-linear-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
                </div>
            </div>

            {/* Loading text */}
            <div className="text-center">
                <p className="text-lg font-semibold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Loading
                    <span className="inline-block ml-1">
                        <span className="animate-bounce inline-block" style={{ animationDelay: '0s' }}>.</span>
                        <span className="animate-bounce inline-block" style={{ animationDelay: '0.2s' }}>.</span>
                        <span className="animate-bounce inline-block" style={{ animationDelay: '0.4s' }}>.</span>
                    </span>
                </p>
                <p className="text-slate-400 text-sm mt-2">Please wait a moment</p>
            </div>
        </div>
    );
};

export default Loader;