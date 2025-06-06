import React from 'react';

const HeaderTemplate = ({text}) => {
    return (
        <div className="task__header" title={text}>
            {text}
        </div>
    );
}

export default HeaderTemplate;
