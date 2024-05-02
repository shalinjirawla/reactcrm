import { Form, Input, InputNumber } from 'antd';
import { MaskedInput } from 'antd-mask-input';
import React from 'react';

const TextInput = ({
    label,
    name,
    min = 0,
    max = 50,
    type,
    required = false,
    defaultVal,
    requiredMsg,
    minMsg,
    maxMsg,
    patternName = '',
    mask = '',
    patternMsg,
    typeMsg,
    placeholder,
    className = '',
    disabled = false,
    dependencies = [],
    ...props
}) => {
    return (
        <div className={className ? className : "TextInput"}>
            <Form.Item
                name={name}
                initialValue={defaultVal}
                label={label}
                dependencies={dependencies}
                className='textInputFormItem'
                validateTrigger='onChange'
                rules={type !== 'number' && [
                    {
                        type: type,
                        message: typeMsg,
                    },
                    {
                        pattern: (name === 'name' || patternName === 'name') ? new RegExp(/^[a-zA-Z@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]+$/i) : 
                                (patternName === 'onlyNumber') ? new RegExp(/^(0|[1-9][0-9]*)$/) :
                                (patternName === 'percentage') ? new RegExp(/^((0|[1-9]\d?)(\.\d{1,2})?|100(\.00?)?)$/) : null,
                        message: patternMsg
                    },
                    {
                        required: required,
                        message: requiredMsg,
                    },
                    {
                        min: min,
                        message: minMsg
                    },
                    {
                        max: max,
                        message: maxMsg
                    }
                ]}
            >
            {type === 'password' ?
                <Input.Password
                    {...props}
                    placeholder={placeholder}
                    disabled={disabled}
                /> 
                : type === 'number' ?
                <InputNumber
                    {...props}
                    placeholder={placeholder}
                    disabled={disabled}
                    controls={false}
                />
                : mask ? 
                <MaskedInput
                    {...props}
                    mask={mask}
                    placeholder={placeholder}
                    disabled={disabled}
                />
                    : type === 'date' ?
                <Input
                    {...props}
                    type="date"
                    placeholder={placeholder}
                    disabled={disabled}
                /> :
                <Input
                    {...props}
                    autoComplete='off'
                    placeholder={placeholder}
                    disabled={disabled}
                />
            }
            </Form.Item>
        </div>
    );
}

export default TextInput;