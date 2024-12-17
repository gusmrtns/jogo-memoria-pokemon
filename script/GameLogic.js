const pokemonPairs = [
  { base: "Charmander", evolution: "Charizard" },
  { base: "Bulbasaur", evolution: "Venusaur" },
  { base: "Squirtle", evolution: "Blastoise" },
  { base: "Pikachu", evolution: "Raichu" },
];

// Duplica os pares para criar um total de cartas
const cards = pokemonPairs.flatMap(pair => [pair.base, pair.evolution]);

// Função para embaralhar as cartas
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Embaralha as cartas
shuffle(cards);

// Seleciona o elemento do tabuleiro do jogo
const gameBoard = document.getElementById("game-board");
const textMessage = document.getElementById("message");
const buttonRestart = document.getElementById("buttonRestart");

// Função para criar o tabuleiro
function createBoard() {
  gameBoard.innerHTML = ""; // Limpa o tabuleiro anterior

  cards.forEach((pokemon, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.pokemon = pokemon;
    card.id = `card-${index}`;

    // Adiciona a classe com o nome do Pokémon à frente da carta para aplicar a imagem
    card.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front ${pokemon.toLowerCase()}"></div>
    `;

    gameBoard.appendChild(card);
  });
}

createBoard();

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let counterMatch = 0;

gameBoard.addEventListener("click", function (e) {
  const clickedCard = e.target.closest(".card");

  // Verifica se a carta clicada é válida
  if (!clickedCard || 
      lockBoard || 
      clickedCard === firstCard || 
      clickedCard.classList.contains("matched") || 
      clickedCard.classList.contains("flipped")) return;

  clickedCard.classList.add("flipped");

  if (!firstCard) {
    firstCard = clickedCard;
  } else {
    secondCard = clickedCard;
    lockBoard = true;
    checkMatch();
  }
});

function checkMatch() {
  const isMatch = isEvolutionPair(firstCard.dataset.pokemon, secondCard.dataset.pokemon);

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    counterMatch += 2;
    textMessage.innerHTML = "Par encontrado, encontre o próximo par!";
    checkVictory();
    resetSelection();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      textMessage.innerHTML = "Par não encontrado, tente novamente!";
      resetSelection();
    }, 1000);
  }
}

function isEvolutionPair(card1, card2) {
  return pokemonPairs.some(pair =>
    (pair.base === card1 && pair.evolution === card2) || 
    (pair.base === card2 && pair.evolution === card1)
  );
}

function resetSelection() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function checkVictory() {
  if (counterMatch === cards.length) {
    textMessage.innerHTML = "Parabéns, você encontrou todos os pares!";
  }
}

buttonRestart.addEventListener("click", function() {
  // Cartas são embaralhadas novamente e tabuleiro é recriado
  shuffle(cards);
  createBoard();
  // Variáveis são reiniciadas
  firstCard = null; 
  secondCard = null; 
  lockBoard = false; 
  counterMatch = 0;
  textMessage.innerHTML = "Jogo reiniciado! Encontre os pares!";
});

