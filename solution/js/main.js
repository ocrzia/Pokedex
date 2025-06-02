// ==============================
// 🌱 Sélections DOM
// ==============================
const pokemonList = document.getElementById('pokemonList');
const pokemonDetails = document.getElementById('pokemonDetails');
const searchInput = document.getElementById('searchInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

// ==============================
//  💫 Déclaration de variables
// ==============================
let allPokemon = []; // variable globale pour stocker les résultats
let currentOffset = 0;
const limit = 20;
let totalPokemon = 0;

// ==============================
// 🔧 Fonctions utilitaires
// ==============================
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Retourne une couleur en fonction du type de Pokémon
const getTypeColor = (type) => {
  const colors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD'
  };
  return colors[type] || '#777'; // couleur par défaut si type inconnu
};
// Récupérer le nombre total de Pokémon 
const fetchTotalPokemonCount = async () => {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon');
    const data = await res.json();
    totalPokemon = data.count;
  } catch (err) {
    console.error('❌ Erreur lors du comptage total :', err);
  }
};

// ==============================
// 🐾 Affichage des détails d'un Pokémon
// ==============================
const displayPokemon = (pokemon) => {
  pokemonDetails.innerHTML = `
    <div class="pokemon-card">
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div class="pokemon-info">
        <h3>${capitalize(pokemon.name)}</h3>
        <p><strong>Type(s):</strong> ${
          pokemon.types.map(t =>
            `<span class="type-badge" style="background-color:${getTypeColor(t.type.name)};">
              ${t.type.name}
            </span>`
          ).join(' ')
        }</p>
        <p><strong>Taille:</strong> ${pokemon.height / 10} m</p>
        <p><strong>Poids:</strong> ${pokemon.weight / 10} kg</p>
        <p><strong>Stats:</strong></p>
        <ul>
          ${pokemon.stats.map(stat => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
};

// ==============================
// ⚙️ Appels API
// ==============================


const fetchPokemonDetails = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayPokemon(data);
  } catch (err) {
    console.error('❌ Erreur lors du chargement du détail :', err);
  }
};

const fetchPokemonList = async (offset = 0) => {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    allPokemon = data.results;
    displayPokemonList(allPokemon);

    // Gestion pagination
    prevBtn.disabled = offset === 0;

    const start = offset + 1;
    const end = Math.min(offset + limit, totalPokemon);
    pageInfo.textContent = `Pokémon ${start} → ${end} sur ${totalPokemon}`;
  } catch (err) {
    console.error('❌ Erreur lors du chargement de la liste :', err);
  }
};


// ==============================
// 🧾 Affichage de la liste
// ==============================
const displayPokemonList = (pokemonArray) => {
  // Ajoute la classe "fade" pour commencer l'animation de disparition
  pokemonList.classList.add('fade');
  // Attends 300ms (le temps de la transition CSS) avant de changer la liste
  setTimeout(() => {
    pokemonList.innerHTML = ''; // on vide
    // .. puis on remplit :)
    pokemonArray.forEach(pokemon => {
      const li = document.createElement('li');
      li.textContent = capitalize(pokemon.name);
      li.addEventListener('click', () => fetchPokemonDetails(pokemon.url));
      pokemonList.appendChild(li);
    });

    // Retire la classe "fade" pour faire réapparaître
    pokemonList.classList.remove('fade');
  }, 300);
};

// ==============================
// 🔍 Filtrage en temps réel
// ==============================
searchInput.addEventListener('input', () => {
  const searchValue = searchInput.value.toLowerCase();
  const filtered = allPokemon.filter(p => p.name.includes(searchValue));
  displayPokemonList(filtered);
});

// ==============================
// 🚀 Initialisation
// ==============================
prevBtn.addEventListener('click', () => {
  if (currentOffset >= limit) {
    currentOffset -= limit;
    fetchPokemonList(currentOffset);
  }
});

nextBtn.addEventListener('click', () => {
  currentOffset += limit;
  fetchPokemonList(currentOffset);
});

fetchTotalPokemonCount().then(() => {
  fetchPokemonList(currentOffset);
});
