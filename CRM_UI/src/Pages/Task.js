import { Col, Input, Modal, Row, Table, Tag, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addTask, deleteTask, getAllTask, getAllTaskByTenant, getAllTaskByTenantAdmin, getAllTaskByUser, getExportExcelFileByTask, updateTask } from '../Api/Api';
import AddEditTaskForm from '../Components/Task/AddEditTaskForm';
import { taskCategoryList, taskStatusList } from '../Constants';
import dayjs from 'dayjs';
import { dateFormat, filterData, parseData } from '../Helper';
import { AuthContext } from '../Context/AuthProvider';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';

const Task = ({ screenType }) => {

    const taskColumns = [
        {
            key: 'subject',
            title: 'Subject',
            dataIndex: 'subject',
            fixed: 'left',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'owner',
            title: 'Owner',
            dataIndex: 'owner',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'account',
            title: 'Account',
            dataIndex: 'account',
            render: (val) => val ? <div>{val}</div> : <div></div>
        },
        {
            key: 'startDate',
            title: 'Start Date',
            dataIndex: 'startDate',
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: 'endDate',
            title: 'Due Date',
            dataIndex: 'endDate',
            render: (val) => val ? <div>{dayjs(new Date(val)).format('DD/MM/YYYY')}</div> : <div>-</div>
        },
        {
            key: 'categoryId',
            title: 'Category',
            dataIndex: 'categoryId',
            render: (val) => val ? <div>{taskCategoryList?.find(o => o?._id === val)?.name}</div> : <div>-</div>
        },
        {
            key: 'statusId',
            title: 'Status',
            dataIndex: 'statusId',
            render: (val) => val ? <div><Tag className='tagFont' color={getStatusTagColor(val)}>{taskStatusList.find(o => o?._id === val)?.name}</Tag></div> : <div>-</div>
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
    const [taskModalOpen, setTaskModalOpen] = useState(false);
    const [defaultTask, setDefaultTask] = useState(null);
    const [isEditTask, setIsEditTask] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
        const temp = filterData(taskList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        let res;
        if (currentRole === 'HostAdmin') {
            res = await getAllTask();
        } else if (currentRole === 'Admin') {
            res = await getAllTaskByTenantAdmin(parseData(currUserData)?.tenantId);
        } else if (currentRole === 'HostUser' || currentRole === 'User') {
            res = await getAllTaskByUser(parseData(currUserData)?.id);
        } else if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') {
            res = await getAllTaskByTenant(parseData(currUserData)?.id);
        }
        if (res?.status === 200) {
            setTaskList(res?.data);
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Task name: ${record?.subject}`,
            content: 'Are you sure want to remove this Task?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteTask(record?.id);
                    if (res?.data === true) {
                        message.success(record?.subject + ' Task Deleted Successfully !!!');
                        fetchTasks();
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
            setTaskModalOpen(true);
            setDefaultTask(record);
            setIsEditTask(true);
        }
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const getStatusTagColor = (val) => {
        return taskStatusList?.find(o => o._id === val)?.color;
    };

    const handleTaskModal = () => {
        setTaskModalOpen(!taskModalOpen);
    };

    const handleTaskFormValues = async (form) => {
        const { addTaskSubject, addTaskOwner, addTaskAccount, addTaskStartDate, addTaskDueDate, addTaskCategory, addTaskStatus } = form.getFieldsValue();

        if (addTaskSubject && addTaskOwner && addTaskStartDate && addTaskDueDate && addTaskCategory && addTaskStatus) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                subject: addTaskSubject,
                owner: addTaskOwner,
                account: addTaskAccount ? addTaskAccount : '',
                startDate: dateFormat(addTaskStartDate),
                endDate: dateFormat(addTaskDueDate),
                categoryId: addTaskCategory,
                statusId: addTaskStatus
            };

            if (currentRole === 'HostAdmin' || currentRole === 'HostUser') {
                data['tenantId'] = null;
            } else if (currentRole === 'Admin' || currentRole === 'User') {
                data['tenantId'] = parseData(currUserData)?.tenantId;
            } else {
                data['tenantId'] = parseData(currUserData)?.id;
            }

            if (!isEditTask) {
                if (currentRole === 'HostAdmin' || currentRole === 'HostUser' || currentRole === 'Admin' || currentRole === 'User') {
                    data['roleId'] = parseData(currUserData)?.roleId;
                    data['userId'] = parseData(currUserData)?.id;
                } else {
                    data['roleId'] = null;
                    data['userId'] = null;
                }
            } else {
                data['roleId'] = defaultTask?.roleId;
                data['userId'] = defaultTask?.userId;
            }

            if (defaultTask) {
                data['id'] = defaultTask?.id;
            }

            if (!isEditTask) {
                try {
                    data['createdOn'] = new Date().toLocaleString();
                    const res = await addTask(data);
                    if (res?.status === 200) {
                        setTaskModalOpen(false);
                        message.success('Task Added Successfully !!!');
                        fetchTasks();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

            if (isEditTask) {
                try {
                    const res = await updateTask(data);
                    if (res?.status === 200) {
                        setTaskModalOpen(false);
                        message.success(defaultTask?.subject + ' Task Updated Successfully !!!');
                        fetchTasks();
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
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByTask();
        if (currentRole === 'Admin') res = await getExportExcelFileByTask(null, parseData(currUserData)?.tenantId);
        if (currentRole === 'HostUser' || currentRole === 'User') res = await getExportExcelFileByTask(null, null, parseData(currUserData)?.id);
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getExportExcelFileByTask(parseData(currUserData)?.id);
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Tasks</h2>
                </Col>
                <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add Task'
                                onClick={() => {
                                    setTaskModalOpen(true);
                                    setDefaultTask(null);
                                    setIsEditTask(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchTasks} screenType={screenType} />
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
                columns={taskColumns}
                dataSource={filterTable === null ? taskList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 50%)' }}
            />
            <AppModal
                title={isEditTask ? 'Update Task' : 'Add Task'}
                open={taskModalOpen}
                children={
                    <AddEditTaskForm
                        setTaskModalOpen={setTaskModalOpen}
                        defaultTask={defaultTask}
                        handleTaskFormValues={handleTaskFormValues}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleTaskModal}
                onCancel={handleTaskModal}
            />
        </div>
    );
}

export default Task;