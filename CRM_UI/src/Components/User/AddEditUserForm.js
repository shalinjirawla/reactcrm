import { Col, Divider, Form, Row, Switch } from 'antd';
import React, { useContext } from 'react';
import TextInput from '../TextInput';
import Selectable from '../Selectable';
import { roleList } from '../../Constants';
import AppButton from '../AppButton';
import { AuthContext } from '../../Context/AuthProvider';

const AddEditUserForm = ({
    screenType,
    setUserModalOpen,
    defaultUser,
    handleUserFormValues,
    isEditUser
}) => {

    const { currentRole } = useContext(AuthContext) ?? {};
    const [userAddForm] = Form.useForm();

    const getUserList = () => {
        if (currentRole !== 'HostAdmin') {
            return roleList?.filter(o => o.type === 'Tenant');
        }
    };

    return (
        <div>
            <Divider />
            <Form
                preserve={false}
                form={userAddForm}
                name='addUserForm'
                className='addUserForm'
                layout='vertical'
            >
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Name'
                            name='userName'
                            defaultVal={defaultUser?.name}
                            type='text'
                            required={true}
                            requiredMsg='Name is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Password'
                            name='userPassword'
                            defaultVal={defaultUser?.password}
                            type='password'
                            required={true}
                            requiredMsg='Password is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Email'
                            name='userEmail'
                            defaultVal={defaultUser?.email}
                            type='email'
                            required={true}
                            requiredMsg='Email is required!'
                            typeMsg='Enter a valid Email!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Mobile Number'
                            name='userMobile'
                            defaultVal={defaultUser?.mobileNumber}
                            type='text'
                            required={true}
                            requiredMsg='Mobile Number is required!'
                            typeMsg='Enter a valid Mobile Number!'
                            min={10}
                            max={10}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </Col>
                </Row>
                {(screenType === 'Tenant' && isEditUser) &&
                    <Row>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <Form.Item
                                label='Status'
                                name='userIsActive'
                                initialValue={defaultUser?.isActive}
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                }
                {(currentRole !== 'HostAdmin') &&
                    <Row justify='space-between'>
                        <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                            <Selectable
                                label='Role'
                                name='userRole'
                                defaultVal={defaultUser?.roleId}
                                required={true}
                                requiredMsg='Role is required!'
                                data={getUserList()}
                                firstName='name'
                                showSearch={false}
                                handleSelectChange={(val) => {}}
                            />
                        </Col>
                    </Row>
                }
                <Divider />

                <Row justify='end'>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Row justify='end'>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Save'
                                    className='appPrimaryButton formWidth'
                                    onClick={() => {
                                        handleUserFormValues(userAddForm);
                                    }}
                                />
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        userAddForm.resetFields();
                                        setUserModalOpen(false);
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

export default AddEditUserForm;