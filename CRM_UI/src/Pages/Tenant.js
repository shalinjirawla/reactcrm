import { Col, Input, Modal, Row, Table, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addTenant, deleteTenant, getAllTenant, getExportExcelFileByTenant, updateTenant } from '../Api/Api';
import AddEditUserForm from '../Components/User/AddEditUserForm';
import { useDispatch } from 'react-redux';
import { setTenantData } from '../Redux/Features/UserDataSlice';
import { AuthContext } from '../Context/AuthProvider';
import { filterData } from '../Helper';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';

const Tenant = ({ screenType }) => {

    const tenantColumns = [
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
            key: 'isActive',
            title: 'Status',
            dataIndex: 'isActive',
            render: (val) => val ? <div>Active</div> : <div>Inactive</div>
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

    const dispatch = useDispatch();
    const { currentRole, rsWidths: { is620, is930, is1100, is1200 }, isMobile, isTablet } = useContext(AuthContext) ?? {};
    const [userModalOpen, setUserModalOpen] = useState(false);
    const [defaultUser, setDefaultUser] = useState(null);
    const [isEditUser, setIsEditUser] = useState(false);
    const [tenantList, setTenantList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
        const temp = filterData(tenantList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        if (currentRole === 'HostAdmin') fetchTenants();
    }, [currentRole]);

    const fetchTenants = async () => {
        const res = await getAllTenant();
        if (res?.status === 200) {
            setTenantList(res?.data);
            dispatch(setTenantData(res?.data));
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Tenant name: ${record?.name}`,
            content: 'Are you sure want to remove this Tenant?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteTenant(record?.id);
                    if (res?.data === true) {
                        message.success(record?.name + ' Tenant Deleted Successfully !!!');
                        fetchTenants();
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
        const { userName, userPassword, userEmail, userMobile, userIsActive } = form.getFieldsValue();

        if (userName && userPassword && userEmail && userMobile) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                name: userName,
                password: userPassword,
                email: userEmail,
                mobileNumber: userMobile
            };

            if (defaultUser) {
                data['id'] = defaultUser?.id;
            }

            if (isEditUser) {
                data['isActive'] = userIsActive;
            }

            if (!isEditUser) {
                try {
                    data['createdOn'] = new Date().toLocaleString();  
                    const res = await addTenant(data);
                    if (res?.status === 200) {
                        setUserModalOpen(false);
                        message.success('Tenant Added Successfully !!!');
                        fetchTenants();
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
                    const res = await updateTenant(data);
                    if (res?.status === 200) {
                        setUserModalOpen(false);
                        message.success(defaultUser?.name + ' Tenant Updated Successfully !!!');
                        fetchTenants();
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
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByTenant();
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Tenants</h2>
                </Col>
                <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add Tenant'
                                onClick={() => {
                                    setUserModalOpen(true);
                                    setDefaultUser(null);
                                    setIsEditUser(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchTenants} screenType={screenType} />
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
                columns={tenantColumns}
                dataSource={filterTable === null ? tenantList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 6%)' }}
            />
            <AppModal
                title={isEditUser ? 'Update Tenant' : 'Add Tenant'}
                open={userModalOpen}
                children={
                    <AddEditUserForm
                        screenType={screenType}
                        setUserModalOpen={setUserModalOpen}
                        defaultUser={defaultUser}
                        handleUserFormValues={handleUserFormValues}
                        isEditUser={isEditUser}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleUserModal}
                onCancel={handleUserModal}
            />
        </div>
    );
}

export default Tenant;