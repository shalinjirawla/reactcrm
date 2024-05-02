import { Col, Divider, Form, Row } from 'antd';
import React from 'react';
import TextInput from '../TextInput';
import AppButton from '../AppButton';
import Selectable from '../Selectable';
import { activeStatusList } from '../../Constants';

const AddEditRoleForm = ({
    setRoleModalOpen,
    defaultRole,
    handleRoleFormValues,
    isEditRole
}) => {

    const [roleAddForm] = Form.useForm();

    return (
        <div>
            <Divider />
            <Form
                preserve={false}
                form={roleAddForm}
                name='addUserForm'
                className='addUserForm'
                layout='vertical'
            >
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Name'
                            name='roleName'
                            defaultVal={defaultRole?.name}
                            type='text'
                            required={true}
                            requiredMsg='Name is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Status'
                            name='roleStatus'
                            defaultVal={!isEditRole ? 'Active' : defaultRole?.status}
                            disabled={!isEditRole ? true : false}
                            required={true}
                            requiredMsg='Status is required!'
                            data={activeStatusList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                        />
                    </Col>
                </Row>
                <Divider />

                <Row justify='end'>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Row justify='end'>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Save'
                                    className='appPrimaryButton formWidth'
                                    onClick={() => {
                                        handleRoleFormValues(roleAddForm);
                                    }}
                                />
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        roleAddForm.resetFields();
                                        setRoleModalOpen(false);
                                    }}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

export default AddEditRoleForm;