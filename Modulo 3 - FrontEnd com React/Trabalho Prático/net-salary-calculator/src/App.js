import React, { Component } from 'react';
import InputReadOnly from './components/InputReadOnly/InputReadOnly';
import InputFullSalary from './components/InputFullSalary/InputFullSalary';
import ProgressBarSalary from './components/ProgressBarSalary/ProgressBarSalary';

export default class App extends Component {
  constructor() {
    super();

    this.inssDiscount = 0.0;
    this.irrfDiscount = 0.0;
    this.netSalary = 0.0;

    this.state = {
      fullSalary: 0,
    };
  }

  handleFullSalaryChanged = (value) => {
    if (!value) {
      value = 0;
    }
    this.setState({
      fullSalary: value,
    });
  };

  calculateInssBase() {
    const { fullSalary } = this.state;
    return parseFloat(fullSalary);
  }

  calculateInssDiscount() {
    const { fullSalary } = this.state;
    const floatValue = parseFloat(fullSalary);
    let accumulatedAliquot = 0.0;

    if (floatValue < 1045.0) {
      accumulatedAliquot = floatValue * 0.075;
    } else {
      accumulatedAliquot = 1045.0 * 0.075;

      if (floatValue < 2089.6) {
        accumulatedAliquot += (floatValue - 1045.0) * 0.09;
      } else {
        accumulatedAliquot += (2089.6 - 1045.0) * 0.09;

        if (floatValue < 3134.4) {
          accumulatedAliquot += (floatValue - 2089.6) * 0.12;
        } else {
          accumulatedAliquot += (3134.4 - 2089.6) * 0.12;

          if (floatValue < 6101.06) {
            accumulatedAliquot += (floatValue - 3134.4) * 0.14;
          } else {
            accumulatedAliquot += (6101.06 - 3134.4) * 0.14;
          }
        }
      }
    }
    this.inssDiscount = accumulatedAliquot;
    return accumulatedAliquot;
  }

  calculateIrrfBase() {
    const { fullSalary } = this.state;
    return fullSalary - this.inssDiscount;
  }

  calculateIrrfDiscount() {
    const irrfBase = this.calculateIrrfBase();
    let irrfDiscount = 0;
    if (irrfBase <= 1903.98) {
      irrfDiscount = 0;
    } else if (irrfBase <= 2826.65) {
      irrfDiscount = irrfBase * 0.075 - 142.8;
    } else if (irrfBase <= 3751.05) {
      irrfDiscount = irrfBase * 0.15 - 354.8;
    } else if (irrfBase <= 4664.68) {
      irrfDiscount = irrfBase * 0.225 - 636.13;
    } else {
      irrfDiscount = irrfBase * 0.275 - 869.36;
    }
    this.irrfDiscount = irrfDiscount;
    return irrfDiscount;
  }

  calculateNetSalary() {
    const { fullSalary } = this.state;
    this.netSalary = fullSalary - this.irrfDiscount - this.inssDiscount;
    return this.netSalary;
  }

  calculateOrangeBarPercentage() {
    const { fullSalary } = this.state;
    return this.inssDiscount / fullSalary;
  }

  calculateRedBarPercentage() {
    const { fullSalary } = this.state;
    return this.irrfDiscount / fullSalary;
  }

  calculateGreenBarPercentage() {
    const { fullSalary } = this.state;
    return this.netSalary / fullSalary;
  }

  render() {
    return (
      <div>
        <h1 className="center">React Salário</h1>
        <div className="row">
          <InputFullSalary
            fieldTitle={'Salário Bruto'}
            onChange={this.handleFullSalaryChanged.bind(this)}
          />
        </div>
        <div className="row">
          <InputReadOnly
            fluidGrid="m3 s6"
            fieldTitle={'Base INSS:'}
            value={this.calculateInssBase()}
          />
          <InputReadOnly
            className="customOrange"
            fluidGrid="m3 s6"
            fieldTitle={'Desconto INSS:'}
            value={this.calculateInssDiscount()}
          />
          <InputReadOnly
            fluidGrid="m3 s6"
            fieldTitle={'Base IRPF:'}
            value={this.calculateIrrfBase()}
          />
          <InputReadOnly
            className="customRed"
            fluidGrid="m3 s6"
            fieldTitle={'Desconto IRPF:'}
            value={this.calculateIrrfDiscount()}
          />
        </div>
        <div className="row">
          <InputReadOnly
            className="customGreen"
            fluidGrid="m3"
            fieldTitle={'Salário Liquido:'}
            value={this.calculateNetSalary()}
          />
        </div>
        <div className="row">
          <ProgressBarSalary
            orangePercentage={this.calculateOrangeBarPercentage()}
            redPercentage={this.calculateRedBarPercentage()}
            greenPercentage={this.calculateGreenBarPercentage()}
          />
        </div>
      </div>
    );
  }
}
