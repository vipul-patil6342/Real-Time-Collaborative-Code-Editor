import React, { useState, useRef, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '../features/auth/auth.thunk';
import { useNavigate } from 'react-router-dom';
import { showSuccess } from '../utils/toast';

const OTPPage = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [validationError, setValidationError] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const { loading, error, email } = useSelector(state => state.auth);
    const inputRefs = useRef([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    console.log(email)

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setValidationError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        pastedData.split('').forEach((digit, index) => {
            if (index < 6) newOtp[index] = digit;
        });
        setOtp(newOtp);
        if (pastedData.length === 6) {
            inputRefs.current[5]?.blur();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const otpString = otp.join('');

        if (otpString.length !== 6) {
            setValidationError('Please enter all 6 digits');
            return;
        }

        const resultAction = await dispatch(verifyOtp({ email, otp: otpString }));
        if (verifyOtp.fulfilled.match(resultAction)) {
            showSuccess("Account created! Please log in to continue.");
            navigate("/login");           
        }
    };

    const handleResend = async () => {
        setResendTimer(60);
        setValidationError('');
        await dispatch(sendOtp({ email }));
        setOtp(['', '', '', '', '', '']);
    };

    return (
        <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-1 items-center justify-center px-6 py-12">

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-linear-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-linear-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                <Mail size={24} />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Verify Email</h1>
                        <p className="text-sm text-slate-400">
                            We've sent a 6-digit code to your email. Enter it below.
                        </p>
                    </div>

                    {/* Error Message */}
                    {(validationError || error) && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-400 text-sm">{validationError || error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* OTP Input Fields */}
                        <div>
                            <label className="block text-xs font-medium mb-4 text-center">Enter OTP</label>
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(ref) => (inputRefs.current[index] = ref)}
                                        type="text"
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                        onPaste={handlePaste}
                                        maxLength="1"
                                        className="w-10 h-10 md:w-12 md:h-12 text-center text-xl font-semibold bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                                        inputMode="numeric"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || otp.some(digit => !digit)}
                            className="w-full py-2 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-sm cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Verifying...
                                </>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>
                    </form>

                    {/* Resend OTP Section */}
                    <div className="mt-6 text-center border-t border-slate-700 pt-6">
                        <p className="text-sm text-slate-400 mb-3">Didn't receive the code?</p>
                        <button
                            onClick={handleResend}
                            disabled={resendTimer > 0}
                            className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendTimer > 0 ? (
                                <>Resend OTP in {resendTimer}s</>
                            ) : (
                                'Resend OTP'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPPage;