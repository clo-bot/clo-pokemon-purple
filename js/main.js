$(function () {
  disableStartBtn();
  disableNextBtn();
  let yourPokemon;
  let yourPokemonMovesArray = []
  let yourPokemonMoves;
  let randomPokemonData;
  let yourPokemonHP;
  let randomPokemonHP;
  let randomPokemonMove;
  let yourPokemonMovePower;
  let yourAttack;
  let yourDefense;
  let randomPokemonAttack;
  let randomPokemonDefense;
  $(".select-message").text("Choose Your Pokemon!")
  
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

  $(".select-button").click((event) => {
    // console.log("selecting pokemon")
    $(".select-message").text("")
    getAllPokemon();
    disableSelectBtn();
  })

  function displayPokemon(pokemon) {
    $('.pokemon-selector-grid').append(
      `<div class="grid-pokemon-display" id="${pokemon.species.name}"><p>${pokemon.species.name}</p>
      <img src="${pokemon.sprites.front_shiny}"></div>`
    )
  }

    $('.pokemon-selector-grid').click(event => {
      if ($(".pokemon-selector-grid").children().length != 151) {
        window.alert("Please wait for all Pokemon to load before selecting.")
      } else {
        const clicked = event.target.closest('.grid-pokemon-display')
        getSpecificPokemon(clicked.id)
        }  
    })

  async function getSpecificPokemon(pokemon) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    // console.log(response.data);
    yourPokemon = response.data
    displayYourPokemon(response.data);
    displayYourPokemonMoves(response.data);
    assignPokemonStats(response.data.stats, "me");
  }

  function displayYourPokemon(pokemon) {
    scrollUp();
    $('.pokemon-selector-grid').html("")
    $("#your-pokemon").html(`<div class="your-pokemon-display">
      <h1>You picked <font color="#0000e5">${pokemon.species.name}</font>!</h1>
      <p><center><img src="${pokemon.sprites.front_default}"></center></p>
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
        </div>`)
    })
    enableStartBtn();
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

          scrollDown();

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
      scrollUp();
  })

  async function generatePokemonArray(pokemon) {
    randomPokemon = pokemon[Math.floor(Math.random() * 151)]
    getRandomPokemonData(randomPokemon);
  }

  async function getRandomPokemonData (randomPokemon) {
    console.log(randomPokemon)
    try {
      const response = await axios.get(`${randomPokemon.url}`)
      generateRandomPokemonMove(response.data.moves)
      assignPokemonStats(response.data.stats, "random")
      randomPokemonData = response.data
    } catch (error) {
      console.log(error)
    }
  }

  function assignPokemonStats(stats, player) {
    // console.log(stats)
    stats.forEach(function(statObject) {
      switch(statObject.stat.name){
        case "hp":
          if (player === "me") { 
            yourPokemonHP = statObject.base_stat
          } else {
            randomPokemonHP = statObject.base_stat;
          };
          break;
        case "attack":
          if (player === "me") {
            yourAttack = statObject.base_stat;
          } else {
            randomPokemonAttack = statObject.base_stat;
          }
          break;
        case "defense":
          if (player === "me") {
            yourDefense = statObject.base_stat;
          } else {
            randomPokemonDefense = statObject.base_stat;          
          }
          break;
      }
    })
      console.log(`This is your HP: ${yourPokemonHP}. This is your attack: ${yourAttack}.
        This is your defense: ${yourDefense}. This is random HP: ${randomPokemonHP}. 
        This is random attack: ${randomPokemonAttack}.
        This is random defense: ${randomPokemonDefense}.`)    
  }

  function startBattleScreen() {
    disableStartBtn();
    $('.grid-pokemon-display').html("");
    $(".pokemon-moves-selector-grid").html("");
    $(".your-pokemon-display").html("");
    $(".pokemon-battle-screen").html(`<div class="pokemon-battle-screen">
      <center><img src="${yourPokemon.sprites.front_default}" width="200">
      <img src="${randomPokemonData.sprites.front_default}" witdh="200">
      </center></div>`);
    $(".versus").html(`<font color="#0000e5">${yourPokemon.name}</font> vs. ${randomPokemon.name}!`);

    printHP();

    $(".pokemon-order").html(`<p><font color="#0000e5">${yourPokemon.name}</font> go first!`); 
    
    moveButtons();    
    yourMoves();
  }

  function moveButtons() {
    enableMoveBtn();
    $('.move-1').text(yourPokemonMovesArray[0]);
    $('.move-2').text(yourPokemonMovesArray[1]);
    $('.move-3').text(yourPokemonMovesArray[2]);
    $('.move-4').text(yourPokemonMovesArray[3]);
    
  }
  
  async function yourMoves() {
    for (let i = 0; i < 4; i++) {
      $(`.move-${i + 1}`).click(async() => {
      // console.log(yourPokemonMoves)
      const yourPokemonMove = yourPokemonMoves.find(function(yourPokemonMove) {
         return yourPokemonMove.name === yourPokemonMovesArray[i];
      })
      try {
        const response = await axios.get(`${yourPokemonMove.url}`)
        yourPokemonMovePower = response.data.power
        console.log(randomPokemonHP)
        console.log(yourPokemonMovePower)
        const damageDone = attackDamage(yourAttack, yourPokemonMovePower, randomPokemonDefense)
          console.log(`This is damage done: ${damageDone}`)
        randomPokemonHP = randomPokemonHP - damageDone

          $(".pokemon-order").html(""); 

          $(".move-message").text(`You picked ${yourPokemonMove.name} and caused ${damageDone} 
          damage!`);
      
          printHP();
          disableMoveBtn();
          enableNextBtn();
          checkGame();

          // console.log(`This is random HP: ${randomPokemonHP}`)
        } catch (error) {
          console.log(error)
      }
      // console.log(`Your Power is: ${yourPokemonMovePower}`)
      })
    }
  }

  $(".next-button").click((event) => {
    randomPokemonMoves();
  })


  function generateRandomPokemonMove (moves) {
    randomPokemonMove = moves[Math.floor(Math.random() * moves.length)]
    console.log(randomPokemonMove)
  }

  async function randomPokemonMoves() {
      try {
        disableNextBtn();
        console.log(randomPokemonMove)
        const response = await axios.get(`${randomPokemonMove.move.url}`)
        randomPokemonMovePower = response.data.power
        // console.log(`This is your HP: ${yourPokemonHP}`)
        // console.log(`This is Random Pokemon's Move Power: ${randomPokemonMovePower}`)
        const damageDone = attackDamage(randomPokemonAttack, randomPokemonMovePower, yourDefense)
          console.log(`This is damage done: ${damageDone}`)
        yourPokemonHP = yourPokemonHP - damageDone

          printHP();
          checkGame();

          $(".move-message").text(`${randomPokemon.name} picked ${randomPokemonMove.move.name} 
          and caused ${damageDone} damage!`);

          $(".pokemon-order").html(`<p><font color="#0000e5">${yourPokemon.name}</font>'s turn!`); 

          enableMoveBtn();

          console.log(`This is your HP: ${yourPokemonHP}`)
        } catch (error) {
          console.log(error)
          }
  }


  function attackDamage (attackersAttack, attackersMovePower, defendersDefense, sameTypeAttackBonus = 1, 
    typeModifier = 10, pokemonLevel = 60) {
      const randomNumber = Math.floor(Math.random() * (255 - 217) + 217)
        const fullDamage = (((((((((2*pokemonLevel)/5+2)*attackersAttack*attackersMovePower)/defendersDefense)
              /50)+2)*sameTypeAttackBonus)*typeModifier/10)*randomNumber)/255
        return Math.floor(fullDamage);

            // Pokemon Battle Damage Calculation: 
            // https://www.math.miami.edu/~jam/azure/compendium/battdam.htm
            // A = attacker's Level
            // B = attacker's Attack or Special
            // C = attack Power
            // D = defender's Defense or Special
            // X = same-Type attack bonus (1 or 1.5)
            // Y = Type modifiers (40, 20, 10, 5, 2.5, or 0)
            // Z = a random number between 217 and 255
  }

  function checkGame() {
    if (randomPokemonHP <= 0) {
      $(".win-message").html(
      `<center>
      ${randomPokemon.name} is defeated!
      <br>You are the Pokemon master!
      </center>`)
      $(".pokemon-order").text("")
      disableNextBtn();
      console.log("You win")
    } else if (yourPokemonHP <= 0){
      $(".win-message").html(
      `<center>
      ${yourPokemon.name} is defeated!
      <br>You need to train more!
      </center>`)
      $(".pokemon-order").text("")
      disableNextBtn();
      console.log("random win")
    } else {
      console.log("keep going")
    }
  }

  function printHP() {
    $(".your-pokemon-hp-display").text(`${yourPokemon.name} HP = ${yourPokemonHP}`);
    $(".random-pokemon-hp-display").text(`${randomPokemon.name} HP = ${randomPokemonHP}`);
  }

  function disableSelectBtn() {
    $(".select-button").toggle()

  }
  
  function enableStartBtn() {
    $(".start-button").toggleClass("disabled");    
    console.log("enabling start button")
  }

  function disableStartBtn() {
    $(".start-button").toggleClass("disabled", true);
  }

  function enableMoveBtn() {
    $(".move-1").toggleClass("disabled");    
    $(".move-2").toggleClass("disabled");    
    $(".move-3").toggleClass("disabled");    
    $(".move-4").toggleClass("disabled");    
  }

  function disableMoveBtn() {
    $(".move-1").toggleClass("disabled", true);    
    $(".move-2").toggleClass("disabled", true);    
    $(".move-3").toggleClass("disabled", true);    
    $(".move-4").toggleClass("disabled", true);    
  }

  function enableNextBtn() {
    $(".next-button").toggleClass("disabled");    
  }

  function disableNextBtn() {
    $(".next-button").toggleClass("disabled", true);    
  }

  function scrollUp() {
    window.scrollTo(document.body.scrollHeight, 0);
  }

  function scrollDown() {
    window.scrollTo(0, document.body.scrollHeight);
  }

})