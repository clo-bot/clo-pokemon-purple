$(function () {
  let randomPokemon;
  $(".choose").text("Choose Your Pokemon!")
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
  async function getAllPokemon() {
    try {
      const url = "https://pokeapi.co/api/v2/pokemon?limit=151"
      const response = await axios.get(url)
      generatePokemonArray(response.data.results)
      asyncForEach(response.data.results, async (pokemon) => {
        await getPokemon(pokemon.url)
      })
    } catch (error) {
      console.log(error)
    }
  }
  async function getPokemon(url) {
    const response = await axios.get(url)
    displayPokemon(response.data)
  }
  function displayPokemon(pokemon) {
    $('.pokemon-selector-grid').append(
      `<div class="grid-pokemon-display" id="${pokemon.species.name}"><p>${pokemon.species.name}</p>
      <img src="${pokemon.sprites.front_shiny}"></div>`
    )
  }
  $('.pokemon-selector-grid').click(event => {
    const clicked = event.target.closest('.grid-pokemon-display')
    getSpecificPokemon(clicked.id)
    $(".choose").text("")

  })
  async function getSpecificPokemon(pokemon) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    console.log(response.data);
    displayYourPokemon(response.data)
    displayYourPokemonMoves(response.data)
  }
  $(".select-button").click((event) => {
    event.preventDefault()
    console.log("submitting form")
    getAllPokemon();
    disableBtn();

  })
  function displayYourPokemon(pokemon) {
    $('.pokemon-selector-grid').html("")
    $("#your-pokemon").html(`
    <h1> You picked <font color="#0000e5">${pokemon.species.name}</font>!</h1>
    <div class="your-pokemon-display">
      <center><img src="${pokemon.sprites.front_default}"></center></div>`)
  }

  function displayYourPokemonMoves(pokemon) {
    // for (i = 0; i < pokemon.moves.length; i++) { 
    //   console.log(pokemon.moves[i].move.name); 
    // }
    const moves = pokemon.moves.map((move) => {
      return move.move.name
    })
    moves.forEach((move) => {
    $('.pokemon-moves-selector-grid').append(
      `<br><div class="grid-your-pokemon-moves" id="${move}"><p>${move}</p>
      </div>
      `)
    })
  }
  // <button id="start">Start!</button>

  async function generatePokemonArray(pokemon) {
    const randomPokemon = pokemon[Math.floor(Math.random() * 151)]
    console.log(randomPokemon)
  }
  function disableBtn() {
    $(".select-button").toggle()
  }
})