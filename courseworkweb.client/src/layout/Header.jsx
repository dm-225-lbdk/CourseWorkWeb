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

    const handleLogInClick = () => {
        navigate('/login');
    };

    const handleOrdersInfoInClick = () => {
        navigate('/ordersinfo');
    };

    const handleUserInfoClick = () => {
        navigate('/userinfo');
    };

    const handleComputerAddClick = () => {
        navigate('/computerAdd');
    };

    const handleDeliveryAddClick = () => {
        navigate('/deliveryAdd');
    };

    const handleRolesClick = () => {
        navigate('/roles');
    };

    return (
        <header className="header">
            <h1 className="logo">Computer Store</h1>
            <nav className="nav">
                {user ? (
                        <div className="button-container">
                            <button onClick={() => navigate(-1)} className="nav-button">Go Back</button>
                            <button onClick={handleOrdersInfoInClick} className="nav-button">Orders Info</button>
                            <button onClick={handleUserInfoClick} className="nav-button">User Info</button>
                            {(user.Roles.includes('Admin') || user.Roles.includes('Deliverer')) && (
                                <button onClick={handleDeliveryAddClick} className="nav-button">Add Delivery</button>
                            )}
                            {user.Roles.includes('Admin') && (
                                <button onClick={handleComputerAddClick} className="nav-button">Add Computer</button>
                            )}
                            {user.Roles.includes('Admin') && (
                            <button onClick={handleRolesClick} className="nav-button">Roles</button>
                            )}
                            <button onClick={handleLogoutClick} className="nav-button">Logout</button>
                        </div>
                ) : (
                    <div className="user-info">
                        <span>Please log in to continue</span>
                        <button onClick={() => navigate(-1)} className="nav-button">Go Back</button>
                        <button onClick={handleLogInClick} className="nav-button">Log In</button>
                    </div>
                )}
            </nav>
        </header>
    );
}
