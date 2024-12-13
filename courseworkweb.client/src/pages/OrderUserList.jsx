import { useState, useEffect } from 'react';
import { useAuth } from '../stuff/AuthContext';
import '../styles/UserOrders.css';

export default function OrderUserList() {
    const [orders, setOrders] = useState([]);
    const [computers, setComputers] = useState([]);
    const [deliveryDetails, setDeliveryDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user?.ID) {
            fetch(`/api/orders/user/${user.ID}`)
                .then((response) => response.json())
                .then((data) => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Помилка завантаження замовлень:', error);
                    setLoading(false);
                });
        }
    }, [user]);

    useEffect(() => {
        if (orders.length > 0) {
            const computerIds = orders.flatMap(order => order.ComputersID);
            fetch(`/api/computers/ids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: computerIds }),
            })
                .then((response) => response.json())
                .then((data) => setComputers(data))
                .catch((error) => {
                    console.error('Помилка завантаження комп\'ютерів:', error);
                });
        }
    }, [orders]);

    useEffect(() => {
        if (orders.length > 0) {
            const deliveryIds = orders.map(order => order.DeliveryID);
            fetch(`/api/deliveries/ids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: deliveryIds }),
            })
                .then((response) => response.json())
                .then((data) => {
                    const details = data.reduce((acc, delivery) => {
                        acc[delivery.ID] = delivery;
                        return acc;
                    }, {});
                    setDeliveryDetails(details);
                })
                .catch((error) => {
                    console.error('Помилка завантаження доставок:', error);
                });
        }
    }, [orders]);

    if (loading) {
        return <p className="loading">Завантаження замовлень...</p>;
    }

    if (orders.length === 0) {
        return <p className="no-orders">У вас немає замовлень.</p>;
    }

    return (
        <div className="orders-container">
            <h2 className="orders-title">Ваші замовлення</h2>
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>ID Замовлення</th>
                        <th>Доставка</th>
                        <th>Комп’ютери</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => {
                        const orderComputers = computers.filter(c => order.ComputersID.includes(c.ID));
                        return (
                            <tr key={order.OrderID}>
                                <td>{order.OrderID}</td>
                                <td>
                                    {deliveryDetails[order.DeliveryID] ? (
                                        <>
                                            {deliveryDetails[order.DeliveryID].Name || 'Невідомо'}<br />
                                            <span className="delivery-address">
                                                {deliveryDetails[order.DeliveryID].Address || 'Адреса невідома'}
                                            </span>
                                        </>
                                    ) : (
                                        'Доставка не знайдена'
                                    )}
                                </td>
                                <td>
                                    {orderComputers.length > 0 ? (
                                        <ul className="computers-list">
                                            {orderComputers.map((computer) => (
                                                <li key={computer.ID}>
                                                    {computer.Name || 'Невідомо'}
                                                    <span>
                                                        {computer.Price ? ` — Ціна: ${computer.Price.toFixed(2)} грн` : ' — Ціна невідома'}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        'Комп’ютери не знайдені'
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
