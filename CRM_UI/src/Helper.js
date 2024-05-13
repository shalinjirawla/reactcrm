import { Tag } from "antd";

export const dateFormat = (date) => {
    var d = new Date(date?.$d);
    var newd = new Date(d.getTime() - d.getTimezoneOffset()*60000);
    return newd.toISOString();
};

// export const currentDate = () => {
//     return new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).replace(',', '');
// };

export const filterData = (arr, val) => {
    if (arr.length > 0) {
        const filterData = arr.filter(o => Object.keys(o).some(k => String(o[k])
            .toLowerCase()
            .includes(val.toLowerCase())
        ));
        return filterData;
    }
};

export const parseData = (obj) => {
    return JSON.parse(obj);
};

export const getSelectOptionData = (item, index, className) => {
    return (
        <Tag 
            className={className ? className : 'tagFont'} 
            key={item.value} 
            color={item.data.tagColor}
        >
            {item.label}
        </Tag>
    );
};

export const getSelectLabel = (item, className) => {
    return (
        <Tag 
            bordered={false} 
            className={className ? className : 'tagFont'} 
            key={item.value} 
            color={item.title}
        >
            {item.label}
        </Tag>
    );
};