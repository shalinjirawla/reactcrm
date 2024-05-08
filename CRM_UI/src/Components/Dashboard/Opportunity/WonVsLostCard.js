import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const WonVsLostCard = ({ opportunityList, wonCount, lostCount }) => {

    const [last5MonthOpportunity, setLast5MonthOpportunity] = useState([]);

    useEffect(() => {
        if (opportunityList) fetchLast5MonthOpportunity();
    }, [opportunityList]);

    const fetchLast5MonthOpportunity = () => {
        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();

        const last5MonthsData = {};
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
            last5MonthsData[`${String(targetMonth).padStart(2, '0')}/${targetYear}`] = monthData.length;
        }

        const array = Object.entries(last5MonthsData).map(([date, count]) => ({ date, count }));
        setLast5MonthOpportunity(array);
    };

    const opportunityWonVsLostOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Won vs Lost opportunities',
            },
        },
    };

    let opportunityWonVsLostData = {};

    if (wonCount === 0 && lostCount === 0) {
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
            labels: last5MonthOpportunity.map(o => o?.date),
            datasets: [
                {
                    label: 'Win Rate',
                    data: wonCount,
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: 'Loss Rate',
                    data: lostCount,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                }
            ],
        };
    }
  

    return (
        <div>
            <Bar options={opportunityWonVsLostOptions} data={opportunityWonVsLostData} height={125} />
        </div>
    );
}

export default WonVsLostCard;