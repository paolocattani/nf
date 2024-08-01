/**
 *
 * @param {*} line in the format of "8C TS KC 9H 4S 7D 2S 5D 3S AC"
 * @returns an array of two arrays, one for each player
 */
export function getCardsFromLine(line) {
  if (!line || !line.trim()) {
    return null;
  }

  const chunks = line.replace(/\n/g, "").split(" ");
  if (chunks.length !== 10) {
    return null;
  }

  const c1 = chunks.slice(0, 5);
  const c2 = chunks.slice(5);
  return [c1, c2];
}
