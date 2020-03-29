$(function () {
  disableStartBtn();
  let randomPokemon;
  let yourPokemon;
  let yourPokemonMovesArray = []
  $(".message").text("Choose Your Pokemon!")
  
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
    $(".message").text("")

  })
  async function getSpecificPokemon(pokemon) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    console.log(response.data);
    displayYourPokemon(response.data)
    displayYourPokemonMoves(response.data)
    enableStartBtn();
  }
  $(".select-button").click((event) => {
    console.log("selecting pokemon")
    getAllPokemon();
    disableSelectBtn();

  })
  function displayYourPokemon(pokemon) {
    $('.pokemon-selector-grid').html("")
    $(".message").html(`<h1> You picked <font color="#0000e5">${pokemon.species.name}
    </font>!</h1>`)
    $("#your-pokemon").html(`
    <div class="your-pokemon-display">
      <center><img src="${pokemon.sprites.front_default}"></center>
      <p><h2>Choose 4 Moves for Your Pokemon!</h2></p></div>`)

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
        `<div class="grid-your-pokemon-moves" id="${move}">
          <button class="move-button"><p>${move}</p></button>
        </div>
        `)
    })
  }

  $('body').on('click', '.grid-your-pokemon-moves button', (event) => {
    // store the id of the selected move in a variable
    const selectedMove = $(event.currentTarget).parent().attr('id')
    console.log(`move selected: ${selectedMove}`)
    yourPokemonMovesArray.push(selectedMove)
    console.log(yourPokemonMovesArray)

    // toggleClass that changes the background color of the selected move
    $(event.currentTarget).toggleClass('selected-move')
     if(yourPokemonMovesArray.length === 4){
       console.log("inside if statement")
        // return yourPokemonMovesArray.filter((move, index) => 
        // move.indexOf(move) !== index);
        // $('body').unbind();
        $(".grid-your-pokemon-moves").each(function (index)  {
          // console.log($(this)[0].id)
          // check if id of current element ($(this)) matches id that is in
          // selected moves array
          const moveId = $(this)[0].id
          if (!yourPokemonMovesArray.includes(moveId)) {
            $(this).find("button").attr("disabled", true)
          } else {
            console.log("enabled")
            $(this).find("button").attr("disabled", false)

          }
        })
       }
      console.log(yourPokemonMovesArray)
    })
 
  $(".start-button").click((event) => {
      console.log("BEGIN BATTLE!")
      startBattleScreen();
  
    })
  async function generatePokemonArray(pokemon) {
    let randomPokemon = pokemon[Math.floor(Math.random() * 151)]
    console.log(randomPokemon)
  }

  function startBattleScreen() {
    disableStartBtn();
    $('.grid-pokemon-display').html("");
    $(".pokemon-moves-selector-grid").html("");
    $("#your-Pokemon").html("");
    console.log(yourPokemon)
    console.log(randomPokemon)
    console.log(yourPokemonMovesArray)
    $(".message").html(`${randomPokemon} vs. ${yourPokemon}`); 
    moveButtons();

  }

  function moveButtons() {
    enableMoveBtn();
    $('.move-1').text(yourPokemonMovesArray[0]);
    $('.move-2').text(yourPokemonMovesArray[1]);
    $('.move-3').text(yourPokemonMovesArray[2]);
    $('.move-4').text(yourPokemonMovesArray[3]);

    
  }

  function disableSelectBtn() {
    $(".select-button").toggle()

  }
  
  function enableStartBtn() {
    $(".start-button").toggleClass("disabled");    

  }

  function disableStartBtn() {
    $(".start-button").toggle();
  }

  function enableMoveBtn() {
    $(".move-1").toggleClass("disabled");    
    $(".move-2").toggleClass("disabled");    
    $(".move-3").toggleClass("disabled");    
    $(".move-4").toggleClass("disabled");    


  }

})