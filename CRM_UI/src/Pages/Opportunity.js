import { Col, Input, Modal, Progress, Row, Table, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addOpportunity, deleteOpportunity, getAllOpportunity, getAllOpportunityByTenant, getAllOpportunityByTenantAdmin, getAllOpportunityByUser, getExportExcelFileByOpportunity, updateOpportunity } from '../Api/Api';
import { opportunitySalesChannelList, opportunityStageList } from '../Constants';
import dayjs from 'dayjs';
import { dateFormat, filterData, parseData } from '../Helper';
import AddEditOpportunityForm from '../Components/Opportunity/AddEditOpportunityForm';
import { AuthContext } from '../Context/AuthProvider';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';

const Opportunity = ({ screenType }) => {

    const opportunityColumns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            fixed: 'left',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'contact',
            title: 'Contact',
            dataIndex: 'contact',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'account',
            title: 'Account',
            dataIndex: 'account',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'stageId',
            title: 'Stage',
            dataIndex: 'stageId',
            render: (val) => val ? <div>{opportunityStageList?.find(o => o?._id === val)?.name}{getStageShowProgress(val)}</div> : <div>-</div>
        },
        {
            key: 'salesChannelId',
            title: 'Sales channel',
            dataIndex: 'salesChannelId',
            render: (val) => val ? <div>{opportunitySalesChannelList?.find(o => o?._id === val)?.name}</div> : <div></div>
        },
        {
            key: 'contractValue',
            title: 'Total contract value',
            dataIndex: 'contractValue',
            render: (val) => val ? <div>{val.toLocaleString()}</div> : <div>0</div>
        },
        {
            key: 'closeDate',
            title: 'Expected close date',
            dataIndex: 'closeDate',
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div></div>
        },
        {
            key: 'action',
            title: 'Action',
            dataIndex: 'action',
            width: '5%',
            render: (index, record) => <div className='d-flex-between'>
                <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)}/>
                <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
        },
    ];

    const { currentRole, currUserData, rsWidths: { is620, is930, is1100, is1200 }, isMobile, isTablet } = useContext(AuthContext) ?? {};
    const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);
    const [defaultOpportunity, setDefaultOpportunity] = useState(null);
    const [isEditOpportunity, setIsEditOpportunity] = useState(false);
    const [opportunityList, setOpportunityList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
        const temp = filterData(opportunityList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        let res;
        if (currentRole === 'HostAdmin') {
            res = await getAllOpportunity();
        } else if (currentRole === 'Admin') {
            res = await getAllOpportunityByTenantAdmin(parseData(currUserData)?.tenantId);
        } else if (currentRole === 'HostUser' || currentRole === 'User') {
            res = await getAllOpportunityByUser(parseData(currUserData)?.id);
        } else if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') {
            res = await getAllOpportunityByTenant(parseData(currUserData)?.id);
        }
        if (res?.status === 200) {
            setOpportunityList(res?.data);
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Opportunity name: ${record?.name}`,
            content: 'Are you sure want to remove this Opportunity?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteOpportunity(record?.id);
                    if (res?.data === true) {
                        message.success(record?.name + ' Opportunity Deleted Successfully !!!');
                        fetchOpportunities();
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error('Something went wrong' + error);
                }
            },
            onCancel() { },
        });
    };

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
            setOpportunityModalOpen(true);
            setDefaultOpportunity(record);
            setIsEditOpportunity(true);
        }
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const getStageShowProgress = (val) => {
        return (val === 1 || val === 4 || val === 5 || val === 9 || val === 10 || val === 12) &&
            <Progress
                size='small'
                percent={getStageProgressPercent(val)}
                status={val === 1 ? 'exception' : 'success'}
                showInfo={false}
            />
    };
    
    const getStageProgressPercent = (val) => {
        return val === 1 ? 100 : val === 4 ? 100 : val === 5 ? 80 : val === 10 ? 60 : val === 9 ? 40 : val === 12 ? 20 : 0;
    };

    const handleOpportunityModal = () => {
        setOpportunityModalOpen(!opportunityModalOpen);
    };

    const handleOpportunityFormValues = async (form) => {
        const { addOpportunityName, addOpportunityContact, addOpportunityAccount, addOpportunityContractValue, addOpportunityCloseDate, addOpportunityStage, addOpportunitySalesChannel, addOpportunityDescription } = form.getFieldsValue();

        if (addOpportunityName && addOpportunityContact && addOpportunityStage) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                name: addOpportunityName,
                contact: addOpportunityContact,
                account: addOpportunityAccount ? addOpportunityAccount : '',
                contractValue: addOpportunityContractValue ? addOpportunityContractValue : 0,
                closeDate: addOpportunityCloseDate ? dateFormat(addOpportunityCloseDate) : '',
                stageId: addOpportunityStage,
                salesChannelId: addOpportunitySalesChannel ? addOpportunitySalesChannel : null,
                description: addOpportunityDescription ? addOpportunityDescription : ''
            };

            if (currentRole === 'HostAdmin' || currentRole === 'HostUser') {
                data['tenantId'] = null;
            } else if (currentRole === 'Admin' || currentRole === 'User') {
                data['tenantId'] = parseData(currUserData)?.tenantId;
            } else {
                data['tenantId'] = parseData(currUserData)?.id;
            }

            if (!isEditOpportunity) {
                if (currentRole === 'HostAdmin' || currentRole === 'HostUser' || currentRole === 'Admin' || currentRole === 'User') {
                    data['roleId'] = parseData(currUserData)?.roleId;
                    data['userId'] = parseData(currUserData)?.id;
                } else {
                    data['roleId'] = null;
                    data['userId'] = null;
                }
            } else {
                data['roleId'] = defaultOpportunity?.roleId;
                data['userId'] = defaultOpportunity?.userId;
            }

            if (defaultOpportunity) {
                data['id'] = defaultOpportunity?.id;
            }

            if (!isEditOpportunity) {
                try {
                    data['createdOn'] = new Date().toLocaleString();
                    const res = await addOpportunity(data);
                    if (res?.status === 200) {
                        setOpportunityModalOpen(false);
                        message.success('Opportunity Added Successfully !!!');
                        fetchOpportunities();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

            if (isEditOpportunity) {
                try {
                    const res = await updateOpportunity(data);
                    if (res?.status === 200) {
                        setOpportunityModalOpen(false);
                        message.success(defaultOpportunity?.name + ' Opportunity Updated Successfully !!!');
                        fetchOpportunities();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

        } else {
            message.error('Please Add Required Fields!')
        }
    };

    const handleExport = async () => {
        let res;
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByOpportunity();
        if (currentRole === 'Admin') res = await getExportExcelFileByOpportunity(null, parseData(currUserData)?.tenantId);
        if (currentRole === 'HostUser' || currentRole === 'User') res = await getExportExcelFileByOpportunity(null, null, parseData(currUserData)?.id);
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getExportExcelFileByOpportunity(parseData(currUserData)?.id);
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Opportunities</h2>
                </Col>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add Opportunity'
                                onClick={() => {
                                    setOpportunityModalOpen(true);
                                    setDefaultOpportunity(null);
                                    setIsEditOpportunity(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchOpportunities} screenType={screenType} />
                        </Col>
                    </Row>
                </Col>
            </Row><br /><br />
            <Row align='middle' justify='end'>
                <Col xl={4} lg={4} md={4} sm={4} xs={4}>
                    <Row>
                        <Input.Search
                            placeholder='Search'
                            enterButton
                            onSearch={onSearch}
                        />
                    </Row>
                </Col>
            </Row><br /><br />
            <Table
                columns={opportunityColumns}
                dataSource={filterTable === null ? opportunityList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 50%)' }}
            />
            <AppModal
                title={isEditOpportunity ? 'Update Opportunity' : 'Add Opportunity'}
                open={opportunityModalOpen}
                children={
                    <AddEditOpportunityForm
                        setOpportunityModalOpen={setOpportunityModalOpen}
                        defaultOpportunity={defaultOpportunity}
                        handleOpportunityFormValues={handleOpportunityFormValues}
                        isEditOpportunity={isEditOpportunity}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleOpportunityModal}
                onCancel={handleOpportunityModal}
            />
        </div>
    );
}

export default Opportunity;