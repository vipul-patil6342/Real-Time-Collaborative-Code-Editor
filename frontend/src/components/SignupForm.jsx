import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, signupUser } from '../features/auth/auth.thunk';
import { resetError } from '../features/auth/auth.slice';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '../utils/toast';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState("");
    const { loading, error } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {        
        dispatch(resetError());
    }, [dispatch]);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        dispatch(resetError());
        setValidationError("");
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        dispatch(resetError());
        setValidationError("");

        if(formData.username.length > 15){
            setValidationError("Username must be 15 characters or less");
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (!regex.test(formData.password)) {
            setValidationError("Password must contain uppercase, lowercase, number, and special character");
            return;
        }

        if (formData.password.length < 8) {
            setValidationError("Password must be 8 characters long");
            return;
        }

        if (formData.password.length > 64) {
            setValidationError("Password must not exceed 64 characters");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password
        }

        const resultAction = await dispatch(signupUser(userData));
        if (signupUser.fulfilled.match(resultAction)) {
            showSuccess("We've sent an OTP to your email address");
            dispatch(sendOtp({ email: userData.email }));
            navigate("/verify");
        }

    };

    return (
        <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-1 items-center justify-center px-6 py-12">

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-linear-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1">Create Account</h1>
                        <p className="text-sm text-slate-400">Join CodeSync and start collaborating</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {/* Username Field */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Username</label>
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name='username'
                                    type="text"
                                    autoComplete='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="john_dev"
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name='email'
                                    type="email"
                                    autoComplete='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete='new-password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name='confirmPassword'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete='new-password'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {(error || validationError) &&
                            <div className='flex justify-center items-center'>
                                <p className='text-sm text-center font-medium text-red-500'>{error || validationError}</p>
                            </div>
                        }

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-sm cursor-pointer hover:shadow-md hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-slate-400 text-sm mt-4">
                        Already have an account?{' '}
                        <span className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer" onClick={() => navigate("/login")}>
                            Sign in
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;