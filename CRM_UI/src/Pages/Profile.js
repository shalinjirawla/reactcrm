import React, { useContext } from 'react';
import { Col, Row, Form, Divider, Switch, message } from 'antd';
import TextInput from '../Components/TextInput';
import AppButton from '../Components/AppButton';
import { AuthContext } from '../Context/AuthProvider';
import { updateTenant, updateUser } from '../Api/Api';
import { parseData } from '../Helper';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileData } from '../Redux/Features/UserDataSlice';

const Profile = () => {

    const dispatch = useDispatch();
    const { profileData } = useSelector((state) => state.userData) ?? {};
    const { currUserData, currentRole } = useContext(AuthContext) ?? {};
    const [userProfileForm] = Form.useForm();

    const handleProfileFormValues = async (form) => {
        const { userName, userPassword, userEmail, userMobile, userIsActive } = form.getFieldsValue();

        if (currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') {
            if (userName && userPassword && userEmail && userMobile) {
                if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                    return;
                }
    
                let data = {
                    id: parseData(currUserData)?.id,
                    name: userName,
                    password: userPassword,
                    email: userEmail,
                    mobileNumber: userMobile,
                    isActive: userIsActive
                };
    
                try {
                    const res = await updateTenant(data);
                    if (res?.status === 200) {
                        message.success('Profile Updated Successfully !!!');
                        dispatch(setProfileData(({
                            name: data.name,
                            password: data.password,
                            email: data.email,
                            mobileNumber: data.mobileNumber,
                            isActive: data.isActive
                        })));
                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
    
            } else {
                message.error('Please Add Required Fields!')
            }
        } 

        else if (currentRole === 'HostAdmin' || currentRole === 'HostUser' || currentRole === 'Admin' || currentRole === 'User') {
            if (userName && userPassword && userEmail && userMobile) {
                if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                    return;
                }
    
                let data = {
                    id: parseData(currUserData)?.id,
                    name: userName,
                    password: userPassword,
                    email: userEmail,
                    mobileNumber: userMobile,
                    roleId: parseData(currUserData)?.roleId,
                    tenantId: (currentRole !== 'HostAdmin' && currentRole !== 'HostUser') ? parseData(currUserData)?.tenantId : 0
                };

                try {
                    const res = await updateUser(data);
                    if (res?.status === 200) {
                        message.success('Profile Updated Successfully !!!');

                        dispatch(setProfileData(({
                            name: data.name,
                            password: data.password,
                            email: data.email,
                            mobileNumber: data.mobileNumber,
                        })));

                        // userProfileForm.setFieldValue({
                        //     userName: data.name,
                        //     userPassword: data.password,
                        //     userEmail: data.email,
                        //     userMobile: data.mobileNumber
                        // });

                        return;
                    } else {
                        message.error(res?.data?.message);
                    }
                } catch (error) {
                    message.error(error?.respond?.data?.error);
                }
    
            } else {
                message.error('Please Add Required Fields!')
            }
        }
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                    <h2 className='allPageHeader'>Profile</h2>
                </Col>
            </Row>
            <Divider />

            <Form
                preserve={false}
                form={userProfileForm}
                name="user_profileForm"
                className="profileForm"
            >
                <br />
                <Row justify='space-between'>
                    <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                        <TextInput
                            label='Name'
                            name='userName'
                            defaultVal={profileData ? profileData?.name : parseData(currUserData)?.name}
                            type='text'
                            required={true}
                            requiredMsg='Name is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                        <TextInput
                            label='Password'
                            name='userPassword'
                            defaultVal={profileData ? profileData?.password : parseData(currUserData)?.password}
                            type='password'
                            required={true}
                            requiredMsg='Password is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                        <TextInput
                            label='Email'
                            name='userEmail'
                            defaultVal={profileData ? profileData?.email : parseData(currUserData)?.email}
                            type='email'
                            required={true}
                            requiredMsg='Email is required!'
                            typeMsg='Enter a valid Email!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                        <TextInput
                            label='Mobile Number'
                            name='userMobile'
                            defaultVal={profileData ? profileData?.mobileNumber : parseData(currUserData)?.mobileNumber}
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
                {(currentRole !== 'HostAdmin' && currentRole !== 'HostUser' && currentRole !== 'Admin' && currentRole !== 'User') &&
                    <Row>
                        <Col xl={10} lg={10} md={10} sm={10} xs={10}>
                            <Form.Item
                                label='Status'
                                name='userIsActive'
                                initialValue={profileData ? profileData?.isActive : parseData(currUserData)?.isActive}
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                }
                <Divider />

                <Row justify='end'>
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                        <Row justify='end'>
                            <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Save'
                                    className='appPrimaryButton formWidth'
                                    onClick={() => {
                                        handleProfileFormValues(userProfileForm);
                                    }}
                                />
                            </Col>
                            <Col xl={6} lg={6} md={6} sm={6} xs={6} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        userProfileForm.resetFields();
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

export default Profile;