import { Card, Col, Form, Row } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Selectable from '../../Selectable';
import { timePeriodList } from '../../../Constants';
import { AuthContext } from '../../../Context/AuthProvider';
import StageCard from './StageCard';
import NumbersCard from '../Lead/NumbersCard';
import { parseData } from '../../../Helper';
import dayjs from 'dayjs';
import { getAllOpportunity, getAllOpportunityByTenant, getAllOpportunityByTenantAdmin, getAllOpportunityByTimePeriod, getAllOpportunityByUser } from '../../../Api/Api';
import WonVsLostCard from './WonVsLostCard';
import Top5OpportunitiesCard from './Top5OpportunitiesCard';

const OpportunityTab = () => {

    const { currentRole, currUserData } = useContext(AuthContext) ?? {};
    const [timePeriodForm] = Form.useForm();
    const initialTimePeriodCall = useRef(false);
    const [opportunityList, setOpportunityList] = useState([]);
    const [timePeriodOpportunityList, setTimePeriodOpportunityList] = useState([]);
    const [totalAmountValue, setTotalAmountValue] = useState(0);
    const [wonLostOpportunityCount, setWonLostOpportunityCount] = useState({ closedWon: 0, closedLost: 0 });
    const [currentQuarterOpportunityCount, setCurrentQuarterOpportunityCount] = useState(0);
    const [currentQuarterTotalAmountValue, setCurrentQuarterTotalAmountValue] = useState(0);
    const [currentMonthOpportunityCount, setCurrentMonthOpportunityCount] = useState(0);
    const [currentMonthTotalAmountValue, setCurrentMonthTotalAmountValue] = useState(0);

    useEffect(() => {
        fetchOpportunities();
    }, [currentRole]);

    useEffect(() => {
        if (!initialTimePeriodCall.current) {
            handleTimePeriodChange('days_7');
            initialTimePeriodCall.current = true;
        }
    }, []);

    useEffect(() => {
        if (timePeriodOpportunityList) fetchTotalOpportunityAmount();
        if (timePeriodOpportunityList) fetchWonLostOpportunities();
    }, [timePeriodOpportunityList]);

    useEffect(() => {
        if (opportunityList) fetchCurrentQuarterOpportunities();
        if (opportunityList) fetchCurrentMonthOpportunities();
    }, [opportunityList]);

    const fetchOpportunities = async () => {
        let res;
        if (currentRole === 'HostAdmin') res = await getAllOpportunity();
        if (currentRole === 'Admin') res = await getAllOpportunityByTenantAdmin(parseData(currUserData)?.tenantId);
        if (currentRole === 'HostUser' || currentRole === 'User') res = await getAllOpportunityByUser(parseData(currUserData)?.id);
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getAllOpportunityByTenant(parseData(currUserData)?.id);
        if (res?.status === 200) setOpportunityList(res?.data);
    };

    const handleTimePeriodChange = async (period) => {
        let res;
        if (currentRole === 'HostAdmin') res = await getAllOpportunityByTimePeriod(period);
        if (currentRole === 'Admin') res = await getAllOpportunityByTimePeriod(period, null, parseData(currUserData)?.tenantId);
        if (currentRole === 'HostUser' || currentRole === 'User') res = await getAllOpportunityByTimePeriod(period, null, null, parseData(currUserData)?.id);
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getAllOpportunityByTimePeriod(period, parseData(currUserData)?.id);
        if (res?.status === 200) setTimePeriodOpportunityList(res?.data);
    };
    
    const fetchTotalOpportunityAmount = () => {
        const totalAmount = timePeriodOpportunityList.reduce((acc, opportunity) => acc + (opportunity?.contractValue || 0), 0);
        setTotalAmountValue(totalAmount.toLocaleString());
    };

    const fetchWonLostOpportunities = () => {
        const wonOpportunities = timePeriodOpportunityList.filter(w => w?.opportunityStages?.stage === 'Closed won');
        const lostOpportunities = timePeriodOpportunityList.filter(l => l?.opportunityStages?.stage === 'Closed lost');
        setWonLostOpportunityCount({ closedWon: wonOpportunities?.length, closedLost: lostOpportunities?.length });
    };

    const fetchCurrentQuarterOpportunities = () => {
        const currentMonth = dayjs().month();

        let quarter;
        if (currentMonth >= 0 && currentMonth <= 2) quarter = 1;
        else if (currentMonth >= 3 && currentMonth <= 5) quarter = 2;
        else if (currentMonth >= 6 && currentMonth <= 8) quarter = 3;
        else quarter = 4;

        const currentQuarterData = opportunityList.filter(o => {
            const itemMonth = dayjs(o.createdOn).month();
            return (
                (quarter === 1 && itemMonth >= 0 && itemMonth <= 2) ||
                (quarter === 2 && itemMonth >= 3 && itemMonth <= 5) ||
                (quarter === 3 && itemMonth >= 6 && itemMonth <= 8) ||
                (quarter === 4 && itemMonth >= 9 && itemMonth <= 11)
            );
        });
        setCurrentQuarterOpportunityCount(currentQuarterData?.length);

        const currentMonthTotalAmount = currentQuarterData.reduce((acc, opportunity) => acc + (opportunity?.contractValue || 0), 0);
        setCurrentQuarterTotalAmountValue(currentMonthTotalAmount.toLocaleString());
    };

    const fetchCurrentMonthOpportunities = () => {
        const currentMonth = dayjs().month();
        const currentYear = dayjs().year();

        const currentMonthData = opportunityList.filter(o => {
            const createdDate = dayjs(o.createdOn);
            return createdDate.month() === currentMonth && createdDate.year() === currentYear;
        });
        setCurrentMonthOpportunityCount(currentMonthData?.length);

        const currentMonthTotalAmount = currentMonthData.reduce((acc, opportunity) => acc + (opportunity?.contractValue || 0), 0);
        setCurrentMonthTotalAmountValue(currentMonthTotalAmount.toLocaleString());
    };

    return (
        <div className='tabBodyTopMargin'>
            <Row align='middle' justify='end'>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                    <Form
                        preserve={false}
                        form={timePeriodForm}
                        className='timePeriod'
                    >
                        <Selectable
                            name='timePeriodForm'
                            placeholder='By Time'
                            firstName='name'
                            data={timePeriodList}
                            defaultVal='Last 7 days'
                            handleSelectChange={(period) => {
                                handleTimePeriodChange(period);
                            }}
                        />
                    </Form>
                </Col>
            </Row>

            <Row align='top'>
                <NumbersCard
                    name='Total Number of Opportunities'
                    count={timePeriodOpportunityList?.length??0}
                />
                <NumbersCard
                    name='Total Amount of Opportunities'
                    count={`₹ ${totalAmountValue??0}`}
                />
                <NumbersCard
                    name='Total Won Opportunities'
                    count={wonLostOpportunityCount?.closedWon??0}
                />
                <NumbersCard
                    name='Total Lost Opportunities'
                    count={wonLostOpportunityCount?.closedLost??0}
                />
            </Row><br />

            <Row align='top'>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Card className='wonVsLostCard'>
                        <WonVsLostCard opportunityList={opportunityList} />
                    </Card>
                </Col>
                <Col xl={12} lg={12} md={12} sm={12} xs={12} className='secondRowNumberCard'>
                    <Row align='top'>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <NumbersCard
                                name='Opportunities (current quarter)'
                                count={currentQuarterOpportunityCount??0}
                            />
                        </Col>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <NumbersCard
                                name='Amount (current quarter)'
                                count={`₹ ${currentQuarterTotalAmountValue??0}`}
                            />
                        </Col>
                    </Row><br />
                    <Row align='top'>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <NumbersCard
                                name='Opportunities (current month)'
                                count={currentMonthOpportunityCount??0}
                            />
                        </Col>
                        <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                            <NumbersCard
                                name='Amount (current month)'
                                count={`₹ ${currentMonthTotalAmountValue??0}`}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row><br />

            <Row align='top'>
                <Col xl={14} lg={14} md={14} sm={14} xs={14}>
                    <Card className='opportunityStageCard'>
                        <StageCard timePeriodOpportunityList={timePeriodOpportunityList} />
                    </Card>
                </Col>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <Card className='top5OpporunityCard'>
                        <Top5OpportunitiesCard opportunityList={opportunityList} />
                    </Card>
                </Col>   
            </Row>
        </div>
    );
}

export default React.memo(OpportunityTab);