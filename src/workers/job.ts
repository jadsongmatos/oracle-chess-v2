import { Chess } from "chess.js";

function map_gameover_depth4(game: Chess) {
  var moves = 0;
  var new_moves = 0;
  var fen_game2d = "";
  var start_time = performance.now();

  const map = game.moves({ verbose: false }).map((move1d) => {
    let game1d = new Chess(game.fen());
    game1d.move(move1d);

    const game_over1d = game1d.isGameOver();
    if (game_over1d) {
      return [{ gameover: true, checkmate: game1d.isCheckmate() }];
    }

    const moves1dResult = game1d.moves({ verbose: false }).map((move2d) => {
      let game2d = new Chess(game1d.fen());
      game2d.move(move2d);

      const game_over2d = game2d.isGameOver();
      if (game_over2d) {
        return [{ gameover: true, checkmate: game2d.isCheckmate() }];
      }

      const moves3dResult = game2d.moves({ verbose: false }).map((move3d) => {
        fen_game2d = game2d.fen();

        let game3d = new Chess(fen_game2d);
        game3d.move(move3d);

        self.postMessage({
          type: "progress",
          moves: moves,
          new_moves,
          fen: fen_game2d,
          duration: performance.now() - start_time,
          moves_PerSec: Math.ceil(
            moves / ((performance.now() - start_time) / 1000)
          ),
        });
        new_moves = 0;

        const game_over3d = game3d.isGameOver();
        if (game_over3d) {
          return [{ gameover: true, checkmate: game3d.isCheckmate() }];
        }

        const moves4dResult = game3d.moves({ verbose: false }).map((move4d) => {
          let game4d = new Chess(game3d.fen());
          game4d.move(move4d);
          moves++;
          new_moves++

          return {
            gameover: game4d.isGameOver(),
            checkmate: game4d.isCheckmate(),
          };
        });

        return [{ gameover: game_over3d, checkmate: false }, moves4dResult];
      });

      return [{ gameover: game_over2d, checkmate: false }, moves3dResult];
    });

    return [{ gameover: game_over1d, checkmate: false }, moves1dResult];
  });

  self.postMessage({
    type: "progress",
    moves,
    fen: fen_game2d,
    new_moves,
    duration: performance.now() - start_time,
    moves_PerSec: Math.ceil(moves / (performance.now() / 1000)),
  });

  return map;
}

export interface Move {
  move: number;
  id: number;
}

function load_game(moves: Array<Move>) {
  const game = new Chess();

  // Apply moves
  moves.forEach((moveIndex) => {
    let availableMoves = game.moves();
    if (moveIndex.move >= 0 && moveIndex.move < availableMoves.length) {
      game.move(availableMoves[moveIndex.move]);
    } else {
      console.error(`Invalid move index: ${moveIndex.move}`);
    }
  });

  return game;
}

self.onmessage = (event) => {
  console.log("onmessage", event.data);

  const chess = load_game(event.data.job.moves);
  const chess_map = map_gameover_depth4(chess);

  self.postMessage({
    type: "then",
    data: chess_map,
    id: event.data.job.id,
  });
};
