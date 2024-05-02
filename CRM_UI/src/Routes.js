import React, { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Pages/Login';
import Contact from './Pages/Contact';
import Account from './Pages/Account';
import Task from './Pages/Task';
import Lead from './Pages/Lead';
import Opportunity from './Pages/Opportunity';
import Dashboard from './Pages/Dashboard';
import User from './Pages/User';
import { AuthContext } from './Context/AuthProvider';
import ProtectedRoute from './Components/ProtectedRoute';
import { Result } from 'antd';
import AppButton from './Components/AppButton';
import Tenant from './Pages/Tenant';
import Registration from './Pages/Registration';
import Profile from './Pages/Profile';
import EmailVerification from './Pages/EmailVerification';
import Role from './Pages/Role';

const MainRoutes = () => {

    const { user, currentRole, setIsMobile, setIsTablet, setIsDesktop, rsWidths, setRsWidths } = useContext(AuthContext) ?? {};
    const navigate = useNavigate();

    const handleWindowSizeChange = () => {
        setIsMobile(window.innerWidth <= 481);
        setIsTablet(window.innerWidth <= 768);
        setIsDesktop(window.innerWidth >= 769);
        setRsWidths({
            ...rsWidths,
            is1300: window.innerWidth <= 1300,
            is1200: window.innerWidth <= 1200,
            is1100: window.innerWidth <= 1100,
            is930: window.innerWidth <= 930,
            is620: window.innerWidth <= 620,
        });
    };
    
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    return (
        <div>
            <Routes>
                <Route path='register' element={!user ? <Registration /> : ''} />
                <Route path='verification' element={localStorage.getItem('registerTenantData') ? <EmailVerification /> : ''} />
                <Route path='/' element={<ProtectedRoute user={user}><Dashboard /></ProtectedRoute>} />
                <Route path='/login' element={user ? <Dashboard /> : <Login />} />
                {(currentRole === 'HostAdmin') && <Route path='/role' element={<ProtectedRoute user={user} module='HostAdmin'><Role screenType='Role' /></ProtectedRoute>} />}
                {(currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') && <Route path='/user' element={<ProtectedRoute user={user} module='HostAdmin'><User screenType='User' /></ProtectedRoute>} />}
                {(currentRole === 'HostAdmin') && <Route path='/tenant' element={<ProtectedRoute user={user} module='HostAdmin'><Tenant screenType='Tenant' /></ProtectedRoute>} />}
                <Route path='/contact' element={<ProtectedRoute user={user}><Contact screenType='Contact' /></ProtectedRoute>} />
                <Route path='/account' element={<ProtectedRoute user={user}><Account screenType='Account' /></ProtectedRoute>} />
                <Route path='/task' element={<ProtectedRoute user={user}><Task screenType='Task' /></ProtectedRoute>} />
                <Route path='/lead' element={<ProtectedRoute user={user}><Lead screenType='Lead' /></ProtectedRoute>} />
                <Route path='/opportunity' element={<ProtectedRoute user={user}><Opportunity screenType='Opportunity' /></ProtectedRoute>} />
                <Route path='/profile' element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />

                <Route path='/unauthorized' element={
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<AppButton type="dashed" onClick={() => navigate('/')} label='Back Home' />}
                    />
                } />
            </Routes>
        </div>
    );
}

export default MainRoutes;