import { Row, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const Top5LeadOwnersCard = ({ leadList }) => {

    const [top5OwnerLeads, setTop5OwnerLeads] = useState([]);

    useEffect(() => {
        if (leadList.length > 0) fetchTop5LeadOwners();
    }, [leadList]);

    const fetchTop5LeadOwners = () => {
        const top5LeadsByContactData = [...new Set(leadList.map(lead => lead.contact))]
            .map(contact => ({
                contact,
                count: leadList.filter(lead => lead.contact === contact).length
            }))
            .sort((a, b) => b?.count - a?.count)
            .slice(0, 5);
            setTop5OwnerLeads(top5LeadsByContactData);
    };
    
    const leadColumns = [
        {
            title: 'Full name',
            dataIndex: 'contact',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            title: 'No. of leads',
            dataIndex: 'count',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        }
    ];

    return (
        <div>
            <Row><h3 className='cardHeading'>Top 5 Lead Owners by Converted Leads</h3></Row><br /><br />
            <Table
                columns={leadColumns}
                dataSource={top5OwnerLeads}
                pagination={false}
            />
        </div>
    );
}

export default Top5LeadOwnersCard;