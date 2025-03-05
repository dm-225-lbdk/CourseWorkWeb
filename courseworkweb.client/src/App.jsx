import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './stuff/AuthContext';
import Header from './layout/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ComputerList from './pages/ComputerList';
import UserInfo from './pages/UserInfo';
import OrderUserList from './pages/OrderUserList';
import ComputerAdd from './pages/ComputerAdd';
import DeliveryAdd from './pages/DeliveryAdd';
import Roles from './pages/Roles';
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div>
                    <Header />
                    <div>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/computerList" element={<ComputerList />} />
                            <Route path="/userinfo" element={<UserInfo />} />
                            <Route path="/ordersinfo" element={<OrderUserList />} />
                            <Route path="/computerAdd" element={<ComputerAdd />} />
                            <Route path="/deliveryAdd" element={<DeliveryAdd />} />
                            <Route path="/roles" element={<Roles />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
