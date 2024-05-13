import { Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const WonVsLostCard = ({ opportunityList }) => {

    const [last4MonthOpportunity, setLast4MonthOpportunity] = useState([]);

    useEffect(() => {
        if (opportunityList) fetchLast4MonthOpportunity();
    }, [opportunityList]);

    const fetchLast4MonthOpportunity = () => {
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();

        const last4MonthsData = {};
        for (let i = 0; i < 4; i++) {
            let targetMonth = currentMonth - i;
            let targetYear = currentYear;
            if (targetMonth <= 0) {
                targetMonth += 12;
                targetYear--;
            }

            const monthData = opportunityList.filter(item => {
                const createdDate = dayjs(item.createdOn);
                return createdDate.year() === targetYear && createdDate.month() + 1 === targetMonth;
            });

            const closedWonTotalAmount = monthData.reduce((total, item) => {
                if (item?.opportunityStages?.stage === 'Closed won') {
                    return total + item.contractValue;
                }
                return total;
            }, 0);
        
            const closedLostTotalAmount = monthData.reduce((total, item) => {
                if (item?.opportunityStages?.stage === 'Closed lost') {
                    return total + item.contractValue;
                }
                return total;
            }, 0);

            last4MonthsData[`${String(targetMonth).padStart(2, '0')}/${targetYear}`] = {
                'closedWon': closedWonTotalAmount,
                'closedLost': closedLostTotalAmount
            };
        }

        const array = Object.entries(last4MonthsData).map(([date, stageAmount]) => ({ date, stageAmount }));
        setLast4MonthOpportunity(array.reverse());
    };

    const opportunityWonVsLostOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: false
            }
        }
    };

    let opportunityWonVsLostData = {};

    if (last4MonthOpportunity.every(item => item?.stageAmount?.closedWon === 0 && item?.stageAmount?.closedLost === 0)) {
        opportunityWonVsLostData = {
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
        opportunityWonVsLostData = {
            labels: last4MonthOpportunity.map(o => o?.date),
            datasets: [
                {
                    label: 'Won',
                    data: last4MonthOpportunity?.map(o => o?.stageAmount?.closedWon),
                    backgroundColor: ['green'],
                    borderColor: ['green'],
                    borderWidth: 0.5
                },
                {
                    label: 'Lost',
                    data: last4MonthOpportunity?.map(o => o?.stageAmount?.closedLost),
                    backgroundColor: ['red'],
                    borderColor: ['red'],
                    borderWidth: 0.5
                }
            ]
        };
    }
  
    return (
        <div>
            <Row><h3 className='cardHeading'>Won Vs Lost Opportunities</h3></Row>
            <Bar options={opportunityWonVsLostOptions} data={opportunityWonVsLostData} height={115} />
        </div>
    );
}

export default WonVsLostCard;