import React from 'react';
import { useNavigate } from 'react-router-dom';
import TextInput from '../Components/TextInput';
import { Form, message } from 'antd';
import AppButton from '../Components/AppButton';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePhone } from "react-icons/md";
import { tenantRegistration } from '../Api/Api';
import '../Styles/login.css';

const Registration = () => {

    const navigate = useNavigate();
    const [userRegisterInfo] = Form.useForm();

    const checkConfirmPassword = (e) => {
        let { registerPassword } = userRegisterInfo.getFieldsValue();
        if (registerPassword !== e.target.value) {
            userRegisterInfo.setFields([{ name: 'registerConfirmPassword', errors: ['Not matched with Password'] }]);
            return;
        } else {
            userRegisterInfo.setFields([{ name: 'registerConfirmPassword', errors: [] }]);
        }
    };

    const handleRegister = async (val) => {
        try {
            const res = await tenantRegistration({ name: val.registerUsername, password: val.registerPassword, email: val.registerEmail, mobileNumber: val.registerMobile, createdOn: new Date().toLocaleString() });
            if (res?.status === 200) {
                localStorage.setItem('registerTenantData', JSON.stringify(res?.data));
                message.success('Your Registration is Successful !!!');
                return navigate('/verification', {
                    state: {
                        tenantId: res?.data?.id
                    }
                });
            } else {
                message.error(res?.data);
            }
        } catch (error) {
            message.error('Login Error');
        }
    };

    return (
        <div>
            <Form
                preserve={false}
                form={userRegisterInfo}
                name="normal_register"
                className="registerForm"
                onFinish={(values) => handleRegister(values)}
            >
                <h2>Welcome!</h2>
                <br />
                <TextInput
                    name='registerUsername'
                    type='text'
                    placeholder='Username'
                    required={true}
                    requiredMsg='Please input your Username!'
                    prefix={<UserOutlined />}
                />
                <TextInput
                    name='registerPassword'
                    type='password'
                    placeholder='Password'
                    required={true}
                    requiredMsg='Please input your Password!'
                    prefix={<LockOutlined />}
                />
                <TextInput
                    name='registerConfirmPassword'
                    type='password'
                    placeholder='Confirm Password'
                    required={true}
                    requiredMsg='Please input your Password!'
                    prefix={<LockOutlined />}
                    onBlur={checkConfirmPassword}
                />
                <TextInput
                    name='registerEmail'
                    type='email'
                    placeholder='Email'
                    required={true}
                    requiredMsg='Email is required!'
                    typeMsg='Enter a valid Email!'
                    prefix={<MdOutlineMailOutline />}
                />
                <TextInput
                    name='registerMobile'
                    type='text'
                    placeholder='Mobile Number'
                    required={true}
                    requiredMsg='Mobile Number is required!'
                    typeMsg='Enter a valid Mobile Number!'
                    prefix={<MdOutlinePhone />}
                    min={10}
                    max={10}
                    onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
                <Form.Item>
                    <AppButton
                        type="primary"
                        htmlType="submit"
                        label='Register'
                        className="appPrimaryButton login-form-button"
                    />
                </Form.Item>
            </Form>
        </div>
    );
}

export default Registration;