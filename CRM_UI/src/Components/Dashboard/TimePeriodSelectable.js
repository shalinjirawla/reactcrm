import { Form } from 'antd';
import React from 'react';
import Selectable from '../Selectable';
import { timePeriodList } from '../../Constants';

const TimePeriodSelectable = ({ handleTimePeriodChange }) => {

    const [timePeriodForm] = Form.useForm();

    return (
        <div>
            <Form
                preserve={false}
                form={timePeriodForm}
                className='timePeriod'
            >
                <Selectable
                    name='timePeriodForm'
                    placeholder='By Time'
                    firstName='name'
                    data={timePeriodList}
                    defaultVal='Last 7 days'
                    handleSelectChange={(period) => {
                        handleTimePeriodChange(period);
                    }}
                />
            </Form>
        </div>
    );
}

export default TimePeriodSelectable;