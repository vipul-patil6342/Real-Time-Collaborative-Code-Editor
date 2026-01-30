import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, loginUser } from '../features/auth/auth.thunk';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '../utils/toast';

const LoginForm = () => {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");
    const { loading, error } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!identity) {
            setValidationError("Email or Username is required");
            return;
        }

        if (!password) {
            setValidationError("Password is required");
            return;
        }

        const userData = {
            identity: identity,
            password: password
        }

        const resultAction = await dispatch(loginUser(userData));
        if (loginUser.fulfilled.match(resultAction)) {
            showSuccess("Welcome back to CodeSync!");
        }
    };

    return (
        <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-1 items-center justify-center px-6 py-10">
            {/* Animated background linear orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-md relative z-10 animate-fade-in">
                {/* Card */}
                <div className="bg-linear-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-slate-400">Sign in to your CodeSync account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email or Username Field */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email or Username</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    value={identity}
                                    onChange={(e) => setIdentity(e.target.value)}
                                    placeholder="Username or Email"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end text-sm">
                            <span className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer" onClick={() => navigate("/reset-password")}>
                                Forgot password?
                            </span>
                        </div>

                        {/* Error */}
                        {(error || validationError) &&
                            <div className='flex items-center justify-center'>
                                <p className='text-sm text-center font-medium text-red-500'>{error || validationError}</p>
                            </div>
                        }

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold cursor-pointer hover:shadow-md hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-slate-400 mt-6">
                        Don't have an account?{' '}
                        <span className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer" onClick={() => navigate("/signup")}>
                            Sign up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;