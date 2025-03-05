import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stuff/AuthContext';
import '../styles/HeaderStyle.css';

export default function Header() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogoutClick = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <h1 className="logo">Computer Store</h1>
            <nav className="nav">
                {user ? (
                    <div className="button-container">
                        <button onClick={() => navigate(-1)} className="nav-button">Go Back</button>
                        <button onClick={() => navigate('/ordersinfo')} className="nav-button">Orders Info</button>
                        <button onClick={() => navigate('/userinfo')} className="nav-button">User Info</button>
                        <button onClick={() => navigate('/computerList')} className="nav-button">Computer List</button>
                        {(user.Roles?.includes('Admin') || user.Roles?.includes('Deliverer')) && (
                            <button onClick={() => navigate('/deliveryAdd')} className="nav-button">Add Delivery</button>
                        )}
                        {user.Roles?.includes('Admin') && (
                            <>
                                <button onClick={() => navigate('/computerAdd')} className="nav-button">Add Computer</button>
                                <button onClick={() => navigate('/roles')} className="nav-button">Roles</button>
                            </>
                        )}
                        <button onClick={handleLogoutClick} className="nav-button">Logout</button>
                    </div>
                ) : (
                    <div className="user-info">
                        <div>Please log in to continue</div>
                        <button onClick={() => navigate(-1)} className="nav-button">Go Back</button>
                        <button onClick={() => navigate('/login')} className="nav-button">Log In</button>
                    </div>
                )}
            </nav>
        </header>
    );
}
