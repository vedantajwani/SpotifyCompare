// js/compare.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing visualizations');
  
  // Load the Venn diagram with track data
  loadVennData();
  
  // Load artist frequency data for bar chart
  loadBarChartData('artists');
  
  // Load genre data for bubble chart
  loadBubbleChartData();
});

async function loadVennData() {
  console.log('Loading Venn data for tracks');
  try {
    // Always use the top500 data for Venn diagram
    console.log('Fetching track data for Venn diagram');
    const data1 = await fetchCSV('./Data/user1Top500.csv');
    const data2 = await fetchCSV('./Data/user2Top500.csv');
    
    console.log('Data loaded for Venn diagram:', { data1Length: data1.length, data2Length: data2.length });
    
    // Draw Venn diagram
    const comparison = compareLists(data1, data2);
    console.log('Comparison results:', { 
      onlyA: comparison.onlyA.length, 
      onlyB: comparison.onlyB.length, 
      both: comparison.both.length 
    });
    drawVenn(comparison.onlyA, comparison.onlyB, comparison.both, 'tracks');
  } catch (error) {
    console.error('Error loading Venn data:', error);
  }
}

async function loadBarChartData(chartType) {
  console.log(`Loading bar chart data for ${chartType}`);
  try {
    let data1, data2;
    
    if (chartType === 'artists') {
      console.log('Fetching artist data for bar chart');
      data1 = await fetchCSV('./Data/user1ArtistFreqs.csv');
      data2 = await fetchCSV('./Data/user2ArtistFreqs.csv');
    } else if (chartType === 'tracks') {
      console.log('Fetching track data for bar chart');
      data1 = await fetchCSV('./Data/user1Top500.csv');
      data2 = await fetchCSV('./Data/user2Top500.csv');
    }
    
    console.log('Data loaded for bar chart:', { data1Length: data1.length, data2Length: data2.length });
    
    // Draw bar charts
    drawBarCharts(data1, data2);
  } catch (error) {
    console.error('Error loading bar chart data:', error);
  }
}

async function loadBubbleChartData() {
  console.log('Loading genre data for bubble chart');
  try {
    // Load genre data from the aggregated genre frequencies file
    const genreData = await loadGenreData();
    
    // Draw bubble chart
    drawBubbleChart(genreData);
  } catch (error) {
    console.error('Error loading bubble chart data:', error);
  }
}

// Helper function to fetch and parse CSV data
async function fetchCSV(url) {
  console.log(`Fetching CSV from ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();
    console.log(`CSV fetched successfully from ${url}, length: ${csvText.length} characters`);
    const parsed = parseCSV(csvText);
    console.log(`Parsed ${parsed.length} rows from CSV`);
    return parsed;
  } catch (error) {
    console.error(`Error fetching CSV from ${url}:`, error);
    return []; // Return empty array on error
  }
}

// Parse CSV text into an array of objects
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  if (lines.length < 2) {
    console.warn('CSV has less than 2 lines, might be invalid');
    return []; // Empty or invalid CSV
  }
  
  const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
  console.log('CSV headers:', headers);
  
  return lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => {
      const values = parseCSVLine(line);
      const obj = {};
      
      headers.forEach((header, index) => {
        if (index < values.length) {
          obj[header] = values[index];
        }
      });
      
      return obj;
    });
}

// Helper function to parse CSV line correctly handling quoted values
function parseCSVLine(line) {
  const result = [];
  let startPos = 0;
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '"') {
      inQuotes = !inQuotes;
    } else if (line[i] === ',' && !inQuotes) {
      let value = line.substring(startPos, i);
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      result.push(value.trim());
      startPos = i + 1;
    }
  }
  
  // Add the last value
  let value = line.substring(startPos);
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.substring(1, value.length - 1);
  }
  result.push(value.trim());
  
  return result;
}
