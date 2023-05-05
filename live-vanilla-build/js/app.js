const App = {
  // All of our selected HTML elements will be stored in this object
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector('[data-id="modal"]'),
    modalText: document.querySelector('[data-id="modal-text"]'),
    modalButton: document.querySelector('[data-id="modal-btn"]'),
    turn: document.querySelector('[data-id="turn"]'),
  },

  state: {
    moves: [],
  },

  getGameStatus(moves) {
    // Populate an array that contains all squareIds that p1 occupies
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    // Check if there is a winner or tie game
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    // Iterate through every pattern i.e. [1,2,3], [1,5,9]... etc...
    winningPatterns.forEach((pattern) => {
      // p1Wins if every value in a pattern is included in p1Moves. p1Moves is an array containing all of the squareIds p1 has placed in.
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) winner = 1;
      if (p2Wins) winner = 2;
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress", // in-progress | complete
      winner, // 1 | 2 | null
    };
  },

  // Initialise event listeners
  init() {
    App.registerEventListeners();
  },
  registerEventListeners() {
    // Add event listener to menu button
    App.$.menu.addEventListener("click", (event) => {
      App.$.menuItems.classList.toggle("hidden");
    });
    // Add event listener to reset button
    App.$.resetBtn.addEventListener("click", (event) => {
      console.log("Reset the game");
    });
    // Add event listener to new round button
    App.$.newRoundBtn.addEventListener("click", (event) => {
      console.log("Start a new round");
    });
    // Add event listener to modal play again
    App.$.modalButton.addEventListener("click", (event) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => square.replaceChildren());
      App.$.modal.classList.add("hidden");
    });
    // Add event listeners to each square
    App.$.squares.forEach((square) => {
      square.addEventListener("click", (event) => {
        const hasMove = (squareId) => {
          // Check all elements in array where element is move, if move.squareId === squareId then we know it that squareId is already occupied
          // This will return undefined if it isn't occupied. If it is occupied, it will return the element, i.e. ({squareId:1, playerId: 1})
          const existingMove = App.state.moves.find(
            (move) => move.squareId === squareId
          );
          // If it is not defined, (i.e. it is not populated), then there is an existing move, else there is not an existing move.
          return existingMove !== undefined;
        };

        // Check if there is already a x or o, if so, return early
        if (hasMove(+square.id)) {
          return;
        }
        // Determine which player icon to add to the square
        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);
        const nextPlayer = getOppositePlayer(currentPlayer);
        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer}, you're up!`;

        if (currentPlayer === 1) {
          // Create <i class="fa-solid fa-x yellow"></i>
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-x", "turquoise");
          turnLabel.classList = "turquoise";
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-o", "yellow");
          turnLabel.classList = "yellow";
        }

        App.$.turn.replaceChildren(turnIcon, turnLabel);

        App.state.moves.push({
          squareId: +square.id,
          playerId: currentPlayer,
        });

        square.replaceChildren(squareIcon);

        // Check if thre is a winner or tie game
        const game = App.getGameStatus(App.state.moves);
        if (game.status === "complete") {
          App.$.modal.classList.remove("hidden");

          let message = "";
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "It's a tie!";
          }
          App.$.modalText.textContent = message;
        }
      });
    });
  },
};

window.addEventListener("load", () => App.init());
