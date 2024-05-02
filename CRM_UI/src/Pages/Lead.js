import { Col, Input, Modal, Row, Table, message, Tag, Progress } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addLead, deleteLead, getAllLead, getAllLeadByTenant, getAllLeadByTenantAdmin, getAllLeadByUser, getExportExcelFileByLead, updateLead } from '../Api/Api';
import { leadCustomerNeedList, leadStageList, leadStatusList, leadTypeList } from '../Constants';
import { filterData, parseData } from '../Helper';
import { AuthContext } from '../Context/AuthProvider';
import AddEditLeadForm from '../Components/Lead/AddEditLeadForm';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';

const Lead = ({ screenType }) => {

    const leadColumns = [
        {
            key: 'mergedColumn',
            title: 'Name',
            dataIndex: 'mergedColumn',
            fixed: 'left',
            render: (val, record) => (
                <>
                    {record.customerNeedId ? leadCustomerNeedList?.find(o => o?._id === record.customerNeedId)?.name : '-'}
                    {' / '}
                    {record.contact ? record.contact : ''}
                    {record.account ? ', ' : ''}
                    {record.account ? record.account : ''}
                </>
            )
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
            key: 'statusId',
            title: 'Status',
            dataIndex: 'statusId',
            render: (val) => val ? <div><Tag className='tagFont' color={getStatusTagColor(val)}>{leadStatusList?.find(o => o?._id === val)?.name}</Tag></div> : <div></div>
        },
        {
            key: 'typeId',
            title: 'Lead type',
            dataIndex: 'typeId',
            render: (val) => val ? <div>{leadTypeList?.find(o => o?._id === val)?.name}</div> : <div></div>
        },
        {
            key: 'stageId',
            title: 'Stage',
            dataIndex: 'stageId',
            render: (val) => val ? <div>{leadStageList?.find(o => o?._id === val)?.name}{getStageShowProgress(val)}</div> : <div></div>
        },
        {
            key: 'createdOn',
            title: 'Created on',
            dataIndex: 'createdOn',
            render: (val) => val ? <div>{new Date(val).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).replace(',', '')}</div> : <div></div>
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
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [defaultLead, setDefaultLead] = useState(null);
    const [isEditLead, setIsEditLead] = useState(false);
    const [leadList, setLeadList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
        const temp = filterData(leadList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        let res;
        if (currentRole === 'HostAdmin') {
            res = await getAllLead();
        } else if (currentRole === 'Admin') {
            res = await getAllLeadByTenantAdmin(parseData(currUserData)?.tenantId);
        } else if (currentRole === 'HostUser' || currentRole === 'User') {
            res = await getAllLeadByUser(parseData(currUserData)?.id);
        } else if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') {
            res = await getAllLeadByTenant(parseData(currUserData)?.id);
        }
        if (res?.status === 200) {
            setLeadList(res?.data);
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Lead name: ${record?.contact}`,
            content: 'Are you sure want to remove this Lead?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteLead(record?.id);
                    if (res?.data === true) {
                        message.success(record?.contact + "'s Lead Deleted Successfully !!!");
                        fetchLeads();
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
            setLeadModalOpen(true);
            setDefaultLead(record);
            setIsEditLead(true);
        }
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const getStatusTagColor = (val) => {
        return leadStatusList?.find(o => o._id === val)?.color;
    };

    const getStageShowProgress = (val) => {
        return (val === 2 || val === 3 || val === 6 || val === 10) &&
            <Progress
                size='small'
                percent={getStageProgressPercent(val)}
                status={val === 2 ? 'exception' : 'success'}
                showInfo={false}
            />
    };
    
    const getStageProgressPercent = (val) => {
        return val === 2 ? 100 : val === 3 ? 100 : val === 6 ? 35 : val === 10 ? 65 : 0;
    };

    const handleLeadModal = () => {
        setLeadModalOpen(!leadModalOpen);
    };

    const handleLeadFormValues = async (form) => {
        const { addLeadCustomerNeed, addLeadContact, addLeadAccount, addLeadStatus, addLeadType, addLeadStage, addLeadComments } = form.getFieldsValue();

        if (addLeadCustomerNeed && addLeadContact) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                customerNeedId: addLeadCustomerNeed,
                contact: addLeadContact,
                account: addLeadAccount ? addLeadAccount : '',
                statusId: addLeadStatus ? addLeadStatus : (!isEditLead ? leadStatusList?.find(o => o?.name === 'New')?._id : null),
                typeId: addLeadType ? addLeadType : null,
                stageId: addLeadStage ? addLeadStage : (!isEditLead ? leadStageList?.find(o => o?.name === 'Marketing qualified lead')?._id : null),
                comments: addLeadComments ? addLeadComments : '',
            };

            if (currentRole === 'HostAdmin' || currentRole === 'HostUser') {
                data['tenantId'] = null;
            } else if (currentRole === 'Admin' || currentRole === 'User') {
                data['tenantId'] = parseData(currUserData)?.tenantId;
            } else {
                data['tenantId'] = parseData(currUserData)?.id;
            }

            if (!isEditLead) {
                if (currentRole === 'HostAdmin' || currentRole === 'HostUser' || currentRole === 'Admin' || currentRole === 'User') {
                    data['roleId'] = parseData(currUserData)?.roleId;
                    data['userId'] = parseData(currUserData)?.id;
                } else {
                    data['roleId'] = null;
                    data['userId'] = null;
                }
            } else {
                data['roleId'] = defaultLead?.roleId;
                data['userId'] = defaultLead?.userId;
            }

            if (defaultLead) {
                data['id'] = defaultLead?.id;
            }

            if (!isEditLead) {
                try {
                    data['createdOn'] = new Date().toLocaleString();
                    const res = await addLead(data);
                    if (res?.status === 200) {
                        setLeadModalOpen(false);
                        message.success('Lead Added Successfully !!!');
                        fetchLeads();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

            if (isEditLead) {
                try {
                    const res = await updateLead(data);
                    if (res?.status === 200) {
                        setLeadModalOpen(false);
                        message.success(defaultLead?.contact + "'s Lead Updated Successfully !!!");
                        fetchLeads();
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
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByLead();
        if (currentRole === 'Admin') res = await getExportExcelFileByLead(null, parseData(currUserData)?.tenantId);
        if (currentRole === 'HostUser' || currentRole === 'User') res = await getExportExcelFileByLead(null, null, parseData(currUserData)?.id);
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getExportExcelFileByLead(parseData(currUserData)?.id);
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Leads</h2>
                </Col>
                <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add Lead'
                                onClick={() => {
                                    setLeadModalOpen(true);
                                    setDefaultLead(null);
                                    setIsEditLead(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchLeads} screenType={screenType} />
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
                columns={leadColumns}
                dataSource={filterTable === null ? leadList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 50%)' }}
            />
            <AppModal
                title={isEditLead ? 'Update Lead' : 'Add Lead'}
                open={leadModalOpen}
                children={
                    <AddEditLeadForm
                        setLeadModalOpen={setLeadModalOpen}
                        defaultLead={defaultLead}
                        handleLeadFormValues={handleLeadFormValues}
                        isEditLead={isEditLead}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleLeadModal}
                onCancel={handleLeadModal}
            />
        </div>
    );
}

export default Lead;