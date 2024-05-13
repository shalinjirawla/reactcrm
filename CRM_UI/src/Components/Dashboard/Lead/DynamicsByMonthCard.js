import { Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";

const DynamicsByMonthCard = ({ leadList }) => {

    const [last5MonthLead, setLast5MonthLead] = useState([]);

    useEffect(() => {
        if (leadList) fetchLast5MonthLead();
    }, [leadList]);

    const fetchLast5MonthLead = () => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        const last5MonthsData = {};
        for (let i = 0; i < 5; i++) {
            let targetMonth = currentMonth - i;
            let targetYear = currentYear;
            if (targetMonth <= 0) {
                targetMonth += 12;
                targetYear--;
            }
            const monthData = leadList.filter(item => {
                const [year, month] = item.createdOn.split('-').map(Number);
                return year === targetYear && month === targetMonth;
            });
            last5MonthsData[`${String(targetMonth).padStart(2, '0')}/${targetYear}`] = monthData.length;
        }

        const array = Object.entries(last5MonthsData).map(([date, count]) => ({ date, count }));
        setLast5MonthLead(array.reverse());
    };

    const leadDynamicOptions = {
        indexAxis: 'y',
        responsive: true,
        elements: {
            bar: {
                borderWidth: 2
            }
        },
        plugins: {
            legend: false,
            title: {
                display: true,
                text: 'Leads'
            }
        },
        scales: {
            x: {
                ticks: {
                    precision: 0
                }
            }
        }
    };

    let leadDynamicData = {};

    if (last5MonthLead.every(item => item.count === 0)) {
        leadDynamicData = {
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
        leadDynamicData = {
            labels: last5MonthLead.map(o => o?.date),
            datasets: [
                {
                    label: 'Lead',
                    data: last5MonthLead.map(o => o?.count),
                    backgroundColor: ['cornflowerblue'],
                    borderColor: ['cornflowerblue'],
                    hoverBackgroundColor: ['dodgerblue'],
                    hoverBorderColor: ['dodgerblue'],
                    borderWidth: 1
                }
            ]
        };
    }

    return (
        <div>
            <Row><h3 className='cardHeading'>Lead dynamics by month</h3></Row>
            <Row><Bar options={leadDynamicOptions} data={leadDynamicData} height={250} /></Row>
        </div>
    );
}

export default DynamicsByMonthCard;