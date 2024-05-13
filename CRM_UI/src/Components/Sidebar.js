import { AccountBookOutlined, ContactsOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaTasks } from "react-icons/fa";
import { SiGoogleads } from "react-icons/si";
import { TbBrandMyOppo } from "react-icons/tb";
import { SiAntena3 } from "react-icons/si";
import { FaCriticalRole } from "react-icons/fa";
import { AuthContext } from '../Context/AuthProvider';

const Sidebar = () => {

    const { currentRole } = useContext(AuthContext) ?? {};
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [defaultActiveBar, setDefaultActiveBar] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (window.location.href.endsWith('/')) setDefaultActiveBar('');
        if (window.location.href.endsWith('/role')) setDefaultActiveBar('role');
        if (window.location.href.endsWith('/user')) setDefaultActiveBar('user');
        if (window.location.href.endsWith('/tenant')) setDefaultActiveBar('tenant');
        if (window.location.href.endsWith('/contact')) setDefaultActiveBar('contact');
        if (window.location.href.endsWith('/lead')) setDefaultActiveBar('lead');
        if (window.location.href.endsWith('/opportunity')) setDefaultActiveBar('opportunity');
        if (window.location.href.endsWith('/account')) setDefaultActiveBar('account');
        if (window.location.href.endsWith('/task')) setDefaultActiveBar('task');
        setSiderMenuItems();
        setIsLoading(false);
    }, []);

    const getItem = (label, key, icon, children) => {
        return { key, icon, children, label };
    };
       
    const handleOnClick = (e) => {
        navigate(e.key);
    };

    const setSiderMenuItems = () => {
        let items = [
            getItem('Dashboards', '', <HomeOutlined />),
            getItem('Contacts', 'contact', <ContactsOutlined />),
            getItem('Leads', 'lead', <SiGoogleads />),
            getItem('Opportunities', 'opportunity', <TbBrandMyOppo />),
            getItem('Accounts', 'account', <AccountBookOutlined />),
            getItem('Tasks', 'task', <FaTasks />)
        ];

        if (currentRole === 'HostAdmin') items.splice(1, 0, getItem('Roles', 'role', <FaCriticalRole />));
        if (currentRole === 'HostAdmin') items.splice(2, 0, getItem('Tenants', 'tenant', <SiAntena3 />));
        if (currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') items.splice((currentRole === 'HostAdmin' ? 3 : 1), 0, getItem('Users', 'user', <UserOutlined />));

        setMenuItems(items);
    };

    if (isLoading) {
        return "Loading";
    }

    return (
        <div>
            <Menu
                mode="inline"
                style={{ height: 'inherit' }}
                defaultSelectedKeys={[defaultActiveBar]}
                items={menuItems}
                onClick={handleOnClick}
            />
        </div>
    );
}

export default React.memo(Sidebar);