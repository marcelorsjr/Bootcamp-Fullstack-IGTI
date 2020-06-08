const fs = require('fs').promises;
const states = require('../res/estados.json');
const cities = require('../res/cidades.json');

async function init() {
  createStatesFiles();
  printFiveStatesWithMoreCities();
  printFiveStatesWithLessCities();
  printBiggestCityNameForStates();
  printSmallestCityNameForStates();
  printBiggestCityNameOfAllStates();
  printSmallestCityNameOfAllStates();
}

function createStatesFiles() {
  states.forEach((state) => {
    const filteredCities = cities.filter((city) => state.ID === city.Estado);
    saveToFile(`./results/${state.Sigla}.json`, JSON.stringify(filteredCities));
  });
}

function printBiggestCityNameOfAllStates() {
  const names = Promise.all(
    states.map(async (state) => {
      const biggestName = await biggestCityNameFromState(state.Sigla);
      return `${biggestName.Nome} - ${state.Sigla}`;
    })
  ).then((biggestCities) => {
    const orderedCities = biggestCities.sort((a, b) => {
      return b.length - a.length;
    });

    const sortedCitiesByName = orderedCities
      .filter((city) => {
        return city.length == orderedCities[0].length;
      })
      .sort((a, b) => {
        return a.localeCompare(b);
      });

    console.log(sortedCitiesByName[0]);
  });
}

function printSmallestCityNameOfAllStates() {
  const names = Promise.all(
    states.map(async (state) => {
      const biggestName = await smallestCityNameFromState(state.Sigla);
      return `${biggestName.Nome} - ${state.Sigla}`;
    })
  ).then((biggestCities) => {
    const orderedCities = biggestCities.sort((a, b) => {
      return a.length - b.length;
    });

    const sortedCitiesByName = orderedCities
      .filter((city) => {
        return city.length == orderedCities[0].length;
      })
      .sort((a, b) => {
        return a.localeCompare(b);
      });

    console.log(sortedCitiesByName[0]);
  });
}

function printBiggestCityNameForStates() {
  const names = Promise.all(
    states.map(async (state) => {
      const biggestName = await biggestCityNameFromState(state.Sigla);
      return `${biggestName.Nome} - ${state.Sigla}`;
    })
  ).then((biggestCities) => {
    console.log(biggestCities);
  });
}

function printSmallestCityNameForStates() {
  const names = Promise.all(
    states.map(async (state) => {
      const biggestName = await smallestCityNameFromState(state.Sigla);
      return `${biggestName.Nome} - ${state.Sigla}`;
    })
  ).then((biggestCities) => {
    console.log(biggestCities);
  });
}

async function smallestCityNameFromState(stateUF) {
  const resp = await fs.readFile(`./results/${stateUF}.json`);
  const state = JSON.parse(resp);
  const orderedCities = state.sort((a, b) => {
    return a.Nome.length - b.Nome.length;
  });

  return orderedCities[0];
}

async function biggestCityNameFromState(stateUF) {
  const resp = await fs.readFile(`./results/${stateUF}.json`);
  const state = JSON.parse(resp);
  const orderedCities = state.sort((a, b) => {
    return b.Nome.length - a.Nome.length;
  });

  return orderedCities[0];
}

async function citiesCountFromState(stateUF) {
  const resp = await fs.readFile(`./results/${stateUF}.json`);
  const state = JSON.parse(resp);
  return state.length;
}

async function statesOrderedByCitiesCount() {
  return Promise.all(
    states.map(async (state) => {
      const citiesCount = await citiesCountFromState(state.Sigla);
      return { state: state.Sigla, citiesCount: citiesCount };
    })
  ).then((mappedStates) => {
    return mappedStates.sort((a, b) => {
      return b.citiesCount - a.citiesCount;
    });
  });
}

function printFiveStatesWithLessCities() {
  statesOrderedByCitiesCount().then((mappedStates) => {
    const formattedText = mappedStates
      .slice(mappedStates.length - 5, mappedStates.length)
      .map((state) => {
        return `${state.state} - ${state.citiesCount}`;
      })
      .join(', ');
    console.log(`[${formattedText}]`);
  });
}

function printFiveStatesWithMoreCities() {
  statesOrderedByCitiesCount().then((mappedStates) => {
    const formattedText = mappedStates
      .slice(0, 5)
      .map((state) => {
        return `${state.state} - ${state.citiesCount}`;
      })
      .join(', ');
    console.log(`[${formattedText}]`);
  });
}

function saveToFile(path, body) {
  fs.writeFile(path, body, 'utf8', function (err) {
    if (err) {
      return console.log(`Fail creating the file ${path}`);
    }
  });
}

init();
