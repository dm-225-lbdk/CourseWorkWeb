import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stuff/AuthContext';

export default function Home() {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <main>
            <h1>Welcome to the Application</h1>
            {user ? (
                <>
                    <p>Welcome, {user.Username}!</p>
                    <button type="button" onClick={() => navigate('/computerList')}>
                        Store
                    </button>
                </>
            ) : (
                <>
                    <button type="button" onClick={() => navigate('/register')}>
                        Register
                    </button>
                    <button type="button" onClick={() => navigate('/login')}>
                        Login
                    </button>
                </>
            )}
        </main>
    );
}
