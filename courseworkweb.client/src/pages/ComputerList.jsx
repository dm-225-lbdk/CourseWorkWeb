import { useState, useEffect } from 'react';
import { useAuth } from '../stuff/AuthContext';
import '../styles/ComputerListStyle.css';
import computer1 from '../placeholders/computer1.png';
import computer2 from '../placeholders/computer2.png';
import computer3 from '../placeholders/computer3.png';
import computer4 from '../placeholders/computer4.png';

const placeholderImages = [computer1, computer2, computer3, computer4];

export default function ComputerList() {
    const [computers, setComputers] = useState([]);
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const [reservedChanges, setReservedChanges] = useState({});
    const [quantities, setQuantities] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        fetch('/api/computers')
            .then(response => response.json())
            .then(data => {
                setComputers(data);
                const initialReservedChanges = {};
                const initialQuantities = {};
                data.forEach(computer => {
                    initialReservedChanges[computer.ID] = false;
                    initialQuantities[computer.ID] = 1;
                });
                setReservedChanges(initialReservedChanges);
                setQuantities(initialQuantities);
                setLoading(false);
            })
            .catch(error => {
                console.error('Помилка фетчу комп’ютерів:', error);
                setLoading(false);
            });

        fetch('/api/deliveries')
            .then(response => response.json())
            .then(data => setDeliveryOptions(data))
            .catch(error => console.error('Помилка фетчу доставок:', error));
    }, []);

    const handleReserveChange = id => {
        setReservedChanges(prevChanges => ({
            ...prevChanges,
            [id]: !prevChanges[id],
        }));
    };

    const handleQuantityChange = (id, value) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [id]: value,
        }));
    };

    const handlePlaceOrder = () => {
        const orderDetails = Object.keys(reservedChanges)
            .filter(key => reservedChanges[key] && quantities[key] > 0)
            .map(key => ({ ComputerID: key }));

        if (orderDetails.length === 0) {
            alert('Ви не вибрали жодного комп’ютера для замовлення.');
            return;
        }

        if (!selectedDelivery) {
            alert('Будь ласка, оберіть доставку.');
            return;
        }

        const order = {
            UserID: user.ID,
            DeliveryID: selectedDelivery,
            ComputersID: orderDetails.map(detail => detail.ComputerID),
        };

        fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
        })
            .then(response => {
                if (!response.ok) throw new Error('Помилка оформлення замовлення.');
                alert('Замовлення успішно оформлено!');
            })
            .catch(error => alert(error.message));
    };

    const handleDeleteComputer = id => {
        fetch(`/api/computers/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setComputers(computers.filter(computer => computer.ID !== id));
                    alert('Комп’ютер успішно видалений.');
                } else {
                    alert('Помилка видалення комп’ютера.');
                }
            })
            .catch(() => alert('Сталася помилка при видаленні комп’ютера.'));
    };

    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * placeholderImages.length);
        return placeholderImages[randomIndex];
    };

    return (
        <div>
            <h2>Список компонентів</h2>
            {loading ? (
                <p>Завантаження...</p>
            ) : (
                <>
                    <div className="computer-list">
                        {computers.map(computer => (
                            <div key={computer.ID} className="computer-card">
                                <img
                                    src={getRandomImage()}
                                    alt="Computer"
                                    className="computer-image"
                                />
                                <h3>{computer.Name}</h3>
                                <p><strong>Ціна:</strong> {computer.Price} грн</p>
                                <p><strong>Опис:</strong> {computer.Description}</p>
                                <p><strong>Доступна кількість:</strong> {computer.Quantity}</p>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={reservedChanges[computer.ID] || false}
                                        onChange={() => handleReserveChange(computer.ID)}
                                    /> Обрати для замовлення
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={computer.Quantity}
                                    value={quantities[computer.ID] || 1}
                                    onChange={e => handleQuantityChange(computer.ID, parseInt(e.target.value))}
                                    disabled={!reservedChanges[computer.ID]}
                                />
                                {user.Roles.includes('Admin') && (
                                    <button onClick={() => handleDeleteComputer(computer.ID)}>Видалити</button>
                                )}
                            </div>
                        ))}
                    </div>
                    <div>
                        <label>Оберіть доставку:</label>
                        <select value={selectedDelivery || ''} onChange={e => setSelectedDelivery(e.target.value)}>
                            <option value="">Виберіть доставку</option>
                            {deliveryOptions.map(delivery => (
                                <option key={delivery.ID} value={delivery.ID}>{delivery.Name} ({delivery.Address})</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handlePlaceOrder}>Оформити замовлення</button>
                </>
            )}
        </div>
    );
}
