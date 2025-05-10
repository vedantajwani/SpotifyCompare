// js/barChart.js

function drawBarCharts(data1, data2) {
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
    .domain([0, d3.max(combinedData, d => d.count) * 1.1])
    .range([0, width]);
  
  // Get unique artist names
  const allArtists = Array.from(new Set([
    ...top10User1.map(d => d.name),
    ...top10User2.map(d => d.name)
  ]));
  
  // Sort artists by total count
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
  
  // Add X axis with dark text
  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .attr('class', 'axis')
    .call(d3.axisBottom(xScale));
  
  // Make all X axis text dark
  xAxis.selectAll('text')
    .style('fill', '#ffffff')
    .style('font-size', '12px');
  
  // Make X axis lines dark
  xAxis.selectAll('path, line')
    .style('stroke', '#666666')
    .style('stroke-opacity', 0.8);
  
  // Add Y axis with dark text
  const yAxis = svg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(yScale));
  
  // Make all Y axis text dark
  yAxis.selectAll('text')
    .style('fill', '#ffffff')
    .style('font-size', '12px');
  
  // Make Y axis lines dark
  yAxis.selectAll('path, line')
    .style('stroke', '#666666')
    .style('stroke-opacity', 0.8);
  
  // Add X axis label with dark text
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .style('text-anchor', 'middle')
    .style('fill', '#ffffff')
    .style('font-weight', 'bold')
    .style('font-size', '14px')
    .text('Frequency');
  
  // Draw bars for User 1
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
    .attr('rx', 3)
    .attr('ry', 3)
    .style('fill', 'url(#bar-gradient-user1)');
  
  // Draw bars for User 2
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
    .attr('rx', 3)
    .attr('ry', 3)
    .style('fill', 'url(#bar-gradient-user2)');
  
  // Add legend with dark text
  const legend = svg.append('g')
    .attr('transform', `translate(${width - 100}, -20)`);
  
  legend.append('rect')
    .attr('width', 18)
    .attr('height', 18)
    .attr('class', 'bar-user1')
    .style('fill', 'url(#bar-gradient-user1)');
  
  legend.append('text')
    .attr('x', 24)
    .attr('y', 14)
    .style('fill', '#ffffff')
    .style('font-size', '12px')
    .text('User 1');
  
  legend.append('rect')
    .attr('width', 18)
    .attr('height', 18)
    .attr('class', 'bar-user2')
    .attr('y', 24)
    .style('fill', 'url(#bar-gradient-user2)');
  
  legend.append('text')
    .attr('x', 24)
    .attr('y', 38)
    .style('fill', '#ffffff')
    .style('font-size', '12px')
    .text('User 2');
  
  // Create tooltip div
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
  
  // Add hover effects for User 1 bars
  svg.selectAll('.bar-user1')
    .on('mouseover', function(event, d) {
      const artist = top10User1.find(a => a.name === d);
      if (artist) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        tooltip.html(`<div class="tooltip-header">User 1</div><div class="tooltip-content">${artist.name}<br>${artist.count} tracks</div>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      }
    })
    .on('mouseout', function() {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
  
  // Add hover effects for User 2 bars
  svg.selectAll('.bar-user2')
    .on('mouseover', function(event, d) {
      const artist = top10User2.find(a => a.name === d);
      if (artist) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 1);
        tooltip.html(`<div class="tooltip-header">User 2</div><div class="tooltip-content">${artist.name}<br>${artist.count} tracks</div>`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      }
    })
    .on('mouseout', function() {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
}

// Helper function to get top items with counts
function getTopItems(data, limit) {
  // Extract artist names and counts
  const items = data.map(item => {
    // Handle different data formats
    if (item.artist && item.count) {
      // Artist frequency format
      return {
        name: item.artist,
        count: parseInt(item.count || "0", 10)
      };
    } else if (item.Track && item.Artists) {
      // Track format - not used for bar chart currently
      return {
        name: item.Artists,
        count: 1
      };
    } else {
      // Unknown format
      console.warn('Unknown data format:', item);
      return null;
    }
  }).filter(item => item && item.name && !isNaN(item.count));
  
  // Sort by count
  items.sort((a, b) => b.count - a.count);
  
  // Return top N items
  return items.slice(0, limit);
}
