import { Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { leadCustomerNeedList } from '../../../Constants';

const CustomerNeedCard = ({ timePeriodLeadList }) => {

    const [leadCustomerNeedCountList, setLeadCustomerNeedCountList] = useState({ additionalService: 0, bulkEmailManagementSystem: 0, hardware: 0, marketingManagementSystem: 0, needForOurProducts: 0, needForOurServices: 0, opportunityManagementSystem: 0, serviceManagementSystem: 0, software: 0, workflowAutomationSystem: 0 });

    useEffect(() => {
        fetchLeadCustomerNeed();
    }, [timePeriodLeadList]);
    
    const fetchLeadCustomerNeed = () => {
        let additionalServiceCount = 0;
        let bulkEmailManagementSystemCount = 0;
        let hardwareCount = 0;
        let marketingManagementSystemCount = 0;
        let needForOurProductsCount = 0;
        let needForOurServicesCount = 0;
        let opportunityManagementSystemCount = 0;
        let serviceManagementSystemCount = 0;
        let softwareCount = 0;
        let workflowAutomationSystemCount = 0;

        for (let i = 0; i < timePeriodLeadList.length; i++) {
            const customerNeed = timePeriodLeadList[i]?.leadCustomerNeeds?.customerNeed;
            switch (customerNeed) {
                case 'Additional service':
                    additionalServiceCount++;
                    break;
                case 'Bulk email management system':
                    bulkEmailManagementSystemCount++;
                    break;
                case 'Hardware':
                    hardwareCount++;
                    break;
                case 'Marketing management system':
                    marketingManagementSystemCount++;
                    break;
                case 'Need for our products':
                    needForOurProductsCount++;
                    break;
                case 'Need for our services':
                    needForOurServicesCount++;
                    break;
                case 'Opportunity management system':
                    opportunityManagementSystemCount++;
                    break;
                case 'Service management system':
                    serviceManagementSystemCount++;
                    break;
                case 'Software':
                    softwareCount++;
                    break;
                case 'Workflow automation system':
                    workflowAutomationSystemCount++;
                    break;
                default:
                    break;
            }
        }

        setLeadCustomerNeedCountList({
            additionalService: additionalServiceCount,
            bulkEmailManagementSystem: bulkEmailManagementSystemCount,
            hardware: hardwareCount,
            marketingManagementSystem: marketingManagementSystemCount,
            needForOurProducts: needForOurProductsCount,
            needForOurServices: needForOurServicesCount,
            opportunityManagementSystem: opportunityManagementSystemCount,
            serviceManagementSystem: serviceManagementSystemCount,
            software: softwareCount,
            workflowAutomationSystem: workflowAutomationSystemCount
        });
    };

    const leadCustomerNeedOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Leads'
            },
            legend: false
        },
        scales: {
            x: {
                stacked: true,
                display: true,
                title: {
                    display: true,
                    text: 'Customer Needs',
                    font: {
                        weight: 'bold'
                    }
                },
                ticks: {
                    display: false
                }
            },
            y: {
                stacked: true,
                display: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    let leadCustomerNeedData = {};

    if (Object.values(leadCustomerNeedCountList).every(item => item === 0)) {
        leadCustomerNeedData = {
            labels: ['No data found'],
            datasets: [
                {
                    label: 'No data',
                    data: [100],
                    backgroundColor: ['#D3D3D3']
                }
            ]
        };
    } else {
        leadCustomerNeedData = {
            labels: leadCustomerNeedList.map(o => o?.name),
            datasets: [
                {
                    label: "Lead",
                    data: [
                        leadCustomerNeedCountList?.additionalService,
                        leadCustomerNeedCountList?.bulkEmailManagementSystem,
                        leadCustomerNeedCountList?.hardware,
                        leadCustomerNeedCountList?.marketingManagementSystem,
                        leadCustomerNeedCountList?.needForOurProducts,
                        leadCustomerNeedCountList?.needForOurServices,
                        leadCustomerNeedCountList?.opportunityManagementSystem,
                        leadCustomerNeedCountList?.serviceManagementSystem,
                        leadCustomerNeedCountList?.software,
                        leadCustomerNeedCountList?.workflowAutomationSystem
                    ],
                    backgroundColor: ["cornflowerblue"],
                    borderColor: ["cornflowerblue"],
                    borderWidth: 0.5,
                }
            ]
        };
    }

    return (
        <div>
            <Row><h3 className='cardHeading'>Number of Lead by Customer Need</h3></Row>
            <Row><Bar options={leadCustomerNeedOptions} data={leadCustomerNeedData} height={140} /></Row>
        </div>
    );
}

export default CustomerNeedCard;