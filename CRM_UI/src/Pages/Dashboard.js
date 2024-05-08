import { Col, Row, Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import '../Styles/dashboard.css';
import LeadDashboard from '../Components/Dashboard/Lead/LeadDashboard';
import OpportunityDashboard from '../Components/Dashboard/Opportunity/OpportunityDashboard';
import { LoadingOutlined } from '@ant-design/icons';

const Dashboard = () => {

    const [currActiveTab, setCurrActiveTab] = useState('lead');
    const [tabLoading, setTabLoading] = useState({ lead: true });

    useEffect(() => {
        setTimeout(() => {
            setTabLoading(prevState => ({
                ...prevState,
                [currActiveTab]: false
            }));
        }, 500);
    }, [currActiveTab]);

    const onTabChange = (val) => {
        setCurrActiveTab(val);
        setTabLoading(prevState => ({
            ...prevState,
            [val]: true
        }));
    };

    const items = [
        {
            key: 'lead',
            label: 'Lead',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : <LeadDashboard />}
            </>
        },
        {
            key: 'opportunity',
            label: 'Opportunity',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : <OpportunityDashboard />}
            </>
        }
    ];

    return (
        <div style={{ marginTop: '-2.1%' }}>
            <Row align='middle' justify='space-between'>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Tabs className='dashboardTab' items={items} onChange={onTabChange} />
                </Col>
            </Row>
        </div>
    );
}

export default Dashboard;