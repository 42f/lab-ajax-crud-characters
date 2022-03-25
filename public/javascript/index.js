const charactersAPI = new APIHandler('http://localhost:8000');

const modelCard = document.querySelector('.character-info').cloneNode(true);

function resetAllButtons() {
  const formButtons = document.querySelectorAll('form > button');
  formButtons.forEach(b => b.classList = '');
}

function displayMessage(message) {
  const cardsContainer = document.querySelector('.characters-container');
  cardsContainer.innerText = message;
}

function updateCards(data) {
  const cardsContainer = document.querySelector('.characters-container');
  if (!data.length) {
    displayMessage('No data to be shown');
  } else {
    cardsContainer.innerHTML = '';
    for (const element of data) {
      const singleCard = modelCard.cloneNode(true);

      const idDiv = document.createElement('div');
      idDiv.innerText = `ID: ${element.id}`;
      singleCard.prepend(idDiv);

      singleCard.querySelector('.name').innerText = element.name;
      singleCard.querySelector('.occupation').innerText = element.occupation;
      singleCard.querySelector('.cartoon').innerText = element.cartoon ? 'Is a Cartoon' : 'Is not a Cartoon';
      singleCard.querySelector('.weapon').innerText = element.weapon;
      cardsContainer.appendChild(singleCard);
    }
  }
}

window.addEventListener('load', () => {
  document.getElementById('fetch-all').addEventListener('click', function (event) {
    resetAllButtons();
    charactersAPI.getFullList()
      .then((resp) => updateCards(resp.data))
      .catch((err) => {
        console.log(err);
        displayMessage('Something went wrong with the DB...' + err)
      });
  });

  document.getElementById('fetch-one').addEventListener('click', function (event) {
    resetAllButtons();
    const id = event.target.parentNode.querySelector('input').value;
    if (id) {
      charactersAPI.getOneRegister(id)
        .then((resp) => updateCards([resp.data]))
        .catch((err) => {
          if (err.response.status === 404) {
            displayMessage(`The id ${id} does not belong to anyone`)
          } else {
            displayMessage('Something went wrong with the DB')
          }
        });
    }
  });

  document.getElementById('delete-one').addEventListener('click', function (event) {
    resetAllButtons();
    const id = event.target.parentNode.querySelector('input').value;
    if (id) {
      charactersAPI.deleteOneRegister(id)
        .then((resp) => displayMessage(`The id ${id} was successfully deleted`))
        .catch((err) => {
          console.log(err);
          if (err.response.status === 404) {
            displayMessage(`The id ${id} does not belong to anyone`)
          } else {
            displayMessage('Something went wrong with the DB')
          }
        });
    }
  });

  function extractDataFromForm(formId) {
    resetAllButtons();
    const fields = document.querySelectorAll(`#${formId} input`);
    const data = {};
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        data[field.name] = field.checked;
      } else {
        data[field.name] = field.value;
      }
    })
    return data;
  }

  document.getElementById('edit-character-form').addEventListener('submit', function (event) {
    event.preventDefault();
    resetAllButtons();
    const button = event.target.querySelector('button');
    const userInputs = extractDataFromForm('edit-character-form')

    if (Object.values(userInputs).some(input => input.length === 0)) {
      button.classList = 'fail';
      displayMessage('Character Edition - Missing some fields in form')
      return;
    }

    charactersAPI.updateOneRegister(userInputs)
    .then(() => {
      button.classList = 'active';
      displayMessage(`The id ${id} was successfully edited`)
    })
    .catch((err) => {
      button.classList = 'fail';
      console.log(err);
        if (err.response.status === 404) {
          displayMessage(`The id ${id} does not belong to anyone`)
        } else {
          displayMessage('Something went wrong with the DB')
        }
      });
  });

  document.getElementById('new-character-form').addEventListener('submit', function (event) {
    event.preventDefault();
    resetAllButtons();
    const button = event.target.querySelector('button');
    const userInputs = extractDataFromForm('new-character-form');

    if (Object.values(userInputs).some(input => input.length === 0)) {
      button.classList = 'fail';
      displayMessage('New Character - Missing some fields in form')
      return;
    }

    charactersAPI.createOneRegister(userInputs)
    .then(() => {
      button.classList = 'active';
        displayMessage(`${userInputs.name} was successfully created`)
      })
      .catch((err) => {
        button.classList = 'fail';
        console.log(err);
        displayMessage('Something went wrong with the DB')
      });
  });
});
