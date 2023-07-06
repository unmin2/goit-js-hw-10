import Notiflix from 'notiflix';
import SlimSelect from 'slim-select'
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');
new SlimSelect('#breed-select', {
  contentPosition: 'relative',
});
fetchBreeds()
  .then(data => {
    let breed;

    breed = data.map(breeds => ({
      value: breeds.id,
      label: breeds.name,
      description: breeds.description,
      temperament: breeds.temperament,
    }));
  let markup = `<option value=''>Choose your cat</option>`;

    breed.forEach(breed => {
      markup += `<option value='${breed.value}'>${breed.label}</option>`;
    });

    breedSelect.innerHTML = markup;

    breedSelect.addEventListener('change', handleChoice);

    function handleChoice(evt) {
      catInfo.innerHTML = '';
      showLoader();
      evt.preventDefault();

      let breedId = evt.target.value;
      const selectedBreed = breed.find(breed => breed.value === breedId);

      fetchCatByBreed(breedId)
        .then(el => {
          let markupLi = '';

          el.forEach(img => {
            markupLi += `<li class="cat-picture"><img src=${img.url}></img></li>`;
          });
          let markupUl = '<ul class="cat-list">' + markupLi + '</ul>';

          const newHtml = `<div class='cat-descr'>
          <p class='name'>${selectedBreed.label}</p>
          <p class='description'>${selectedBreed.description}</p>
          <p class='features'>${selectedBreed.temperament}</p>
          </div >`;

          if (selectedBreed) {
            catInfo.innerHTML += markupUl + newHtml;
          }

          hideLoader();
        })
        .catch(err => {
          showError();
        });
    }
  })
  .catch(err => {
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  });

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function showError() {
  if (breedSelect.value === '') {
    hideLoader();
    return Notiflix.Notify.warning('Choose a cat breed from the list');
  } else {
      Notiflix.Notify.failure(
          'Oops! Something went wrong! Try reloading the page!');
  };
}
browserslist.clearCaches()