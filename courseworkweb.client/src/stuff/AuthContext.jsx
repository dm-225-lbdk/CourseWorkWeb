import { createContext, useContext, useState, useTransition } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isPending, startTransition] = useTransition();

    const login = (userData) => {
        startTransition(() => {
            setUser(userData);
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isPending }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
