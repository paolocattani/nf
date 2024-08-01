import { createReadStream } from "node:fs";
import { getCardsFromLine } from "./player.js";
import { calcuteScore, compareScores } from "./game.js";

function readInputFile(filePath, callback) {
  const readableStream = createReadStream(filePath);
  readableStream.on("error", function (err) {
    console.error(err);
  });
  readableStream.on("data", callback);
}
function calculateLineStats(line) {
  const [cards1, cards2] = getCardsFromLine(line);
  const score1 = calcuteScore(cards1);
  const score2 = calcuteScore(cards2);
  return {
    player1: { cards: cards1, score: score1[2] },
    player2: { cards: cards2, score: score2[2] },
    winner: compareScores(score1, score2),
  };
}
function generateTotalStats(stats) {
  const player1Stat = { totalPoints: 0, cards: [], wins: 0 };
  const player2Stat = { totalPoints: 0, cards: [], wins: 0 };
  stats.forEach((hand) => {
    player1Stat.totalPoints += hand.player1.score;
    player1Stat.cards.push(hand.player1.cards);

    player2Stat.totalPoints += hand.player2.score;
    player2Stat.cards.push(hand.player2.cards);
    if (hand.winner === 1) {
      player1Stat.wins += 1;
    }
    if (hand.winner === 2) {
      player2Stat.wins += 1;
    }
  });
  return [player1Stat, player2Stat];
}

function printResults(player1Stat, player1Stat) {
  console.log("Player 1 wins : ", player1Stat.wins);
  console.log("Player 2 wins : ", player2Stat.wins);
  console.log(
    "Total points : ",
    player1Stat.totalPoints,
    player2Stat.totalPoints
  );
  //console.log("Player 2 cards : ", player2Stat.cards);
  console.log(
    "Winner : ",
    player1Stat.totalPoints > player2Stat.totalPoints ? 1 : 2
  );
}
readInputFile("resources/poker.txt", (chunk) => {
  const gameHands = chunk
    .toString()
    .split("\n")
    .filter((l) => !!l)
    .map(calculateLineStats);
  const [player1Stat, player2Stat] = generateTotalStats(gameHands);
  printResults(player1Stat, player2Stat);
});
