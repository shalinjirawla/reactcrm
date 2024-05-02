import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ user, module, children }) => {
    const { setIsAuth } = useContext(AuthContext)??{};
    const token = localStorage.getItem('token');

    if (!token) {
        setIsAuth(false);
        window.location.href = '/login';
        message.error('Session Expired, Please Login Again.');
    }

    return (token && user) ?
        children
        :
        <Navigate to='/login' />
}

export default ProtectedRoute;