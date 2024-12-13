import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stuff/AuthContext';

export default function UserInfo() {
    const { user } = useAuth();

    const navigate = useNavigate();

    const handleLogInClick = () => {
        navigate('/login');
    };

    return (
        <div>
            <h1>Інформація користувача</h1>
            {user ? (
                <div>
                    <p><strong>ID:</strong> {user.ID}</p>
                    <p><strong>Username:</strong> {user.Username}</p>
                    <p><strong>Email:</strong> {user.Email}</p>
                    <p><strong>Address:</strong> {user.Address}</p>
                    <p><strong>Wallet:</strong> ${user.Wallet.toFixed(2)}</p>
                    <p><strong>Roles:</strong> {user.Roles.join(', ')}</p>
                </div>
            ) : (
                    <div>
                        <span>Please log in to continue</span>
                        <button onClick={handleLogInClick}>Log In</button>
                    </div>
            )}
        </div>
    );
}

