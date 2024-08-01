import { describe, test } from "node:test";
import { getCardsFromLine, getCardObject } from "../src/player.js";
import assert from "node:assert";

describe("Player functions", () => {
  test("Should return null for null input string", () => {
    const result = getCardsFromLine(null);
    assert.strictEqual(result, null);
  });
  test("Should return null for empty input string", () => {
    const result = getCardsFromLine("");
    assert.strictEqual(result, null);
  });

  test("Should return the player's hands", () => {
    const line = "8C TS KC 9H 4S 7D 2S 5D 3S AC";
    const elements = line.split(" ");
    const result = getCardsFromLine(line);

    assert.equal(Array.isArray(result), true);
    result[0].forEach((card, i) => {
      assert.deepStrictEqual(card, elements[i]);
    });
    result[1].forEach((card, i) => {
      assert.deepStrictEqual(card, elements[i + 5]);
    });
  });
});
