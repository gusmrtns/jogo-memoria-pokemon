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
        // logica para trocar os elementos de lugar:
        // 1. Gerar um índice aleatório entre 0 e i
        // 2. Trocar o elemento de índice i com o elemento de índice aleatório
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// Embaralha as cartas
shuffle(cards);

// Seleciona o elemento do tabuleiro do jogo
const gameBoard = document.getElementById("game-board");

// Função para criar o tabuleiro
function createBoard() {
    // Limpa o tabuleiro anterior antes de criar um novo
    // Motivo: Isso garante que, caso a função seja chamada novamente (por exemplo, para reiniciar o jogo),
    // não haja cartas duplicadas ou elementos antigos no tabuleiro.
    gameBoard.innerHTML = "";

    // Percorre o array de cartas (`cards`) e cria elementos HTML para cada uma delas
    cards.forEach((pokemon, index) => {
        // Cria um elemento `div` para representar a carta
        const card = document.createElement("div");

        // Adiciona a classe "card" ao elemento
        // Motivo: Isso facilita a estilização com CSS e o reconhecimento das cartas no jogo.
        card.classList.add("card");

        // Adiciona o nome do Pokémon no atributo `data-pokemon`
        // Motivo: O atributo `data-pokemon` é usado para identificar a carta durante a verificação de pares,
        // mantendo as informações necessárias sem expor visualmente o conteúdo ao jogador.
        card.dataset.pokemon = pokemon;

        // Define um ID único para cada carta
        // Motivo: O ID pode ser útil para rastrear cartas específicas, embora não seja essencial para a lógica principal.
        card.id = `card-${index}`;

        // Define o conteúdo interno da carta
        // A estrutura `<div class="card-back"></div>` representa o verso da carta (visível inicialmente).
        // A estrutura `<div class="card-front">${pokemon}</div>` representa a frente da carta (visível após ser "virada").
        card.innerHTML = `
            <div class="card-back"></div>
            <div class="card-front">${pokemon}</div>
        `;

        // Adiciona a carta criada ao tabuleiro
        // Motivo: Sem este passo, as cartas criadas existiriam na memória, mas não seriam visíveis no DOM,
        // ou seja, não apareceriam para o jogador.
        gameBoard.appendChild(card);
    });
}

  
createBoard();
  
// Variáveis para controlar o estado do jogo
let firstCard = null; // Armazena a primeira carta selecionada
let secondCard = null; // Armazena a segunda carta selecionada
let lockBoard = false; // Impede cliques enquanto a lógica de jogo está em processamento

// Adiciona um listener de clique ao tabuleiro do jogo
gameBoard.addEventListener("click", function (e) {
  const clickedCard = e.target.parentElement; // Garante que o clique seja tratado no elemento da carta

  // Verifica condições para evitar interações incorretas:
  // 1. O clique deve ser em uma carta.
  // 2. O tabuleiro não deve estar "travado" (lockBoard).
  // 3. A carta clicada não pode ser a mesma já selecionada como `firstCard`.
  if (!clickedCard.classList.contains("card") || lockBoard || clickedCard === firstCard) return;

  // Revela a carta clicada adicionando a classe "flipped"
  clickedCard.classList.add("flipped");

  if (!firstCard) {
    // Se esta for a primeira carta selecionada, armazena na variável
    firstCard = clickedCard;
  } else {
    // Caso seja a segunda carta, armazena na variável e bloqueia o tabuleiro temporariamente
    secondCard = clickedCard;
    lockBoard = true; // Isso evita que o jogador clique em mais cartas enquanto o par está sendo verificado

    // Verifica se as duas cartas selecionadas formam um par válido
    checkMatch();
  }
});

// Função para verificar se as cartas formam um par correspondente
function checkMatch() {
  const isMatch = isEvolutionPair(firstCard.dataset.pokemon, secondCard.dataset.pokemon);

  if (isMatch) {
    // Se as cartas forem um par:
    // 1. Adiciona a classe "matched" para indicar que as cartas foram combinadas.
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    // 2. Reseta a seleção para permitir novas jogadas
    resetSelection();
  } else {
    // Se não forem um par:
    // 1. Reverte as cartas após 1 segundo, removendo a classe "flipped".
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      // 2. Reseta a seleção para permitir novas jogadas
      resetSelection();
    }, 1000); // Dá ao jogador tempo para memorizar as cartas antes de escondê-las novamente
  }
}

// Função para verificar se duas cartas representam um par de evolução
function isEvolutionPair(card1, card2) {
  // Compara se as cartas formam um par válido, usando o array `pokemonPairs`.
  // Retorna `true` se:
  // 1. `card1` for a base e `card2` for a evolução.
  // 2. `card1` for a evolução e `card2` for a base.
  return pokemonPairs.some(pair => 
    (pair.base === card1 && pair.evolution === card2) || 
    (pair.base === card2 && pair.evolution === card1)
  );
}

// Reseta o estado do jogo para permitir que novas cartas sejam selecionadas
function resetSelection() {
  // Limpa as variáveis de seleção
  [firstCard, secondCard] = [null, null];
  // Desbloqueia o tabuleiro
  lockBoard = false;
}


