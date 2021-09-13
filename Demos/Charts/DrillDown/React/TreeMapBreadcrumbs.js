import React from 'react';
import Breadcrumb from './Breadcrumb.js';

class TreeMapBreadcrumbs extends React.Component {
  render() {
    const { treeInfo } = this.props;
    const lastIndex = treeInfo.length - 1;
    return (
      <div className={this.props.className}>
        {
          treeInfo.map((info, index) => (
            <Breadcrumb
              key={info.text}
              onClick={this.props.onItemClick}
              info={info}
              isLast={index === lastIndex} />
          ))
        }
      </div>
    );
  }
}

export default TreeMapBreadcrumbs;
