import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormStyle.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        wallet: '',
        address: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleRegister = async () => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert('Registration successful!');
                navigate('/login');
            } else {
                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Регістрація провалена.');
                } else {
                    const errorText = await response.text();
                    setErrorMessage(errorText || 'Регістрація провалена.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Failed to connect to the server.');
        }
    };

    return (
        <div className="form-container">
            <h2>Register</h2>
            <form onSubmit={(e) => e.preventDefault()} className="register-form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

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
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="wallet">Wallet Cost:</label>
                    <input
                        type="number"
                        id="wallet"
                        name="wallet"
                        placeholder="Wallet"
                        value={formData.wallet}
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

                <button onClick={handleRegister}>Register</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}
