import { useEffect, useState } from "react";
import { Eye, EyeOff, AlertCircle, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../features/auth/auth.thunk";
import { showSuccess } from "../utils/toast";
import { clearSuccessMessage } from "../features/auth/auth.slice";

const PasswordResetPage = () => {

    const { loading, successMessage, error } = useSelector(state => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formEmail, setFormEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [sendTimer, setSendTimer] = useState(0);

    useEffect(() => {
        if (sendTimer > 0) {
            const timer = setTimeout(() => setSendTimer(sendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [sendTimer]);

    useEffect(() => {
        dispatch(clearSuccessMessage());
    }, [navigate]);

    const handleSendOTP = (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formEmail || !emailRegex.test(formEmail)) {
            setValidationError("Please enter a valid email");
            return;
        }
        dispatch(forgotPassword({ email: formEmail }));
        setSendTimer(60);
        setValidationError("");
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (!formEmail || !emailRegex.test(formEmail)) {
            setValidationError("Please enter a valid email");
            return false;
        }

        if (otp.length !== 6) {
            setValidationError("OTP must be 6 digits");
            return false;
        }

        if (!passwordRegex.test(password)) {
            setValidationError("Password must contain uppercase, lowercase, number, and special character");
            return false;
        }

        if (password.length < 8) {
            setValidationError("Password must be at least 8 characters");
            return false;
        }

        if (password.length > 64) {
            setValidationError("Password must not exceed 64 characters");
            return false;
        }

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return false;
        }

        setValidationError("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const resultAction = await dispatch(resetPassword({
            email: formEmail,
            otp,
            newPassword: password
        }));

        if (resetPassword.fulfilled.match(resultAction)) {
            setFormEmail("");
            setOtp("");
            setPassword("");
            setConfirmPassword("");
            showSuccess("Password changed successfully. Redirecting to login...");
            navigate("/login");
        } else {
            setValidationError('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-1 items-center justify-center px-6 py-6">

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-linear-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl p-6 backdrop-blur-sm">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-1">Reset Password</h1>
                        <p className="text-sm text-slate-400">
                            Enter your email to receive an OTP, verify the code, and set your new password.
                        </p>
                    </div>

                    {/* Backend Error */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
                            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Form Error */}
                    {validationError && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
                            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{validationError}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-3">
                            <AlertCircle size={18} className="text-green-400 shrink-0 mt-0.5" />
                            <p className="text-green-400 text-sm">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-medium mb-1">Email</label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    placeholder="Enter Your Email"
                                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
                                    required
                                />
                                <button
                                    onClick={handleSendOTP}
                                    disabled={sendTimer > 0}
                                    className="px-3 py-2 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-sm cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    {sendTimer > 0 ? `${sendTimer}s` : 'Send'}
                                </button>
                            </div>
                        </div>

                        {/* OTP Field */}
                        <div>
                            <label className="block text-xs font-medium mb-1">OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                }
                                placeholder="6-digit OTP"
                                maxLength="6"
                                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm text-center tracking-widest"
                                required
                            />
                            <p className="text-xs text-slate-500 mt-1">{otp.length}/6 digits</p>
                        </div>

                        {/* New Password Field */}
                        <div>
                            <label className="block text-xs font-medium mb-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Minimum 8 characters"
                                    className="w-full pl-4 pr-10 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
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
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    className="w-full pl-4 pr-10 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm"
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-sm cursor-pointer hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default PasswordResetPage;