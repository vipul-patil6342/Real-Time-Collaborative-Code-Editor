import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {

    const { isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const handleNavigate = () => {
        if (isAuthenticated) {
            
        } else {
            navigate("/signup");
        }
    }

    return (
        <nav className="px-4 md:px-6 py-3 md:py-4 flex justify-between items-center backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
            <div className="flex items-center gap-1">
                <img
                    src="/codesynclogo.png"
                    alt="CodeSync"
                    className='w-10 h-10'
                />
                {/* Responsive Text Size */}
                <span className="text-lg md:text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                    CodeSync
                </span>
            </div>

            <div className="flex gap-2 md:gap-4 items-center">
                {/* Smaller font and padding on mobile */}
                {!isAuthenticated &&
                    <button className="px-2 md:px-4 py-2 text-sm md:text-base text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap" onClick={() => navigate("/login")}>
                        Sign In
                    </button>
                }
                <button className="px-3 md:px-6 py-1.5 md:py-2 text-sm md:text-base bg-linear-to-r from-cyan-500 to-blue-500 rounded-md md:rounded-lg font-semibold text-white transition-all cursor-pointer whitespace-nowrap" onClick={handleNavigate}>
                    Get Started
                </button>
            </div>
        </nav>
    );
};

export default Navbar;