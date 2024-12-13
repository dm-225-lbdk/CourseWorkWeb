import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormStyle.css';

export default function ComputerAdd() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        description: ''
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

        const newComputer = {
            Name: formData.name,
            Price: parseFloat(formData.price),
            Quantity: parseInt(formData.quantity),
            Description: formData.description
        };

        try {
            const response = await fetch('/api/computers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newComputer),
            });

            if (!response.ok) {
                throw new Error('Помилка при додаванні комп’ютера');
            }

            navigate('/computerList');
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Додати новий комп`ютер</h2>
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
                    <label htmlFor="price">Ціна:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantity">Кількість:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Опис:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="form-group">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Завантаження...' : 'Додати комп\'ютер'}
                    </button>
                </div>
            </form>
        </div>
    );
}
