import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Title, Legend, Tooltip } from 'chart.js'
import { leadStatusList } from '../../../Constants';
Chart.register(ArcElement, Title, Legend, Tooltip);

const StatusCard = ({ timePeriodLeadList }) => {
    
    const [leadStatusCountList, setLeadStatusCountList] = useState({ contacted: 0, done: 0, inProgress: 0, lost: 0, new: 0, unableToConnect: 0 });

    useEffect(() => {
        fetchLeadStatus();
    }, [timePeriodLeadList]);
    
    const fetchLeadStatus = () => {
        let contactedCount = 0;
        let doneCount = 0;
        let inProgressCount = 0;
        let lostCount = 0;
        let newCount = 0;
        let unableToConnectCount = 0;

        for (let i = 0; i < timePeriodLeadList.length; i++) {
            const status = timePeriodLeadList[i]?.leadStatuses?.status;
            switch (status) {
                case 'Contacted':
                    contactedCount++;
                    break;
                case 'Done':
                    doneCount++;
                    break;
                case 'In progress':
                    inProgressCount++;
                    break;
                case 'Lost':
                    lostCount++;
                    break;
                case 'New':
                    newCount++;
                    break;
                case 'Unable to connect':
                    unableToConnectCount++;
                    break;
                default:
                    break;
            }
        }

        setLeadStatusCountList({
            contacted: contactedCount,
            done: doneCount,
            inProgress: inProgressCount,
            lost: lostCount,
            new: newCount,
            unableToConnect: unableToConnectCount
        });
    };

    const leadStatusOptions = {
        responsive: true,
        plugins: {
            responsive: false,
            title: {
                display: true,
                text: 'Leads',
                padding: {
                    top: 20,
                    bottom: -20
                },
            },
            legend: {
                position: 'right',  
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle'
                },
                padding: {
                    top: 20,
                    bottom: -20
                },
            },
            layout: {
                padding: {
                    top: 0,
                    bottom: 0,
                },
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem, data) => {
                        return tooltipItem?.value;
                    }
                }
            }
        }
    };

    let leadStatusData = {};

    if (Object.values(leadStatusCountList).every(item => item === 0)) {
        leadStatusData = {
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
        leadStatusData = {
            labels: leadStatusList.map(o => o?.name),
            datasets: [
                {
                    label: 'Lead',
                    data: [
                        leadStatusCountList?.contacted??0,
                        leadStatusCountList?.done??0,
                        leadStatusCountList?.inProgress??0,
                        leadStatusCountList?.lost??0,
                        leadStatusCountList?.new??0,
                        leadStatusCountList?.unableToConnect??0
                    ],
                    backgroundColor: ['#36A2EB', '#ADFF2F', '#FFA500', '#FF0000', '#00FFFF', '#FF6384']
                }
            ]
        };
    }

    return (
        <div>
            <Row><h3 className='cardHeading'>Lead Status</h3></Row>
            <Row><Pie options={leadStatusOptions} data={leadStatusData} /></Row>
        </div>
    );
}

export default StatusCard;