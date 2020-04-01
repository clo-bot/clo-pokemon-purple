$(function () {
  disableStartBtn();
  let yourPokemon;
  let yourPokemonMovesArray = []
  let yourPokemonMoves;
  let randomPokemonData;
  let yourPokemonHP;
  let randomPokemonHP;
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
    // console.log(response.data);
    yourPokemon = response.data
    displayYourPokemon(response.data);
    displayYourPokemonMoves(response.data);
    getYourPokemonStats(response.data);
    enableStartBtn();
  }
  $(".select-button").click((event) => {
    // console.log("selecting pokemon")
    getAllPokemon();
    disableSelectBtn();

  })
  function displayYourPokemon(pokemon) {
    $('.pokemon-selector-grid').html("")
    $("#your-pokemon").html(`<div class="your-pokemon-display">
    <h1>You picked <font color="#0000e5">${pokemon.species.name}
    </font>!</h1><p>
      <center><img src="${pokemon.sprites.front_default}"></center></p>
      <p><h2>Choose 4 Moves for Your Pokemon!</h2></p></div>`)

  }

  function displayYourPokemonMoves(pokemon) {
    // for (i = 0; i < pokemon.moves.length; i++) { 
    //   console.log(pokemon.moves[i].move.name); 
    // }
    yourPokemonMoves = pokemon.moves.map((move) => {
      return move.move
    })
    moves = pokemon.moves.map((move) => {
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
    // toggleClass that changes the background color of the selected move
    $(event.currentTarget).toggleClass('selected-move')
    // function that adds or removes pokemon move from yourPokemonMovesArray
    addOrRemoveMove(selectedMove)
    console.log(yourPokemonMovesArray)
    // yourPokemonMovesArray.push(selectedMove)
    // iterate through all of the moves elements on the page
    $(".grid-your-pokemon-moves").each(function (index)  {
      const moveId = $(this)[0].id
      if (yourPokemonMovesArray.length >= 4) {
        // number of selected moves is greater than or equal to 4
        // disable all of the move elements that are not in the selected moves array
        if (!yourPokemonMovesArray.includes(moveId)) {
          $(this).find("button").attr("disabled", true)
        }
      } else {
        // number of selected moves is less 4
        // enable all of the move elements so any of them moves can be selected
        $(this).find("button").attr("disabled", false)
      }
    })
  })

  function addOrRemoveMove(selectedMove) {
    if (yourPokemonMovesArray.includes(selectedMove)) {
      // this move already exists inside of the selected moves array so remove it
      // find the index and use splice() to remove element from the array
      const selectedMoveIndex = yourPokemonMovesArray.findIndex((move) => {
        return move === selectedMove
      })
      // remove the move from the array using the index
      yourPokemonMovesArray.splice(selectedMoveIndex, 1)
    } else {
      // this move does not exist inside the selected moves array, so add it
      yourPokemonMovesArray.push(selectedMove)
    }
  }
 
  $(".start-button").click((event) => {
      // console.log("BEGIN BATTLE!")
      startBattleScreen();
  
    })
  async function generatePokemonArray(pokemon) {
    randomPokemon = pokemon[Math.floor(Math.random() * 151)]
    getRandomPokemonData(randomPokemon);
  }

  async function getRandomPokemonData (randomPokemon) {
    console.log(randomPokemon)
    try {
      const response = await axios.get(`${randomPokemon.url}`)
          return randomPokemonData = response.data
      }
    catch (error) {
      console.log(error)
    }
    generateRandomPokemonMove (response.data.moves)
    getRandomPokemonStats(response.data)
  }

  function getYourPokemonStats(stats) {
    yourPokemonHP = stats.stats.find(function(stat) {
      return stat.stat.name === "hp"
    })
       console.log(`This is your HP: ${yourPokemonHP.base_stat}`)
    }

    function getRandomPokemonStats(stats) {
      randomPokemonHP = stats.stats.find(function(stat) {
        return stat.stat.name === "hp"
      })
         console.log(`This is random Pokemon's HP: ${randomPokemonHP.base_stat}`)
      }


  function startBattleScreen() {
    disableStartBtn();
    $('.grid-pokemon-display').html("");
    $(".pokemon-moves-selector-grid").html("");
    $(".your-pokemon-display").html("");
    $(".pokemon-battle-screen").html(`<div class="pokemon-battle-screen">
      <center><img src="${yourPokemon.sprites.front_default}" width="200">
      <img src="${randomPokemonData.sprites.front_default}" witdh="200">
      </center>
     </div>`);
    $(".message").html(`<font color="#0000e5">${yourPokemon.name}</font> vs ${randomPokemon.name}!`);
    $(".pokemon-order").html(`<p><font color="#0000e5">${yourPokemon.name}</font> go first!`); 
    

    moveButtons();
    

  }

  function moveButtons() {
    enableMoveBtn();
    $('.move-1').text(yourPokemonMovesArray[0]);
    $('.move-2').text(yourPokemonMovesArray[1]);
    $('.move-3').text(yourPokemonMovesArray[2]);
    $('.move-4').text(yourPokemonMovesArray[3]);
    
  }
  
  for (let i = 0; i < 4; i++) {
    $(`.move-${i + 1}`).click(() => {
      // console.log(yourPokemonMoves)
      const yourPokemonMove = yourPokemonMoves.find(function(yourPokemonMove) {
         return yourPokemonMove.name === yourPokemonMovesArray[i];
      })
      // console.log(yourPokemonMove1.url)
      getyourPokemonMoveData(yourPokemonMove.url);
  })
  }
 

  async function getyourPokemonMoveData (yourPokemonMove) {
    console.log(yourPokemonMove)
    try {
      const response = await axios.get(`${yourPokemonMove}`)
      console.log(response.data.power)
          return response.data.power
      }
    catch (error) {
      console.log(error)
    }
  }

  async function generateRandomPokemonMove (moves) {
    console.log(randomPokemonMove)
    let randomPokemonMove = moves[Math.floor(Math.random() * moves.length)]
    
  }
  
  // function battleMoves(selectedPokemonMoves) {
  //   console.log(selectedPokemonMoves)
  //   return selectedPokemonMoves 
  // }

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