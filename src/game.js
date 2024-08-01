const SCORES = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

/**
 * Score are in form of [score point, score cards]
 *
 * @param {*} score1 the first score
 * @param {*} score2 the secondo score
 *
 * @returns 1 or 2 for the player who won
 */
export function compareScores(score1, score2) {
  let winner = compareScoresValues(score1, score2);
  const handlers = [compareCardsValue, compareHighestCards];
  for (let i = 0; i < handlers.length && winner === null; i++) {
    winner = handlers[i](score1[1], score2[1]);
  }
  return winner;
}

function compareScoresValues(score1, score2) {
  let result = null;
  if (score1 > score2) {
    result = 1;
  }
  if (score2 > score1) {
    result = 2;
  }

  return result;
}
function compareCardsValue(score1, score2) {
  let result = null;

  const value1 = calculateCardsValue(score1[1]);
  const value2 = calculateCardsValue(score2[1]);
  if (value1 > value2) {
    result = 1;
  }
  if (value2 > value1) {
    result = 2;
  }

  return result;
}
function compareHighestCards(cards1, cards2) {
  // Compare Highest Card
  let result = null;
  const highest1 = getCardObject(hasHighestCard(cards1));
  const highest2 = getCardObject(hasHighestCard(cards2));
  if (highest1.points > highest2.points) {
    result = 1;
  }
  if (highest2.points > highest1.points) {
    result = 2;
  }

  return result;
}
function calculateCardsValue(cards) {
  return cards.reduce((acc, c) => {
    const card = getCardObject(c);
    return acc + card.points;
  }, 0);
}
/**
 * Calculate the highest possibile score from the provided hand
 * @param cards an array of cards
 * @returns the cards that compose the rank or null
 */
export function calcuteScore(cards) {
  const ranksCalculators = [
    hasRoyalFlush,
    hasStraightFlush,
    hasFourOfAKind,
    hasFullHouse,
    hasFlush,
    hasThree,
    hasTwoPairs,
    hasOnePair,
    hasHighestCard,
  ];

  let rankCards = null;
  let rankScore = 0;
  for (let i = 0; i < ranksCalculators.length && rankCards === null; i++) {
    rankCards = ranksCalculators[i](cards);
    rankScore = 10 - i;
  }

  return [rankScore, rankCards, calculateCardsValue(rankCards)];
}

/**
 * **Royal Flush**: Ten, Jack, Queen, King, Ace, in same suit.
 * @param cards an array of cards
 * @returns the cards that compose the rank or null
 */
export function hasRoyalFlush(cards) {
  if (cards.length !== 5) {
    return null;
  }
  if (!isSameSuite(cards)) {
    return null;
  }
  const filteredCards = cards.filter((c) => {
    const { value } = getCardObject(c);
    return ["J", "Q", "K", "A"].includes(value);
  });

  return filteredCards.length === 4 ? cards : null;
}

/**
 * **Straight Flush**: All cards are consecutive values of same suit.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasStraightFlush(cards) {
  if (cards.length !== 5) {
    return null;
  }
  if (!isSameSuite(cards)) {
    return null;
  }
  return isConsecutiveValues(cards);
}

/**
 * **Four of a Kind**: Four cards of the same value.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasFourOfAKind(cards) {
  if (cards.length !== 5) {
    return null;
  }
  const sortedCards = sortCardsByValue(cards, false);
  let result = null;
  for (let ii = 0; ii < sortedCards.length; ii++) {
    let sliced = [...sortedCards];
    sliced.splice(ii, 1);
    if (isSameValue(sliced)) {
      result = sliced.map((c) => c.letteral);
      break;
    }
  }
  return result;
}

/**
 * **Full House**: Three of a kind and a pair.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasFullHouse(cards) {
  if (cards.length !== 5) {
    return null;
  }
  let threeResult = hasThree(cards);
  if (!threeResult?.length) {
    return null;
  }

  const temp = cards.filter((c) => !threeResult.includes[c]);
  let pairResult = hasOnePair(temp);
  if (!pairResult?.length) {
    return null;
  }
  return [...threeResult, ...pairResult];
}

/**
 * **Flush**: All cards of the same suit.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasFlush(cards) {
  if (cards.length !== 5) {
    return null;
  }
  return isSameSuite(cards) ? cards : null;
}

/**
 * **Straight**: All cards are consecutive values.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasStraight(cards) {
  if (cards.length !== 5) {
    return null;
  }
  return isConsecutiveValues(cards);
}

/**
 * **Three of a Kind**: Three cards of the same value.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasThree(cards) {
  if (cards.length !== 5) {
    return null;
  }

  let result = null;
  /*
    {
      5: ["5D","5C","5K"]
      K: ["KS"]
      J: ["JD"]
    }
  */
  const aggregatedValues = aggregateCardsbyValue(cards);
  const temp = Object.values(aggregatedValues).find((v) => v.length === 3);
  if (temp?.length) {
    result = temp;
  }
  return result;
}
/**
 * **Two Pairs**: Two different pairs.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasTwoPairs(cards) {
  if (cards.length !== 5) {
    return null;
  }

  let result = null;
  /*
    {
      5: ["5D","5C","5K"]
      K: ["KS"]
      J: ["JD"]
    }
  */

  const aggregatedValues = aggregateCardsbyValue(cards);
  const temp = Object.values(aggregatedValues)
    .filter((v) => v.length === 2)
    .flatMap((v) => v);

  if (temp?.length === 4) {
    result = sortCardsByValue(temp).map((v) => v.letteral);
  }
  return result;
}

function aggregateCardsbyValue(cards) {
  return cards.reduce((acc, c) => {
    const card = getCardObject(c);
    if (acc[card.value]) {
      acc[card.value] = [...acc[card.value], card.letteral];
    } else {
      acc[card.value] = [card.letteral];
    }
    return acc;
  }, {});
}
/**
 * **One Pair**: Two cards of the same value.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasOnePair(cards) {
  let result = null;
  const aggregatedValues = aggregateCardsbyValue(cards);
  const temp = Object.values(aggregatedValues)
    .filter((v) => v.length === 2)
    .flatMap((v) => v);

  if (temp?.length >= 2) {
    result = sortCardsByValue(temp)
      .map((c) => c.letteral)
      .slice(0, 2);
  }
  return result;
}

/**
 * **High Card**: Highest val ue card.
 * @param cards an array of cards
 * @returns the cards that compose the rank
 */
export function hasHighestCard(cards) {
  const sortedCards = cards.map(getCardObject);
  sortedCards.sort((v1, v2) => v2.points - v1.points);
  return [sortedCards[0].letteral];
}

/**
 * @param cards an array of cards
 * @returns true if all card are of the same suite
 */
export function isSameSuite(cards) {
  const { suite: firstSuite } =
    typeof cards[0] === "object" ? cards[0] : getCardObject(cards[0]);
  let isSameSuite = true;
  let lastSuite = firstSuite;
  for (let i = 0; i < cards.length; i++) {
    const { suite } =
      typeof cards[0] === "object" ? cards[i] : getCardObject(cards[i]);
    if (lastSuite !== suite) {
      isSameSuite = false;
      break;
    }
    lastSuite = suite;
  }

  return isSameSuite;
}
/**
 * @param cards an array of cards
 * @returns true if all card are of the same value
 */
export function isSameValue(cards) {
  const { value: first } =
    typeof cards[0] === "object" ? cards[0] : getCardObject(cards[0]);
  let isSame = true;
  let last = first;
  for (let i = 0; i < cards.length; i++) {
    const { value } =
      typeof cards[0] === "object" ? cards[i] : getCardObject(cards[i]);
    if (last !== value) {
      isSame = false;
      break;
    }
    last = value;
  }

  return isSame;
}

/**
 * @param card a card in string format like "2D"
 * @returns an object with the property of the card
 */
export function getCardObject(card) {
  const value = card.substring(0, 1);
  return {
    value,
    suite: card.substring(1, 2),
    points: SCORES[value],
    letteral: card,
  };
}

export function sortCardsByValue(cards, asc) {
  const sortedCards = cards.map(getCardObject);
  sortedCards.sort((v1, v2) =>
    asc ? v1.points - v2.points : v2.points - v1.points
  );
  return sortedCards;
}

export function isConsecutiveValues(cards) {
  let result = cards;
  const sortedCards = sortCardsByValue(cards, true);
  console.log("sorted Values : ", sortedCards);
  let lastValue = sortedCards[0].points;
  for (let ii = 1; ii < sortedCards.length; ii++) {
    if (sortedCards[ii].points !== lastValue + 1) {
      result = null;
      break;
    }
    lastValue = sortedCards[ii].points;
  }
  console.log("result : ", result);
  return result;
}
