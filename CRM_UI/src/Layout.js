import { ConfigProvider, Dropdown, Layout, Modal, message, theme } from 'antd';
import React, { useContext, useState } from 'react';
import Sidebar from './Components/Sidebar';
import { SiCivicrm } from "react-icons/si";
import MainRoutes from './Routes';
import { useNavigate } from 'react-router-dom';
import { DownOutlined, UserOutlined, FormOutlined } from '@ant-design/icons';
import { AuthContext } from './Context/AuthProvider';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from './Components/AppButton';
import { parseData } from './Helper';
import { setProfileData } from './Redux/Features/UserDataSlice';

const Layouts = () => {

    const dispatch = useDispatch();
    const { currentUserData, profileData } = useSelector((state) => state.userData) ?? {};
    const { user, setUser, currUserData, isTablet } = useContext(AuthContext) ?? {};
    const navigate = useNavigate();
    const { Header, Content, Sider } = Layout;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: `Logout`,
            content: 'Are you sure you want to Logout?',
            okText: 'Logout',
            okType: 'danger',
            onOk: async () => {
                setUser(null);
                dispatch(setProfileData(null));
                localStorage.clear();
                navigate('/login');
                message.success('You are Successfully Logout !!!');
            },
            onCancel() { },
        });
    };

    const myProfileDetails = () => {
        navigate('/profile');
    };

    const items = [
        {
            label: (
                <p>Profile</p>
            ),
            key: 'profile',
            onClick: (e) => handleMenuClick(e)
        },
        {
            label: (
                <p>Logout</p>
            ),
            key: 'logout',
            onClick: (e) => handleMenuClick(e)
        }
    ];

    const handleMenuClick = (e) => {
        if (e.key === 'profile') {
            myProfileDetails();
        }
        if (e.key === 'logout') {
            showDeleteConfirm();
        }
    };

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#2276e3',
                        fontFamily: 'Rubik,Avenir,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
                        borderRadius: 2
                    },
                    algorithm: theme.compactAlgorithm,
                }}
            >
                <Layout className='mainLayout'>
                    <Header
                        className='header'
                        style={{
                            background: colorBgContainer,
                            flexDirection: 'row',
                            height: null
                        }}
                    >
                        <div className='navbar d-flex-between'>
                            <div className='d-flex-between'>
                                <SiCivicrm className='logoIcon' />&nbsp;<h2>CRM</h2>
                            </div>
                            {user &&
                                <Dropdown menu={{ items }}>
                                    <div className='userProfileDiv'>
                                        <UserOutlined className='userIcon' />
                                        {profileData ? profileData?.name : parseData(currUserData)?.name}
                                        <DownOutlined className='userDownArrow' />
                                    </div>
                                </Dropdown>
                            }
                            {!user &&
                                <div className='userProfileDiv'>
                                    <AppButton
                                        icon={<FormOutlined />}
                                        label='Register'
                                        className='registerBtn'
                                        onClick={() => {
                                            navigate('/register');
                                        }}
                                    />
                                    <div className='btnSpace'></div>
                                    <AppButton
                                        icon={<UserOutlined />}
                                        label='Login'
                                        className='registerBtn'
                                        onClick={() => {
                                            navigate('/login');
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    </Header>
                    <Layout>
                        {user && <Sider className='siderMenu' trigger={null} collapsible collapsed={isTablet ? !collapsed : collapsed}>
                            <div className="demo-logo-vertical" />
                            <Sidebar />
                        </Sider>}
                        <Content
                            style={{
                                minHeight: '90vh',
                                height: '90vh',
                                overflowY: 'scroll',
                                background: colorBgContainer,
                            }}
                        >
                            <div className='mainInsideDiv'>
                                <MainRoutes />
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </div>
    );
}

export default Layouts;