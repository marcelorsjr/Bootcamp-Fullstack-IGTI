var fetchedUsers;

function fetchUsers() {
  const spinner = document.querySelector('#spinner');
  fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo')
    .then((response) => {
      return response.json();
    })
    .then((people) => {
      spinner.classList.remove('active');
      fetchedUsers = people.results.map(({ name, picture, dob, gender }) => {
        return {
          fullName: name.first + ' ' + name.last,
          picture,
          dob,
          gender,
        };
      });
    });
}

function searchUser() {
  const searchKey = document.querySelector('#searchField').value;
  const filteredUsers = fetchedUsers
    .filter((user) => {
      const fullName = user.fullName.toLowerCase();
      return fullName.includes(searchKey);
    })
    .sort((a, b) =>
      a.fullName > b.fullName ? 1 : b.fullName > a.fullName ? -1 : 0
    );

  renderResults(filteredUsers);
}

function renderResults(users) {
  renderUsersList(users);
  renderStatistics(users);
}

function renderStatistics(users) {
  const statisticsTitle = document.querySelector('#statisticsTitle');
  var statisticsTitleText = 'Nada a ser exibido';
  if (users.length) {
    statisticsTitleText = 'Estatísticas';
  }
  statisticsTitle.innerHTML = statisticsTitleText;

  const maleQuantity = users.filter((user) => {
    return user.gender === 'male';
  }).length;
  const femaleQuantity = users.length - maleQuantity;

  const agesSum = users.reduce((accum, curr) => {
    return accum + curr.dob.age;
  }, 0);
  const agesAverage = Math.round((agesSum * 100.0) / users.length) / 100;

  const statisticsResultDiv = document.querySelector('#statisticsResult');
  statisticsResultDiv.innerHTML = `
    <p>Sexo masculino: <strong>${maleQuantity}</strong></p>
    <p>Sexo feminino: <strong>${femaleQuantity}</strong></p>
    <p>Soma das idades: <strong>${agesSum}</strong></p>
    <p>Media das idades: <strong>${agesAverage}</strong></p>
  `;
}

function renderUsersList(users) {
  const resultsTitleField = document.querySelector('#resultsTitle');
  var resultsText = 'Nenhum usuário filtrado';
  if (users.length) {
    resultsText = users.length + ' usuário(s) encontrado(s)';
  }
  resultsTitleField.innerHTML = resultsText;

  const usersResultDiv = document.querySelector('#usersResult');
  usersResultDiv.innerHTML = `
  ${users
    .sort((a, b) => a.fullName - b.fullName)
    .map(
      (item) => `
      <div class="row">
        <img class="avatar" src="${item.picture.large}" />
        <span>${item.fullName}, ${item.dob.age} anos</span>
      </div>
    `
    )
    .join('')}
  `;
}

function handleKeyup(event) {
  const value = document.querySelector('#searchField').value;
  const searchButton = document.querySelector('#searchButton');
  if (event.key === 'Enter' && value.length) {
    searchUser(value);
  } else if (value.length) {
    searchButton.removeAttribute('disabled');
  } else {
    searchButton.setAttribute('disabled', '');
  }
}

function setupHandlers() {
  const searchField = document.querySelector('#searchField');
  const searchButton = document.querySelector('#searchButton');
  searchField.addEventListener('keyup', handleKeyup);
  searchButton.addEventListener('click', searchUser);
}

function start() {
  setupHandlers();
  fetchUsers();
}

start();
