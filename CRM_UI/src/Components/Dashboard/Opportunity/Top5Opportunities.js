import React, { useEffect, useState } from 'react';
import { Row, Table } from 'antd';

const Top5Opportunities = ({ opportunityList }) => {

    const [top5OpenOpportunities, setTop5OpenOpportunities] = useState([]);

    useEffect(() => {
        if (opportunityList.length > 0) fetchTop5Opportunities();
    }, [opportunityList]);

    const fetchTop5Opportunities = () => {
        const sortedTop5Opportunities = opportunityList.sort((a, b) => b.contractValue - a.contractValue).slice(0, 5);
        setTop5OpenOpportunities(sortedTop5Opportunities);
    };

    const opportunityColumns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
        },
        {
            key: 'contractValue',
            title: 'Amount',
            dataIndex: 'contractValue',
            render: (val) => val ? <div>{val.toLocaleString()}</div> : <div>0</div>
        },
        {
            key: 'owner',
            title: 'Owner',
            dataIndex: 'contact',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        }
    ];

    return (
        <div>
            <Row><h3 className='cardHeading'>Top 5 Open Opportunities</h3></Row><br />
            <Table
                className='tableCell'
                columns={opportunityColumns}
                dataSource={top5OpenOpportunities}
                pagination={false}
            />
        </div>
    );
}

export default Top5Opportunities;