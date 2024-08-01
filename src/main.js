import { createReadStream } from "node:fs";
import { Transform, pipeline } from "node:stream";
import { getCardsFromLine } from "./player.js";
import { calcuteScore, compareScores } from "./game.js";

function readInputFile(filePath, callback) {
  const readableStream = createReadStream(filePath);
  readableStream.on("error", function (err) {
    console.error(err);
  });
  readableStream.on("data", callback);
}

export const a = pipeline(
  createReadStream("resources/poker.txt"),
  new Transform({
    transform(chunk, _, callback) {
      const gameHands = chunk
        .toString()
        .split("\n")
        .map((line) => {
          const players = getCardsFromLine(line);
          console.log("players:", players);
          return { players };
        });
      console.log("gameHands", gameHands);
      callback(null, gameHands);
    },
  }),
  /*
  new Transform({
    transform([player1Cards, player2Cards], _, callback) {
      const score1 = calcuteScore(player1Cards);
      const score2 = calcuteScore(player2Cards);
      callback(null, [score1, score2]);
    },
  }),
  new Transform({
    transform([score1, score2], _, callback) {
      const winner = compareScores(score1, score2);
      callback(null, winner);
    },
  }),
  */
  process.stdout,
  (err) => {
    if (err) {
      console.error("Pipeline failed", err);
    } else {
      console.log("Pipeline succeeded");
    }
  }
);

/*
readInputFile("resources/poker.txt", (chunk) => {
  console.log(chunk.toString());
});
*/
