import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  countryInputEl: document.getElementById('search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryContainerEl: document.querySelector('.country-info'),
};

const { countryInputEl, countryListEl, countryContainerEl } = refs;

countryInputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  const searchValue = evt.target.value.trim();
  if (!searchValue) {
    clearHTML();
    return;
  }
  checkRequestedArr(searchValue);
}

function checkRequestedArr(searchValue) {
  fetchCountries(searchValue)
    .then(arr => {
      clearHTML();
      if (arr.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      } else if (arr.length === 1) {
        renderCountryInfo(arr[0]);
        return;
      }
      renderCountryList(arr);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      countryContainerEl.innerHTML = '<p>No matches found :(</p>';
    });
}

function renderCountryList(countries) {
  for (const { name, flags } of countries) {
    const countryListMarkup = `<li><img src="${flags.svg}" alt="country_flag"><p>${name}</p></li>`;
    countryListEl.insertAdjacentHTML('beforeend', countryListMarkup);
  }
}

function renderCountryInfo(country) {
  const { name, flags, capital, population, languages } = country;

  const languagesList = Object.values(languages).join(', ');

  const countryInfoMarkup = ` <div class="info-wrapper"><img src="${
    flags.svg
  }" alt="country_flag" />
    <h2>${name}</h2></div>
    <ul>
      <li>
        <p>Capital: ${capital}</p>
      </li>
      <li>
        <p>Population: ${population.toLocaleString('en-US')} people</p>
      </li>
      <li>
        <p>Languages: ${languagesList}</p>
      </li>
    </ul>`;
  countryContainerEl.insertAdjacentHTML('beforeend', countryInfoMarkup);
}

function clearHTML() {
  countryContainerEl.innerHTML = '';
  countryListEl.innerHTML = '';
}
