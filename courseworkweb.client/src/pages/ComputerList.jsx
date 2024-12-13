import { useState, useEffect } from 'react';
import { useAuth } from '../stuff/AuthContext';

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
            .then((response) => response.json())
            .then((data) => {
                setComputers(data);
                const initialReservedChanges = {};
                const initialQuantities = {};
                data.forEach((computer) => {
                    initialReservedChanges[computer.ID] = false;
                    initialQuantities[computer.ID] = 1;
                });
                setReservedChanges(initialReservedChanges);
                setQuantities(initialQuantities);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Помилка фетчу комп’ютерів:', error);
                setLoading(false);
            });

        fetch('/api/deliveries')
            .then((response) => response.json())
            .then((data) => setDeliveryOptions(data))
            .catch((error) => {
                console.error('Помилка фетчу доставок:', error);
            });
    }, []);

    const handleReserveChange = (id) => {
        setReservedChanges((prevChanges) => ({
            ...prevChanges,
            [id]: !prevChanges[id],
        }));
    };

    const handleQuantityChange = (id, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: value,
        }));
    };

    const handlePlaceOrder = () => {
        const orderDetails = [];

        Object.keys(reservedChanges).forEach(key => {
            const isReserved = reservedChanges[key];
            const quantity = quantities[key];

            if (isReserved && quantity > 0) {
                for (let i = 0; i < quantity; i++) {
                    orderDetails.push({ ComputerID: key });
                }
            }
        });

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
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Помилка: ${response.status}, ${errorText}`);
                }
                alert('Замовлення успішно оформлено!');
            })
            .catch((error) => {
                console.error('Помилка оформлення замовлення:', error);
                alert(error.message);
            });
    };

    const handleDeleteComputer = (id) => {
        fetch(`/api/computers/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setComputers(computers.filter((computer) => computer.ID !== id));
                    alert('Комп\'ютер успішно видалений.');
                } else {
                    alert('Помилка видалення комп\'ютера.');
                }
            })
            .catch((error) => {
                console.error('Помилка видалення комп\'ютера:', error);
                alert('Сталася помилка при видаленні комп\'ютера.');
            });
    };

    return (
        <div>
            <h2>Список компонентів</h2>
            {loading ? (
                <p>Завантаження...</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Ціна</th>
                                <th>Опис</th>
                                <th>Доступна кількість</th>
                                <th>Оберіть для замовлення</th>
                                <th>Кількість</th>
                                {user?.isAdmin && <th>Дії</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {computers.map((computer) => (
                                <tr key={computer.ID}>
                                    <td>{computer.Name}</td>
                                    <td>{computer.Price} грн</td>
                                    <td>{computer.Description}</td>
                                    <td>{computer.Quantity}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={reservedChanges[computer.ID] || false}
                                            onChange={() => handleReserveChange(computer.ID)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            max={computer.Quantity}
                                            value={quantities[computer.ID] || 1}
                                            onChange={(e) => handleQuantityChange(computer.ID, parseInt(e.target.value))}
                                            disabled={!reservedChanges[computer.ID]}
                                        />
                                    </td>
                                    {user.Roles.includes('Admin') && (
                                        <td>
                                            <button onClick={() => handleDeleteComputer(computer.ID)}>
                                                Видалити
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        <label>Оберіть доставку:</label>
                        <select
                            value={selectedDelivery || ''}
                            onChange={(e) => setSelectedDelivery(e.target.value)}
                        >
                            <option value="">Виберіть доставку</option>
                            {deliveryOptions.map((delivery) => (
                                <option key={delivery.ID} value={delivery.ID}>
                                    {delivery.Name} ({delivery.Address})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handlePlaceOrder}>Оформити замовлення</button>
                </>
            )}
        </div>
    );
}
