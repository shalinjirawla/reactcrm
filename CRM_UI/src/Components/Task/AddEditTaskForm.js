import { Col, DatePicker, Divider, Form, Row } from 'antd';
import React from 'react';
import TextInput from '../TextInput';
import Selectable from '../Selectable';
import AppButton from '../AppButton';
import { taskCategoryList, taskStatusList } from '../../Constants';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { getSelectLabel, getSelectOptionData } from '../../Helper';

const AddEditTaskForm = ({
    setTaskModalOpen,
    defaultTask,
    handleTaskFormValues
}) => {

    const { contactData, accountData } = useSelector((state) => state.userData) ?? {};
    const [taskAddForm] = Form.useForm();

    const labelRender = (item) => {
        item.title = taskStatusList?.find(o => o?._id === item.value)?.color;
        return getSelectLabel(item);
    };

    return (
        <div>
            <Divider />
            <Form
                preserve={false}
                form={taskAddForm}
                name='addUserForm'
                className='addUserForm'
                layout='vertical'
            >
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <TextInput
                            label='Subject'
                            name='addTaskSubject'
                            defaultVal={defaultTask?.subject}
                            type='text'
                            required={true}
                            requiredMsg='Subject is required!'
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Owner'
                            name='addTaskOwner'
                            defaultVal={defaultTask?.owner}
                            required={true}
                            requiredMsg='Owner is required!'
                            data={contactData}
                            firstName='contactName'
                            showSearch={true}
                            handleSelectChange={(val) => {}}
                            options={(contactData || []).map(o => ({
                                value: o.contactName
                            }))}
                            allowClear={true}
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <Selectable
                            label='Account'
                            name='addTaskAccount'
                            defaultVal={defaultTask?.account}
                            required={false}
                            requiredMsg='Account is required!'
                            data={accountData}
                            firstName='accountName'
                            showSearch={true}
                            handleSelectChange={(val) => {}}
                            options={(accountData || []).map(o => ({
                                value: o.accountName
                            }))}
                            allowClear={true}
                        />
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Form.Item
                            label='Start Date'
                            name='addTaskStartDate'
                            initialValue={defaultTask ? dayjs(new Date(defaultTask?.startDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                            rules={[{ required: true, message: 'Start Date is required!'}]}
                        >
                            <DatePicker
                                className='datePicker'
                                placeholder=''
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>
                    </Col>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Form.Item
                            label='Due Date'
                            name='addTaskDueDate'
                            initialValue={defaultTask ? dayjs(new Date(defaultTask?.endDate).toLocaleDateString('en-GB'), 'DD/MM/YYYY') : null}
                            rules={[{ required: true, message: 'Due Date is required!'}]}
                        >
                            <DatePicker
                                className='datePicker'
                                placeholder=''
                                format='DD/MM/YYYY'
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify='space-between'>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Selectable
                            label='Category'
                            name='addTaskCategory'
                            defaultVal={defaultTask?.categoryId}
                            required={true}
                            requiredMsg='Category is required!'
                            data={taskCategoryList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                        />
                    </Col>
                    <Col xl={11} lg={11} md={11} sm={11} xs={11}>
                        <Selectable
                            label='Status'
                            name='addTaskStatus'
                            defaultVal={defaultTask?.statusId}
                            required={true}
                            requiredMsg='Status is required!'
                            data={taskStatusList}
                            firstName='name'
                            showSearch={false}
                            handleSelectChange={(val) => {}}
                            options={(taskStatusList || []).map(o => ({
                                value: o._id,
                                label: o.name,
                                tagColor: o.color
                            }))}
                            optionRender={getSelectOptionData}
                            labelRender={labelRender}
                            popupClassName='renderLabel'
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
                                        handleTaskFormValues(taskAddForm);
                                    }}
                                />
                            </Col>
                            <Col xl={12} lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }}>
                                <AppButton
                                    label='Cancel'
                                    className='appButton formWidth'
                                    onClick={() => {
                                        taskAddForm.resetFields();
                                        setTaskModalOpen(false);
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

export default AddEditTaskForm;