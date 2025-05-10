// js/bubbleChart.js

// Function to draw the bubble chart
function drawBubbleChart(data) {
  console.log('Drawing bubble chart with:', { dataLength: data.length });
  
  // Clear previous visualization
  d3.select('#bubble-container').selectAll('*').remove();
  
  // Set up dimensions
  const width = 800;
  const height = 600;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  
  // Create SVG
  const svg = d3.select('#bubble-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Calculate inner dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  // Add title
  svg.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', 700)
    .style('font-size', '18px')
    .style('fill', '#ffffff')
    .text('Genre Distribution');
  
  // Filter data to top 40 genres for better visualization
  const topGenres = data.sort((a, b) => b.count - a.count).slice(0, 40);
  
  // Create a color scale for genres
  const colorScale = d3.scaleOrdinal()
    .domain(topGenres.map(d => d.genre))
    .range(d3.schemeCategory10);
  
  // Create a size scale for bubbles
  const maxCount = d3.max(topGenres, d => +d.count);
  const sizeScale = d3.scaleSqrt()
    .domain([0, maxCount])
    .range([10, 70]);
  
  // Create a force simulation
  const simulation = d3.forceSimulation(topGenres)
    .force('charge', d3.forceManyBody().strength(5))
    .force('center', d3.forceCenter(innerWidth / 2, innerHeight / 2))
    .force('collision', d3.forceCollide().radius(d => sizeScale(+d.count) + 2))
    .on('tick', ticked);
  
  // Create a group for each bubble
  const bubbles = svg.selectAll('.bubble')
    .data(topGenres)
    .enter()
    .append('g')
    .attr('class', 'bubble')
    .style('cursor', 'pointer')
    .on('mouseover', function(event, d) {
      // Show tooltip on hover
      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      tooltip.html(`<div class="tooltip-header">${d.genre}</div><div class="tooltip-content">${d.count} tracks</div>`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
        
      // Highlight the current bubble
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('stroke', '#1DB954')
        .attr('stroke-width', 3);
    })
    .on('mouseout', function() {
      // Hide tooltip
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
        
      // Remove highlight
      d3.select(this).select('circle')
        .transition()
        .duration(200)
        .attr('stroke', '#444444')
        .attr('stroke-width', 1);
    });
  
  // Add a circle to each bubble group
  bubbles.append('circle')
    .attr('r', d => sizeScale(+d.count))
    .style('fill', d => {
      // Create a gradient for each bubble
      const gradientId = `bubble-gradient-${d.genre.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
      
      const gradient = svg.append('defs')
        .append('radialGradient')
        .attr('id', gradientId)
        .attr('cx', '30%')
        .attr('cy', '30%')
        .attr('r', '70%');
      
      // Add gradient stops
      const baseColor = colorScale(d.genre);
      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d3.rgb(baseColor).brighter(1))
        .attr('stop-opacity', 0.9);
      
      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.rgb(baseColor).darker(0.5))
        .attr('stop-opacity', 0.7);
      
      return `url(#${gradientId})`;
    })
    .style('stroke', '#444444')
    .style('stroke-width', 1)
    .style('filter', 'drop-shadow(0 0 3px rgba(0, 0, 0, 0.2))');
  
  // Add text labels to larger bubbles
  bubbles.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '.3em')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-size', d => {
      const size = sizeScale(+d.count);
      return size > 30 ? '12px' : (size > 20 ? '10px' : '0px');
    })
    .style('fill', '#ffffff')
    .style('pointer-events', 'none')
    .style('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.5)')
    .text(d => {
      const size = sizeScale(+d.count);
      return size > 20 ? d.genre : '';
    });
  
  // Create a tooltip
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
  
  // Add a legend
  const legendSize = 20;
  const legendSpacing = 30;
  const legendData = [
    { label: 'Large (100+ tracks)', size: sizeScale(100) },
    { label: 'Medium (50+ tracks)', size: sizeScale(50) },
    { label: 'Small (10+ tracks)', size: sizeScale(10) }
  ];
  
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${innerWidth - 200}, ${innerHeight - 100})`);
  
  legend.append('text')
    .attr('x', 0)
    .attr('y', -20)
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', 600)
    .style('font-size', '14px')
    .style('fill', '#ffffff')
    .text('Bubble Size Legend');
  
  const legendItems = legend.selectAll('.legend-item')
    .data(legendData)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (d, i) => `translate(0, ${i * legendSpacing})`);
  
  legendItems.append('circle')
    .attr('r', d => d.size / 2)
    .style('fill', 'none')
    .style('stroke', '#1DB954')
    .style('stroke-width', 1);
  
  legendItems.append('text')
    .attr('x', legendSize * 1.5)
    .attr('y', 5)
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-size', '12px')
    .style('fill', '#ffffff')
    .text(d => d.label);
  
  // Function to update positions on each tick of the simulation
  function ticked() {
    bubbles.attr('transform', d => `translate(${d.x},${d.y})`);
  }
}

// Helper function to load genre data
async function loadGenreData() {
  try {
    console.log('Loading genre data for bubble chart');
    const response = await fetch('./Data/aggregatedGenreFreqs.csv');
    const csvText = await response.text();
    
    // Parse CSV
    const rows = csvText.split('\n');
    const headers = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    const data = rows.slice(1)
      .filter(row => row.trim() !== '')
      .map(row => {
        const values = parseCSVLine(row);
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        return obj;
      });
    
    console.log(`Loaded ${data.length} genres for bubble chart`);
    return data;
  } catch (error) {
    console.error('Error loading genre data:', error);
    return [];
  }
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
