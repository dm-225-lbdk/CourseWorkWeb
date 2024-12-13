import PropTypes from 'prop-types';

function DeliverySelector({ deliveries, onDeliverySelect }) {
    return (
        <div>
            <select onChange={(e) => onDeliverySelect(e.target.value)}>
                {deliveries.map((delivery) => (
                    <option key={delivery.ID} value={delivery.ID}>
                        {delivery.Name}
                    </option>
                ))}
            </select>
        </div>
    );
}

DeliverySelector.propTypes = {
    deliveries: PropTypes.array.isRequired,
    onDeliverySelect: PropTypes.func.isRequired,
};

export default DeliverySelector;
