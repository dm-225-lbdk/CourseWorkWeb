import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormStyle.css';

export default function DeliveryAdd() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newDelivery = {
            Name: formData.name,
            Address: formData.address,
            PhoneNumber: formData.phoneNumber
        };

        try {
            const response = await fetch('/api/deliveries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newDelivery),
            });

            if (!response.ok) {
                throw new Error('Помилка при додаванні доставки');
            }

            navigate(-1);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Додати нову доставку</h2>
            <form onSubmit={handleSubmit} className="form-group">
                <div className="form-group">
                    <label htmlFor="name">Назва:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="address">Адреса:</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phoneNumber">Номер телефону:</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="form-group">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Завантаження...' : 'Додати доставку'}
                    </button>
                </div>
            </form>
        </div>
    );
}
