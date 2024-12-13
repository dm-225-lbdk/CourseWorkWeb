import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stuff/AuthContext';

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();



    navigate('/computerList');

    return (
        <div>
            <h1>Welcome to the Application</h1>
            {user ? (
                <div>
                    <p>Welcome, {user.Username}!</p>
                    <button onClick={() => navigate('/computerList')}>
                        Store
                    </button>
                </div>
            ) : (
                <div>
                    <button onClick={() => navigate('/register')}>
                        Register
                    </button>
                    <button onClick={() => navigate('/login')}>
                        Login
                    </button>
                </div>
            )}
        </div>
    );
}