import React, { Component } from 'react';

export default class InputReadOnly extends Component {
  constructor() {
    super();
  }

  formatValue(value) {
    console.log(value);
    console.log(parseFloat(value));
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(parseFloat(value));
  }

  render() {
    const { value, fieldTitle, className } = this.props;
    return (
      <div className="input-field col width100 m3 s6">
        <input
          className={`${className} bold`}
          readOnly="readonly"
          id="searchField"
          type="text"
          min="0"
          value={this.formatValue(value)}
        />
        <label htmlFor="searchField">{fieldTitle}</label>
      </div>
    );
  }
}
