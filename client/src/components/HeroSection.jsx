import NavigationBar from "./NavigationBar"
import TypewriterComponent from "./Typewritter"
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function HeroSection(){
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleGetStarted = () => {
        if (isLoggedIn) {
            navigate('/chat');
        } else {
            alert('Please login to continue.');
        }
    };
    return(
        <div>
        <TypewriterComponent/>
            <div className="flex justify-center">
                <button 
                  className="bg-yellow-400 text-black px-6 py-3 mt-10 mb-50 border border-white font-mono text-xl hover:scale-95 transition duration-200"
                  onClick={handleGetStarted}
                >
                  Get Started
                </button>
            </div>
        </div>
    )
}