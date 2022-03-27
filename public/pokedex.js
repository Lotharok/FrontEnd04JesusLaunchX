const pokedexUrl = "https://pokeapi.co/api/v2/";

const fetchPokemon = () => {
  const pokeNameInput = document.getElementById("pokeName");
  let pokeName = pokeNameInput.value;
  pokeName = pokeName.toLowerCase();
  getPokemonData(pokeName);
};

const getPokemonData = (pokeName) => {
  const url = pokedexUrl + `pokemon/${pokeName}`;
  executeApi(url, updateData);
};

const getPokemonSpecie = (pokeName) => {
  const url = pokedexUrl + `pokemon-species/${pokeName}`;
  executeApi(url, updateSpecieData);
};

const getEvolutionChain = (url) => {
  executeApi(url, updateEvolutonChain);
};

const executeApi = (url, callBack) => {
  fetch(url)
    .then((res) => {
      if (res.status != "200") {
        console.log(res);
      } else {
        return res.json();
      }
    })
    .then((data) => {
      if (data) {
        console.log(data);
        if (typeof callBack === "function") {
          callBack(data);
        }
      }
    });
};

const updateData = (pokemon) => {
  getPokemonSpecie(pokemon.name);
  updateImage(pokemon.sprites.front_default);
  updateState("name", pokemon.name);
  updateState("height", pokemon.height);
  updateState("weight", pokemon.weight);
  updateState("type", pokemon.types[0].type.name);
};

const updateSpecieData = (specie) => {
  getEvolutionChain(specie.evolution_chain.url);
  updateState("details", specie.flavor_text_entries[0].flavor_text);
};

const updateEvolutonChain = (chainData) => {
  const pokeNameInput = document.getElementById("pokeName");
  let html = "";
  let pokeName = pokeNameInput.value;
  let chain = chainData.chain;
  if (chain.species.name != pokeName || chain.evolves_to.length > 0) {
    html = generateEvolutionElement(chain.species.name);
    html = addEvolution(html, chain.evolves_to[0]);
  }
  const evolutionChainDiv = document.getElementById("evoluton-chain");
  evolutionChainDiv.innerHTML = html;
};

const addEvolution = (html, evolves_to) => {
  if (evolves_to) {
    html = html + " -> " + generateEvolutionElement(evolves_to.species.name);
    return addEvolution(html, evolves_to.evolves_to[0]);
  }

  return html;
};

const generateEvolutionElement = (name) => {
  return `<a onclick="getPokemonData('${name}')">${name}</a>`;
};

const updateState = (state, value) => {
  const pokeState = document.getElementById(state);
  pokeState.textContent = value;
};

const updateImage = (url) => {
  const pokePhoto = document.getElementById("pokeImg");
  pokePhoto.src = url;
};

window.onload = function () {
  const pokeNameInput = document.getElementById("pokeName");
  pokeNameInput.value = "pikachu";
  fetchPokemon();
};
