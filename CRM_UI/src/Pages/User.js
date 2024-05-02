import { Col, Input, Modal, Row, Table, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addUser, deleteUser, getAllUser, getAllUserOfTenant, getExportExcelFileByUser, updateUser } from '../Api/Api';
import { roleList } from '../Constants';
import AddEditUserForm from '../Components/User/AddEditUserForm';
import { AuthContext } from '../Context/AuthProvider';
import { filterData, parseData } from '../Helper';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';

const User = ({ screenType }) => {

    const userColumns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            fixed: 'left',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'password',
            title: 'Password',
            dataIndex: 'password',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'mobileNumber',
            title: 'Mobile Number',
            dataIndex: 'mobileNumber',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
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
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [defaultUser, setDefaultUser] = useState(null);
    const [isEditUser, setIsEditUser] = useState(false);
    const [userList, setUserList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);
    
    const onSearch = (value) => {
        const temp = filterData(userList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        let res;
        if (currentRole === 'HostAdmin') {
            res = await getAllUser();
        } else if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') {
            res = await getAllUserOfTenant(parseData(currUserData)?.id);
        }
        if (res?.status === 200) {
            setUserList(res?.data);
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `User name: ${record?.name}`,
            content: 'Are you sure want to remove this User?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteUser(record?.id);
                    if (res?.data === true) {
                        message.success(record?.name + ' User Deleted Successfully !!!');
                        fetchUsers();
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
            setUserModalOpen(true);
            setDefaultUser(record);
            setIsEditUser(true);
        }
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const handleUserModal = () => {
        setUserModalOpen(!userModalOpen);
    };

    const handleUserFormValues = async (form) => {
        const { userName, userPassword, userEmail, userMobile, userRole } = form.getFieldsValue();

        if (userName && userPassword && userEmail && userMobile) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                name: userName,
                password: userPassword,
                email: userEmail,
                mobileNumber: userMobile,
                tenantId: (currentRole !== 'HostAdmin') ? JSON.parse(currUserData)?.id : null
            };

            if (currentRole !== 'HostAdmin') {
                data['roleId'] = userRole;
            } else if (currentRole === 'HostAdmin') {
                data['roleId'] = roleList?.find(o => o.name === 'HostUser')?._id;
            } else {
                return message.error('Please Add Required Fields!');
            }

            if (defaultUser) {
                data['id'] = defaultUser?.id;
            }

            if (!isEditUser) {
                try {
                    data['createdOn'] = new Date().toLocaleString();
                    const res = await addUser(data);
                    if (res?.status === 200) {
                        setUserModalOpen(false);
                        message.success('User Added Successfully !!!');
                        fetchUsers();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

            if (isEditUser) {
                try {
                    const res = await updateUser(data);
                    if (res?.status === 200) {
                        setUserModalOpen(false);
                        message.success(defaultUser?.name + ' User Updated Successfully !!!');
                        fetchUsers();
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
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByUser();
        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') res = await getExportExcelFileByUser(parseData(currUserData)?.id);
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Users</h2>
                </Col>
                <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add User'
                                onClick={() => {
                                    setUserModalOpen(true);
                                    setDefaultUser(null);
                                    setIsEditUser(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchUsers} screenType={screenType} />
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
                columns={userColumns}
                dataSource={filterTable === null ? userList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 20%)' }}
            />
            <AppModal
                title={isEditUser ? 'Update User' : 'Add User'}
                open={userModalOpen}
                children={
                    <AddEditUserForm
                        screenType={screenType}
                        setUserModalOpen={setUserModalOpen}
                        defaultUser={defaultUser}
                        handleUserFormValues={handleUserFormValues}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleUserModal}
                onCancel={handleUserModal}
            />
        </div>
    );
}

export default User;