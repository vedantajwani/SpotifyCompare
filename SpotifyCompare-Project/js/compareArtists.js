// js/compareArtists.js
export function compareLists(listA, listB) {
  const setA = new Set(listA);
  const setB = new Set(listB);
  const both  = [...setA].filter(x => setB.has(x));
  const onlyA = [...setA].filter(x => !setB.has(x));
  const onlyB = [...setB].filter(x => !setA.has(x));
  return { onlyA, onlyB, both };
}
