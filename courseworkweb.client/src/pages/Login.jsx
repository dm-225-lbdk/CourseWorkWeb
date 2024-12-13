import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stuff/AuthContext';
import '../styles/FormStyle.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                login(data);
                alert('Login successful!');
                navigate('/computerList');
            } else {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Неправильні облік-дані.');
                } else {
                    const errorText = await response.text();
                    setErrorMessage(errorText || 'Логування провалено.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Failed to connect to the server.');
        }
    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={(e) => e.preventDefault()} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <button onClick={handleLogin}>Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}
