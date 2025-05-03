// js/compareArtists.js
export function compareLists(listA, listB) {
  console.log('Comparing lists:', { listALength: listA.length, listBLength: listB.length });
  
  // Extract track names from the CSV data
  // For track data, use the Track field
  const namesA = listA.map(item => {
    if (item.Track) return item.Track; // For top500 data
    if (item.artist) return item.artist; // For artist frequency data
    if (item.track) return item.track; // Fallback
    return '';
  }).filter(name => name !== '');
  
  const namesB = listB.map(item => {
    if (item.Track) return item.Track; // For top500 data
    if (item.artist) return item.artist; // For artist frequency data
    if (item.track) return item.track; // Fallback
    return '';
  }).filter(name => name !== '');
  
  console.log('Extracted names:', { namesALength: namesA.length, namesBLength: namesB.length });
  
  const setA = new Set(namesA);
  const setB = new Set(namesB);
  
  console.log('Created sets:', { setASize: setA.size, setBSize: setB.size });
  
  // Find items in both sets
  const bothNames = [...setA].filter(x => setB.has(x));
  
  // Find items only in set A
  const onlyANames = [...setA].filter(x => !setB.has(x));
  
  // Find items only in set B
  const onlyBNames = [...setB].filter(x => !setA.has(x));
  
  console.log('Name comparison results:', { 
    onlyANames: onlyANames.length, 
    onlyBNames: onlyBNames.length, 
    bothNames: bothNames.length 
  });
  
  // Convert back to full objects with additional data
  const onlyA = onlyANames.map(name => {
    return listA.find(item => 
      (item.Track === name) || (item.artist === name) || (item.track === name)
    );
  }).filter(Boolean);
  
  const onlyB = onlyBNames.map(name => {
    return listB.find(item => 
      (item.Track === name) || (item.artist === name) || (item.track === name)
    );
  }).filter(Boolean);
  
  const both = bothNames.map(name => {
    return listA.find(item => 
      (item.Track === name) || (item.artist === name) || (item.track === name)
    );
  }).filter(Boolean);
  
  console.log('Object conversion results:', { 
    onlyA: onlyA.length, 
    onlyB: onlyB.length, 
    both: both.length 
  });
  
  return { onlyA, onlyB, both };
}
