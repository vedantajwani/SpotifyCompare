/**
 * Given CSV text of format Track,Artists,Genres, returns array of { artist, count } sorted desc.
 * @param {string} csvText - full CSV text, including header row
 * @returns {{ artist: string, count: number }[]} - sorted from highest frequency to lowest
 */
export function getArtistFrequencies(csvText) {
    const lines = csvText.trim().split('\n');
    // remove header row
    lines.shift();
  
    // tally frequencies
    const counts = {};
    const regex = /(".*?"|[^",]+)(?=\s*,|\s*$)/g;
    for (const line of lines) {
      // parse CSV fields
      const cols = line.match(regex).map(s => s.replace(/^"|"$/g, ''));
      const artistsField = cols[1] || '';
      artistsField
        .split(';')
        .map(a => a.trim())
        .filter(Boolean)
        .forEach(name => {
          counts[name] = (counts[name] || 0) + 1;
        });
    }
  
    // convert to sorted array
    return Object.entries(counts)
      .map(([artist, count]) => ({ artist, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Merge two artist-frequency arrays, summing counts for overlaps,
   * and keep unique artists. Returns sorted array descending by count.
   * @param {{ artist: string, count: number }[]} freqs1
   * @param {{ artist: string, count: number }[]} freqs2
   * @returns {{ artist: string, count: number }[]}
   */
  export function mergeArtistFrequencies(freqs1, freqs2) {
    const map = new Map();
    freqs1.forEach(({ artist, count }) => {
      map.set(artist, count);
    });
    freqs2.forEach(({ artist, count }) => {
      map.set(artist, (map.get(artist) || 0) + count);
    });
    return Array.from(map.entries())
      .map(([artist, count]) => ({ artist, count }))
      .sort((a, b) => b.count - a.count);
  }
  