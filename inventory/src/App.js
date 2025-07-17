import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './features/dashboard/Dashboard';
import ManagerDashboard from './features/dashboard/ManagerDashboard';
import Login from './components/Login';
import Register from './components/Register';
import StockList from './components/StockList';
import ProductsPage from './pages/products';
import News from "./components/News";
import AboutUs from "./components/AboutUs";
import HomePage from "./components/Homepage";
import AddStockPage from './pages/stocks/add';
import EditStockPage from './components/EditStockPage';
import StockDetail from './components/StockDetails';
import StockMovementListPage from './pages/stockmovements';
import AddStockMovementPage from './pages/stockmovements/add';
import EditStockMovementPage from './pages/stockmovements/edit';
import ViewStockMovementPage from './pages/stockmovements/view';
import CustomersPage from './pages/customers';
import AddCustomer from './pages/customers/add';
import EditCustomer from './pages/customers/edit';
import SuppliersPage from './pages/suppliers';
import AddSupplier from './pages/suppliers/add';
import EditSupplier from './pages/suppliers/edit';
import TransactionList from './pages/Transactions/TransactionList';
import PurchaseForm from './pages/Transactions/PurchaseForm';
import SaleForm from './pages/Transactions/SaleForm';
import ReturnForm from './pages/Transactions/ReturnForm';
import axios from 'axios';
import AddProduct from './pages/products/add';
import StockManagerList from './components/stockManagerList';
import StockManagerForm from './components/stockManagerForm';
import AddStockManager from './pages/stockmanagers/add';
import StockHistoryList from './components/StockHistoryList';
import StockHistoryListPage from './pages/stockhistory';

const ProtectedRoute = ({ children }) => {
    const { authState } = useAuth();

    if (authState.isLoading) {
        return <div>Loading...</div>;
    }

    if (!authState.token) {
        console.log("ProtectedRoute: Token missing, redirecting to login");
        return <Navigate to="/login" />;
    }

    console.log("ProtectedRoute: Token present, proceeding", authState.token);
    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="manager-dashboard" element={<ManagerDashboard />} />

                        <Route path="stocks" element={<StockList />} />
                        <Route path="stocks/add" element={<AddStockPage />} />
                        <Route path="stocks/:id" element={<StockDetail />} />
                        <Route path="stocks/edit/:id" element={<EditStockPage />} />

                        <Route path="stockmovements" element={<StockMovementListPage />} />
                        <Route path="stockmovements/add" element={<AddStockMovementPage />} />
                        <Route path="stockmovements/edit/:id" element={<EditStockMovementPage />} />
                        <Route path="stockmovements/:id" element={<ViewStockMovementPage />} />

                        <Route path="customers" element={<CustomersPage />} />
                        <Route path="customers/add" element={<AddCustomer />} />
                        <Route path="customers/edit/:id" element={<EditCustomer />} />

                        <Route path="suppliers" element={<SuppliersPage />} />
                        <Route path="suppliers/add" element={<AddSupplier />} />
                        <Route path="suppliers/edit/:id" element={<EditSupplier />} />

                        <Route path="transactions" element={<TransactionList />} />
                        <Route path="transactions/add/purchase" element={<PurchaseForm />} />
                        <Route path="transactions/add/sale" element={<SaleForm />} />
                        <Route path="transactions/add/return" element={<ReturnForm />} />

                        <Route path="products" element={<ProductsPage />} />
                        <Route path="products/add" element={<AddProduct />} />

                        <Route path="news" element={<News />} />
                        <Route path="about-us" element={<AboutUs />} />
                        <Route path="home" element={<HomePage />} />

                        <Route path="stockmanagers" element={<StockManagerList />} />
                        <Route path="stockmanagers/add" element={<AddStockManager />} />
                        <Route path="stockmanagers/edit/:id" element={<StockManagerForm />} />
                        <Route path="stockmanagers/:id" element={<StockManagerForm />} />

                        <Route path="stockhistory" element={<StockHistoryListPage />} />
                        <Route path="stock-history" element={<StockHistoryList />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;