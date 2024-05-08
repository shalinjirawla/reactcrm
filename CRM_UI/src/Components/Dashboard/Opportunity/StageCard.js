import React, { useEffect, useState } from 'react';
import { opportunityStageList } from '../../../Constants';
import { Row } from 'antd';
import { Bar } from 'react-chartjs-2';

const StageCard = ({ timePeriodOpportunityList }) => {

    const [opportunityStageCountList, setOpportunityStageCountList] = useState({ closedLost: 0, closedRejected: 0, closedRerouted: 0, closedWon: 0, contracting: 0, idDecisionmakers: 0, needsAnalysis: 0, negotiations: 0, presentation: 0, proposal: 0, proposalDevelopment: 0, qualification: 0 });

    useEffect(() => {
        fetchOpportunityStage();
    }, [timePeriodOpportunityList]);

    const fetchOpportunityStage = () => {
        let closedLostCount = 0;
        let closedRejectedCount = 0;
        let closedReroutedCount = 0;
        let closedWonCount = 0;
        let contractingCount = 0;
        let idDecisionmakersCount = 0;
        let needsAnalysisCount = 0;
        let negotiationsCount = 0;
        let presentationCount = 0;
        let proposalCount = 0;
        let proposalDevelopmentCount = 0;
        let qualificationCount = 0;

        for (let i = 0; i < timePeriodOpportunityList.length; i++) {
            const stage = timePeriodOpportunityList[i]?.opportunityStages?.stage;
            switch (stage) {
                case 'Closed lost':
                    closedLostCount++;
                    break;
                case 'Closed rejected':
                    closedRejectedCount++;
                    break;
                case 'Closed rerouted':
                    closedReroutedCount++;
                    break;
                case 'Closed won':
                    closedWonCount++;
                    break;
                case 'Contracting':
                    contractingCount++;
                    break;
                case 'Id. decision makers':
                  idDecisionmakersCount++;
                  break;
                case 'Needs analysis':
                    needsAnalysisCount++;
                    break;
                case 'Negotiations':
                    negotiationsCount++;
                    break;
                case 'Presentation':
                    presentationCount++;
                    break;
                case 'Proposal':
                    proposalCount++;
                    break;
                case 'Proposal development':
                    proposalDevelopmentCount++;
                    break;
                case 'Qualification':
                    qualificationCount++;
                    break;
                default:
                    break;
            }
        }

        setOpportunityStageCountList({
            closedLost: closedLostCount,
            closedRejected: closedRejectedCount,
            closedRerouted: closedReroutedCount,
            closedWon: closedWonCount,
            contracting: contractingCount,
            idDecisionmakers: idDecisionmakersCount,
            needsAnalysis: needsAnalysisCount,
            negotiations: negotiationsCount,
            proposal: proposalCount,
            presentation: presentationCount,
            proposalDevelopment: proposalDevelopmentCount,
            qualification: qualificationCount,
        });
    };

    const opportunityStageOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Opportunities'
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

    let opportunityStageData = {};

    if (Object.values(opportunityStageCountList).every(item => item === 0)) {
        opportunityStageData = {
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
        opportunityStageData = {
            labels: opportunityStageList.map(o => o?.name),
            datasets: [
                {
                    label: "Opportunity",
                    data: [
                        opportunityStageCountList?.closedLost,
                        opportunityStageCountList?.closedRejected,
                        opportunityStageCountList?.closedRerouted,
                        opportunityStageCountList?.closedWon,
                        opportunityStageCountList?.contracting,
                        opportunityStageCountList?.idDecisionmakers,
                        opportunityStageCountList?.needsAnalysis,
                        opportunityStageCountList?.negotiations,
                        opportunityStageCountList?.proposal,
                        opportunityStageCountList?.presentation,
                        opportunityStageCountList?.proposalDevelopment,
                        opportunityStageCountList?.qualification,
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
            <Row><h3 className='cardHeading'>Opportunity Stages</h3></Row>
            <Row><Bar options={opportunityStageOptions} data={opportunityStageData} height={115} /></Row>
        </div>
    );
}

export default StageCard;