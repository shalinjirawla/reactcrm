import { Row } from 'antd';
import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const StageCard = ({ timePeriodLeadList }) => {

    const [leadStageCountList, setLeadStageCountList] = useState({ marketingQualifiedLead: 0, satisfied: 0, awaitingSale: 0, handoffToSales: 0, nurturing: 0, qualification: 0 });

    useEffect(() => {
        fetchLeadStage();
    }, [timePeriodLeadList]);

    const fetchLeadStage = () => {
        let marketingQualifiedLeadCount = 0;
        let satisfiedCount = 0;
        let awaitingSaleCount = 0;
        let handoffToSalesCount = 0;
        let nurturingCount = 0;
        let qualificationCount = 0;

        for (let i = 0; i < timePeriodLeadList.length; i++) {
            const stage = timePeriodLeadList[i]?.leadStages?.stage;
            switch (stage) {
                case 'Marketing qualified lead':
                    marketingQualifiedLeadCount++;
                    break;
                case 'Satisfied':
                    satisfiedCount++;
                    break;
                case 'Awaiting sale':
                    awaitingSaleCount++;
                    break;
                case 'Handoff to sales':
                    handoffToSalesCount++;
                    break;
                case 'Nurturing':
                    nurturingCount++;
                    break;
                case 'Qualification':
                    qualificationCount++;
                    break;
                default:
                    break;
            }
        }

        setLeadStageCountList({
            marketingQualifiedLead: marketingQualifiedLeadCount,
            satisfied: satisfiedCount,
            awaitingSale: awaitingSaleCount,
            handoffToSales: handoffToSalesCount,
            nurturing: nurturingCount,
            qualification: qualificationCount
        });
    };

    const wrapText = (value, maxCharsPerLine) => {
        const label = value.toString();
        const words = label.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + word).length > maxCharsPerLine) {
                lines.push(currentLine.trim());
                currentLine = '';
            }
            currentLine += `${word} `;
        });

        lines.push(currentLine.trim());
        return lines;
    };

    const leadStageOptions = {
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
                    text: 'Stages',
                    font: {
                        weight: 'bold'
                    }
                },
                ticks: {
                    display: false,
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    callback: (value) => {
                        const maxCharsPerLine = 10;
                        const lines = wrapText(value, maxCharsPerLine);
                        return lines;
                    }
                },
                // grid: {
                //     display: false,
                // },
                scaleLabel: {
                    display: true,
                    labelString: 'X text'
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

    let leadStageData = {};

    if (Object.values(leadStageCountList).every(item => item === 0)) {
        leadStageData = {
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
        leadStageData = {
            labels: ['Marketing qualified lead', 'Satisfied', 'Awaiting sale', 'Handoff to sales', 'Nurturing', 'Qualification'],
            datasets: [
                {
                    label: "Lead",
                    data: [
                        leadStageCountList?.marketingQualifiedLead,
                        leadStageCountList?.satisfied,
                        leadStageCountList?.awaitingSale,
                        leadStageCountList?.handoffToSales,
                        leadStageCountList?.nurturing,
                        leadStageCountList?.qualification
                    ],
                    backgroundColor: ["green"],
                    borderColor: ["green"],
                    borderWidth: 0.5
                }
            ]
        };
    }

    return (
        <div>
            <Row><h3 className='cardHeading'>Lead Stages</h3></Row>
            <Row><Bar options={leadStageOptions} data={leadStageData} height={200} /></Row>
        </div>
    );
}

export default StageCard;