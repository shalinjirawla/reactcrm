import { Col, Row, Spin, Tabs } from 'antd';
import React, { useEffect, useState, useTransition } from 'react';
import '../Styles/dashboard.css';
import { LoadingOutlined } from '@ant-design/icons';
import LeadTab from '../Components/Dashboard/Lead/LeadTab';
import OpportunityTab from '../Components/Dashboard/Opportunity/OpportunityTab';

const Dashboard = () => {

    const [isPending, startTransition] = useTransition();
    const [currActiveTab, setCurrActiveTab] = useState('lead');
    const [tabLoading, setTabLoading] = useState({ lead: true });

    useEffect(() => {
        setTimeout(() => {
            setTabLoading(prevState => ({
                ...prevState,
                [currActiveTab]: false
            }));
        }, 1000);
    }, [currActiveTab]);

    const onTabChange = (val) => {
        startTransition(() => {
            setCurrActiveTab(val);
            setTabLoading(prevState => ({
                ...prevState,
                [val]: true
            }));
        });
    };
    
    const items = [
        {
            key: 'lead',
            label: 'Lead',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : <LeadTab />}
            </>
        },
        {
            key: 'opportunity',
            label: 'Opportunity',
            children: <>
                {tabLoading[currActiveTab] ? (
                    <Spin indicator={<LoadingOutlined className='spinLoader' spin />} />
                ) : <OpportunityTab />}
            </>
        }
    ];

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <h2 className='allPageHeader'>Dashboards</h2>
                </Col>
            </Row><br />
            <Row align='middle' justify='space-between'>
                <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Tabs className='dashboardTab' items={items} onChange={onTabChange} />
                </Col>
            </Row>
        </div>
    );
}

export default React.memo(Dashboard);