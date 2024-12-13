import { useState, useEffect } from 'react';

function UserList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users/roles');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ім’я користувача</th>
                        <th>Ролі</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.ID}>
                            <td>{user.ID}</td>
                            <td>{user.Username}</td>
                            <td>{user.Roles.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;