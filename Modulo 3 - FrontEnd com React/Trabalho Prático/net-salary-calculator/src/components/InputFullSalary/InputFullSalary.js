import React, { Component } from 'react';

export default class InputFullSalary extends Component {
  onFieldChange(event) {
    const fieldValue = event.target.value;
    this.props.onChange(fieldValue);
  }

  render() {
    return (
      <div className="input-field col width100">
        <input
          id="searchField"
          type="number"
          min="0"
          onChange={this.onFieldChange.bind(this)}
        />
        <label htmlFor="searchField">{this.props.fieldTitle}</label>
      </div>
    );
  }
}
