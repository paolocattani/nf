import { describe, test } from "node:test";
import {
  hasRoyalFlush,
  hasStraightFlush,
  hasFourOfAKind,
  hasFullHouse,
  hasFlush,
  hasStraight,
  hasThree,
  hasTwoPairs,
  hasOnePair,
  getCardObject,
  isSameSuite,
  isSameValue,
  calcuteScore,
} from "../src/game.js";
import assert from "node:assert";

describe("Should detect Royal Flush", () => {
  test("Should return the cards", () => {
    const cards = ["TD", "JD", "QD", "KD", "AD"];
    const result = hasRoyalFlush(cards);
    cards.forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("Should return null", () => {
    const result = hasRoyalFlush(["TD", "JH", "QD", "KD", "AD"]);
    assert.deepStrictEqual(result, null);
  });
});

describe("Should detect Straight Flush", () => {
  test("with consecutive numbers", () => {
    const cards = ["2D", "3D", "4D", "5D", "6D"];
    const result = hasStraightFlush(cards);
    cards.forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("consecutive figures", () => {
    const cards = ["TD", "JD", "QD", "KD", "AD"];
    const result = hasRoyalFlush(cards);
    cards.forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });

  test("if suites are not equal", () => {
    const result = hasStraightFlush(["TD", "JH", "QD", "KD", "AD"]);
    assert.deepStrictEqual(result, null);
  });
  test("if values are not consecutives", () => {
    const result = hasStraightFlush(["TD", "9D", "QD", "KD", "AD"]);
    assert.deepStrictEqual(result, null);
  });
});

describe("Should detect Four of a Kind", () => {
  test("happy path with all cards of the same value", () => {
    const cards = ["2D", "2D", "2D", "2D", "2D"];
    const result = hasFourOfAKind(cards);
    ["2D", "2D", "2D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("happy path with card of different values ordered", () => {
    const cards = ["3D", "2D", "2D", "2D", "2D"];
    const result = hasFourOfAKind(cards);

    ["2D", "2D", "2D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("happy path with card of different values unordered", () => {
    const cards = ["2D", "2H", "5D", "2D", "2D"];
    const result = hasFourOfAKind(cards);
    ["2D", "2H", "2D", "2D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("bad path with card of different values", () => {
    const cards = ["2D", "2H", "5D", "3D", "9D"];
    const result = hasFourOfAKind(cards);
    assert.deepStrictEqual(result, null);
  });
});

describe("Should detect Full House", () => {
  test("happy path", () => {
    const cards = ["2D", "2D", "2D", "5D", "5D"];
    const result = hasFullHouse(cards);
    ["2D", "2D", "2D", "5D", "5D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("bad path with card of different values", () => {
    const cards = ["2D", "2H", "5D", "3D", "9D"];
    const result = hasFullHouse(cards);
    assert.deepStrictEqual(result, null);
  });
});

describe("Should detect Flush", () => {
  test("happy path", () => {
    const cards = ["2D", "2D", "2D", "5D", "5D"];
    const result = hasFlush(cards);
    ["2D", "2D", "2D", "5D", "5D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("bad path with card of different values", () => {
    const cards = ["2D", "2H", "5D", "3D", "9D"];
    const result = hasFlush(cards);
    assert.deepStrictEqual(result, null);
  });
});

describe("Should detect Straight", () => {
  test("with consecutive numbers", () => {
    const cards = ["2D", "3D", "4H", "5D", "6D"];
    const result = hasStraight(cards);
    cards.forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("consecutive figures", () => {
    const cards = ["TD", "JD", "QH", "KD", "AD"];
    const result = hasStraight(cards);
    cards.forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });

  test("if suites are not equal", () => {
    const result = hasStraight(["TD", "JH", "4D", "KD", "AD"]);
    assert.deepStrictEqual(result, null);
  });
  test("if values are not consecutives", () => {
    const result = hasStraight(["TD", "9D", "QD", "KD", "AD"]);
    assert.deepStrictEqual(result, null);
  });
});

describe("Should detect Three of a Kind", () => {
  test("ordered values", () => {
    const result = hasThree(["2D", "2D", "2D", "TD", "5D"]);
    ["2D", "2D", "2D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("unorderd values", () => {
    const result = hasThree(["5D", "2D", "5D", "TD", "5D"]);
    ["5D", "5D", "5D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("with no values", () => {
    const result = hasThree(["3D", "2D", "5D", "TD", "5D"]);
    assert.deepStrictEqual(result, null);
  });
});
describe("Should detect Two Pairs", () => {
  test("ordered values", () => {
    const result = hasTwoPairs(["2D", "2D", "5D", "TD", "5D"]);
    ["5D", "5D", "2D", "2D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("unorderd values", () => {
    const result = hasTwoPairs(["5D", "2D", "5D", "TD", "TD"]);
    ["TD", "TD", "5D", "5D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("with no values", () => {
    const result = hasTwoPairs(["3D", "2D", "5D", "TD", "5D"]);
    assert.deepStrictEqual(result, null);
  });
});
describe("Should detect One Pair card", () => {
  test("just one pair", () => {
    const result = hasOnePair(["2D", "2D", "JD", "TD", "5D"]);
    ["2D", "2D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
  test("two pair with diffent values pair", () => {
    const result = hasOnePair(["2D", "2D", "5D", "TD", "5D"]);
    ["5D", "5D"].forEach((card, i) => {
      assert.deepStrictEqual(card, result[i]);
    });
  });
});

describe("Should detect Highest card", () => {
  test("all cards are of the same suite", () => {
    const result = isSameSuite(["2D", "3D", "JD", "TD", "5D"]);
    assert.deepStrictEqual(result, true);
  });
  test("all cards are not of the same suite", () => {
    const result = isSameSuite(["2D", "3D", "JH", "TS", "6C"]);
    assert.deepStrictEqual(result, false);
  });
});

describe("Parse card entry", () => {
  test("Shuold return the correct parsed card object", () => {
    const result = getCardObject("2D");
    assert.deepStrictEqual(result, {
      suite: "D",
      value: "2",
      points: 2,
      letteral: "2D",
    });
  });
});

describe("Same Suite", () => {
  test("Shuold return true when all cards are of the same suite", () => {
    const result = isSameSuite(["2D", "3D", "JD", "TD", "5D"]);
    assert.deepStrictEqual(result, true);
  });
  test("Shuold return false when all cards are not of the same suite", () => {
    const result = isSameSuite(["2D", "3D", "JH", "TC", "5S"]);
    assert.deepStrictEqual(result, false);
  });
});

describe("Same Value", () => {
  test("Shuold return true when all cards are of the same value", () => {
    const result = isSameValue(["2D", "2H", "2S", "2D", "2D"]);
    assert.deepStrictEqual(result, true);
  });
  test("Shuold return false when all cards are not of the same value", () => {
    const result = isSameValue(["2D", "3D", "JH", "TD", "5D"]);
    assert.deepStrictEqual(result, false);
  });
});

describe.only("Should calculate hand score", () => {
  test("Pair of five", () => {
    const [score, cards] = calcuteScore(["5H", "5C", "6S", "7S", "KD"]);
    ["5H", "5C"].forEach((card, i) => {
      assert.deepStrictEqual(card, cards[i]);
    });
    assert.deepStrictEqual(score, 3);
  });
  test("Full House", () => {
    const [score, cards] = calcuteScore(["2H", "2D", "4C", "4D", "4S"]);
    const wrong = cards.filter((r) => !["4C", "4D", "4S"].includes(r));
    assert.deepStrictEqual(score, 7);
    assert.deepStrictEqual(wrong.length, 0);
  });
});
