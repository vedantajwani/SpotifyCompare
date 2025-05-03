// js/barChart.js
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export function drawBarCharts(data1, data2) {
  // Clear previous visualization
  d3.select('#bar-container').selectAll('*').remove();
  
  // Get top 10 artists from each dataset
  const top10User1 = getTopItems(data1, 10);
  const top10User2 = getTopItems(data2, 10);
  
  // Set up dimensions
  const margin = { top: 50, right: 50, bottom: 50, left: 220 };
  const width = 800 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  // Create SVG
  const svg = d3.select('#bar-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
  
  // Add metallic gradients
  const defs = svg.append('defs');
  
  // Metallic gradient for User 1 bars
  const gradientUser1 = defs.append('linearGradient')
    .attr('id', 'bar-gradient-user1')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');
  
  gradientUser1.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#2EE566')
    .attr('stop-opacity', 1);
  
  gradientUser1.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', '#1DB954')
    .attr('stop-opacity', 1);
  
  gradientUser1.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#0E5E2A')
    .attr('stop-opacity', 1);
  
  // Metallic gradient for User 2 bars
  const gradientUser2 = defs.append('linearGradient')
    .attr('id', 'bar-gradient-user2')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '0%');
  
  gradientUser2.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#444444')
    .attr('stop-opacity', 1);
  
  gradientUser2.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', '#191414')
    .attr('stop-opacity', 1);
  
  gradientUser2.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#000000')
    .attr('stop-opacity', 1);
  
  // Combine data for scale calculation
  const combinedData = [...top10User1, ...top10User2];
  
  // Create scales
  const xScale = d3.scaleLinear()
    .domain([0, d3.max(combinedData, d => d.count) * 1.1]) // Add 10% padding
    .range([0, width]);
  
  // Get unique artist names from both datasets
  const allArtists = Array.from(new Set([
    ...top10User1.map(d => d.name),
    ...top10User2.map(d => d.name)
  ]));
  
  // Sort artists by total count (sum of both users)
  allArtists.sort((a, b) => {
    const countA = (top10User1.find(d => d.name === a)?.count || 0) + 
                   (top10User2.find(d => d.name === a)?.count || 0);
    const countB = (top10User1.find(d => d.name === b)?.count || 0) + 
                   (top10User2.find(d => d.name === b)?.count || 0);
    return countB - countA;
  });
  
  // Limit to top 10 combined artists
  const top10Artists = allArtists.slice(0, 10);
  
  const yScale = d3.scaleBand()
    .domain(top10Artists)
    .range([0, height])
    .padding(0.3);
  
  // Add X axis with metallic styling
  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .attr('class', 'axis');
  
  // Style the axis
  xAxis.selectAll('path')
    .style('stroke', '#666')
    .style('stroke-width', 1);
  
  xAxis.selectAll('line')
    .style('stroke', '#666')
    .style('stroke-width', 1);
  
  xAxis.selectAll('text')
    .style('fill', '#ccc')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-size', '12px');
  
  // Add X axis label
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .style('text-anchor', 'middle')
    .style('fill', '#fff')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-size', '14px')
    .text('Frequency');
  
  // Add Y axis with metallic styling
  const yAxis = svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('class', 'axis');
  
  // Style the axis
  yAxis.selectAll('path')
    .style('stroke', '#666')
    .style('stroke-width', 1);
  
  yAxis.selectAll('line')
    .style('stroke', '#666')
    .style('stroke-width', 1);
  
  yAxis.selectAll('text')
    .style('fill', '#fff')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-size', '12px');
  
  // Add grid lines
  svg.selectAll('grid-line')
    .data(xScale.ticks())
    .enter()
    .append('line')
    .attr('x1', d => xScale(d))
    .attr('y1', 0)
    .attr('x2', d => xScale(d))
    .attr('y2', height)
    .style('stroke', 'rgba(255, 255, 255, 0.1)')
    .style('stroke-width', 1);
  
  // Draw bars for User 1 with metallic effect
  svg.selectAll('.bar-user1')
    .data(top10Artists)
    .enter()
    .append('rect')
    .attr('class', 'bar-user1')
    .attr('y', d => yScale(d))
    .attr('height', yScale.bandwidth() / 2)
    .attr('x', 0)
    .attr('width', d => {
      const artist = top10User1.find(a => a.name === d);
      return artist ? xScale(artist.count) : 0;
    })
    .attr('fill', 'url(#bar-gradient-user1)')
    .attr('rx', 3) // Rounded corners
    .attr('ry', 3)
    .style('filter', 'drop-shadow(0px 0px 3px rgba(29, 185, 84, 0.5))')
    .on('mouseover', function(event, d) {
      const artist = top10User1.find(a => a.name === d);
      if (artist) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);
        
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip.html(`<strong>User 1:</strong> ${artist.name}<br>Count: ${artist.count}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      }
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1);
      
      d3.selectAll('.tooltip').remove();
    });
  
  // Draw bars for User 2 with metallic effect
  svg.selectAll('.bar-user2')
    .data(top10Artists)
    .enter()
    .append('rect')
    .attr('class', 'bar-user2')
    .attr('y', d => yScale(d) + yScale.bandwidth() / 2)
    .attr('height', yScale.bandwidth() / 2)
    .attr('x', 0)
    .attr('width', d => {
      const artist = top10User2.find(a => a.name === d);
      return artist ? xScale(artist.count) : 0;
    })
    .attr('fill', 'url(#bar-gradient-user2)')
    .attr('rx', 3) // Rounded corners
    .attr('ry', 3)
    .style('filter', 'drop-shadow(0px 0px 3px rgba(0, 0, 0, 0.5))')
    .on('mouseover', function(event, d) {
      const artist = top10User2.find(a => a.name === d);
      if (artist) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 0.8);
        
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip.html(`<strong>User 2:</strong> ${artist.name}<br>Count: ${artist.count}`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      }
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1);
      
      d3.selectAll('.tooltip').remove();
    });
  
  // Add legend
  const legend = svg.append('g')
    .attr('transform', `translate(${width - 200}, -40)`);
  
  // User 1 legend
  legend.append('rect')
    .attr('width', 20)
    .attr('height', 10)
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('fill', 'url(#bar-gradient-user1)');
  
  legend.append('text')
    .attr('x', 30)
    .attr('y', 9)
    .text('User 1')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-size', '12px')
    .style('fill', '#fff');
  
  // User 2 legend
  legend.append('rect')
    .attr('width', 20)
    .attr('height', 10)
    .attr('rx', 3)
    .attr('ry', 3)
    .attr('y', 20)
    .attr('fill', 'url(#bar-gradient-user2)');
  
  legend.append('text')
    .attr('x', 30)
    .attr('y', 29)
    .text('User 2')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-size', '12px')
    .style('fill', '#fff');
}

// Helper function to get top items with counts
function getTopItems(data, limit) {
  // Extract artist or track names and counts from CSV data
  const items = {};
  
  data.forEach(item => {
    const name = item.artist || item.track || '';
    const count = parseInt(item.count) || 1;
    
    if (name) {
      items[name] = (items[name] || 0) + count;
    }
  });
  
  // Convert to array and sort
  const sortedItems = Object.keys(items)
    .map(name => ({ name, count: items[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  return sortedItems;
}
