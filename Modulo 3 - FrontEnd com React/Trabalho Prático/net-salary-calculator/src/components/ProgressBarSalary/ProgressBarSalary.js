import React, { Component } from 'react';

export default class ProgressBarSalary extends Component {
  render() {
    var orangeStyle = {
      backgroundColor: '#e67e22',
      width: `${this.props.orangePercentage * 100}%`,
      float: 'left',
      height: '30px',
    };

    var redStyle = {
      backgroundColor: '#c0392b',
      width: `${this.props.redPercentage * 100}%`,
      float: 'left',
      height: '30px',
    };

    console.log(this.props.greenPercentage);

    var greenStyle = {
      backgroundColor: '#16a085',
      width: `${this.props.greenPercentage * 100}%`,
      float: 'left',
      height: '30px',
    };

    return (
      <div className="col width100">
        <div style={orangeStyle}></div>
        <div style={redStyle}></div>
        <div style={greenStyle}></div>
      </div>
    );
  }
}
