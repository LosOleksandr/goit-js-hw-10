function fetchCountries(name) {
  return fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(data => getValuesFromFetch(data));
}

function getValuesFromFetch(countries) {
  return countries.map(obj => {
    return {
      name: obj.name.official,
      capital: obj.capital,
      population: obj.population,
      flags: {
        svg: obj.flags.svg,
      },
      languages: obj.languages,
    };
  });
}

export { fetchCountries };
