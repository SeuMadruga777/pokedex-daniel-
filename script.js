const pokemonListElement = document.getElementById("pokemonList");
const searchInput = document.getElementById("searchInput");

let allPokemons = [];

async function fetchAllPokemons() {
  let url = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0";
  let results = [];

  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    results = results.concat(data.results);
    url = data.next;
  }

  allPokemons = results;
  renderPokemonList(results);
}

function renderPokemonList(pokemons) {
  pokemonListElement.innerHTML = "";

  pokemons.forEach(pokemon => {
    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
      <div class="card h-100 shadow-sm pokemon-card">
        <div class="card-body">
          <h5 class="card-title text-capitalize">${pokemon.name}</h5>
          <button class="btn btn-danger btn-sm" onclick="viewDetails('${pokemon.url}', '${pokemon.name}')">Ver detalles</button>
        </div>
      </div>
    `;

    pokemonListElement.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allPokemons.filter(p => p.name.includes(query));
  renderPokemonList(filtered);
});

fetchAllPokemons();

async function viewDetails(url, name) {
  const response = await fetch(url);
  const data = await response.json();

  const moveList = document.getElementById("moveList");
  moveList.innerHTML = "";
  data.moves.forEach(move => {
    const li = document.createElement("li");
    li.className = "list-group-item text-capitalize";
    li.textContent = move.move.name;
    moveList.appendChild(li);
  });

  const statList = document.getElementById("statList");
  statList.innerHTML = "";
  data.stats.forEach(stat => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center text-capitalize";
    li.innerHTML = `
      <span>${stat.stat.name}</span>
      <span class="badge bg-secondary rounded-pill">${stat.base_stat}</span>
    `;
    statList.appendChild(li);
  });

  document.getElementById("pokemonModalLabel").textContent = `Detalles de ${name}`;
  const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
  modal.show();
}

