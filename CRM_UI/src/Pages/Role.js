import { Col, Input, Modal, Row, Table, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../Components/AppButton';
import AppModal from '../Components/AppModal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addRole, deleteRole, getAllRole, getExportExcelFileByRole, updateRole } from '../Api/Api';
import { AuthContext } from '../Context/AuthProvider';
import { filterData } from '../Helper';
import ImportExport, { exportExcelResponse } from '../Components/ImportExport';
import AddEditRoleForm from '../Components/Role/AddEditRoleForm';

const Role = ({ screenType }) => {

    const roleColumns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            fixed: 'left',
            width: '50%',
            render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        {
            key: 'status',
            title: 'Status',
            dataIndex: 'status',
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

    const { currentRole, rsWidths: { is620, is930, is1100, is1200 }, isMobile, isTablet } = useContext(AuthContext) ?? {};
    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [defaultRole, setDefaultRole] = useState(null);
    const [isEditRole, setIsEditRole] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
        const temp = filterData(roleList, value);
        setFilterTable(temp);
    };

    useEffect(() => {
        if (currentRole === 'HostAdmin') fetchRoles();
    }, [currentRole]);

    const fetchRoles = async () => {
        const res = await getAllRole();
        if (res?.status === 200) {
            setRoleList(res?.data);
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
            title: `Role name: ${record?.name}`,
            content: 'Are you sure want to remove this Role?',
            okText: 'Remove',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await deleteRole(record?.id);
                    if (res?.data === true) {
                        message.success(record?.name + ' Role Deleted Successfully !!!');
                        fetchRoles();
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
            setRoleModalOpen(true);
            setDefaultRole(record);
            setIsEditRole(true);
        }
        if (isDelete) {
            showDeleteConfirm(record);
            return;
        }
    };

    const handleRoleModal = () => {
        setRoleModalOpen(!roleModalOpen);
    };

    const handleRoleFormValues = async (form) => {
        const { roleName, roleStatus } = form.getFieldsValue();

        if (roleName && roleStatus) {
            if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                return;
            }

            let data = {
                name: roleName,
                status: roleStatus
            };

            if (defaultRole) {
                data['id'] = defaultRole?.id;
            }

            if (!isEditRole) {
                try {
                    data['createdOn'] = new Date().toLocaleString();  
                    const res = await addRole(data);
                    if (res?.status === 200) {
                        setRoleModalOpen(false);
                        message.success('Role Added Successfully !!!');
                        fetchRoles();
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
            }

            if (isEditRole) {
                try {
                    const res = await updateRole(data);
                    if (res?.status === 200) {
                        setRoleModalOpen(false);
                        message.success(defaultRole?.name + ' Role Updated Successfully !!!');
                        fetchRoles();
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
        if (currentRole === 'HostAdmin') res = await getExportExcelFileByRole();
        exportExcelResponse(res);
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Roles</h2>
                </Col>
                <Col xl={3} lg={3} md={3} sm={3} xs={3}>
                    <Row justify='end'>
                        <Col xl={20} lg={20} md={20} sm={20} xs={20}>
                            <AppButton
                                className='appPrimaryButton tabBtn'
                                icon={<PlusOutlined />}
                                label='Add Role'
                                onClick={() => {
                                    setRoleModalOpen(true);
                                    setDefaultRole(null);
                                    setIsEditRole(false);
                                }}
                            />
                        </Col>
                        <Col xl={4} lg={4} md={4} sm={4} xs={4} className='d-flex'>
                            <ImportExport handleExport={handleExport} fetchData={fetchRoles} screenType={screenType} />
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
                columns={roleColumns}
                dataSource={filterTable === null ? roleList : filterTable}
                pagination={{ showSizeChanger: true }}
                scroll={is1200 && { x: 'calc(700px + 6%)' }}
            />
            <AppModal
                title={isEditRole ? 'Update Role' : 'Add Role'}
                open={roleModalOpen}
                children={
                    <AddEditRoleForm
                        setRoleModalOpen={setRoleModalOpen}
                        defaultRole={defaultRole}
                        handleRoleFormValues={handleRoleFormValues}
                        isEditRole={isEditRole}
                    />
                }
                width={isMobile ? '55%' : is620 ? '50%' : isTablet ? '45%' : is930 ? '40%' : is1100 ? '35%' : '30%'}
                onOk={handleRoleModal}
                onCancel={handleRoleModal}
            />
        </div>
    );
}

export default Role;