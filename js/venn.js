// js/venn.js

// Function to draw Venn diagram
function drawVenn(onlyA, onlyB, both, dataType = 'tracks') {
  console.log('Drawing Venn diagram with:', { 
    onlyA: onlyA.length, 
    onlyB: onlyB.length, 
    both: both.length, 
    dataType 
  });
  
  // Clear previous visualization
  d3.select('#venn-container').selectAll('*').remove();
  
  const width = 800;
  const height = 500;
  const r = 140; // Circle radius
  const centers = [{ x: width/2 - 90, y: height/2 }, { x: width/2 + 90, y: height/2 }];
  
  // Premium Spotify colors
  const colorA = '#1DB954'; // Spotify green
  const colorB = '#191414'; // Spotify black
  
  // Create SVG
  const svg = d3.select('#venn-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  
  // Add metallic gradient definitions
  const defs = svg.append('defs');
  
  // Metallic gradient for circle A
  const gradientA = defs.append('linearGradient')
    .attr('id', 'metallic-green')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');
  
  gradientA.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#2EE566')
    .attr('stop-opacity', 1);
  
  gradientA.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', '#1DB954')
    .attr('stop-opacity', 1);
  
  gradientA.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#0E5E2A')
    .attr('stop-opacity', 1);
  
  // Metallic gradient for circle B
  const gradientB = defs.append('linearGradient')
    .attr('id', 'metallic-black')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '100%')
    .attr('y2', '100%');
  
  gradientB.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#444444')
    .attr('stop-opacity', 1);
  
  gradientB.append('stop')
    .attr('offset', '50%')
    .attr('stop-color', '#191414')
    .attr('stop-opacity', 1);
  
  gradientB.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#000000')
    .attr('stop-opacity', 1);
  
  // Add subtle pattern for texture
  const pattern = defs.append('pattern')
    .attr('id', 'subtle-pattern')
    .attr('width', 10)
    .attr('height', 10)
    .attr('patternUnits', 'userSpaceOnUse')
    .attr('patternTransform', 'rotate(45)');
  
  pattern.append('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'none');
  
  pattern.append('path')
    .attr('d', 'M0,0 L2,0 L2,2 L0,2 Z')
    .attr('fill', 'rgba(255, 255, 255, 0.03)');
  
  // Draw circles
  const circleA = svg.append('circle')
    .attr('cx', centers[0].x)
    .attr('cy', centers[0].y)
    .attr('r', r)
    .attr('class', 'circle-user1')
    .style('fill', 'url(#metallic-green)')
    .style('fill-opacity', 0.7)
    .style('stroke', colorA)
    .style('stroke-width', 2)
    .style('filter', 'drop-shadow(0px 0px 10px rgba(29, 185, 84, 0.3))');
  
  const circleB = svg.append('circle')
    .attr('cx', centers[1].x)
    .attr('cy', centers[1].y)
    .attr('r', r)
    .attr('class', 'circle-user2')
    .style('fill', 'url(#metallic-black)')
    .style('fill-opacity', 0.7)
    .style('stroke', '#444444')
    .style('stroke-width', 2)
    .style('filter', 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5))');
  
  // Helper function to create label text
  const createLabelText = (x, y, text) => {
    return svg.append('text')
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Montserrat, sans-serif')
      .style('font-weight', '600')
      .style('font-size', '14px')
      .style('fill', '#ffffff')
      .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.2)');
  };
  
  // User 1 label
  createLabelText(centers[0].x - 80, centers[0].y - 20, 'User 1 Only');
  
  svg.append('text')
    .attr('x', centers[0].x - 80)
    .attr('y', centers[0].y + 10)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', '700')
    .style('font-size', '18px')
    .style('fill', colorA)
    .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.2)')
    .text(`(${onlyA.length})`);
  
  // User 2 label
  createLabelText(centers[1].x + 80, centers[1].y - 20, 'User 2 Only');
  
  svg.append('text')
    .attr('x', centers[1].x + 80)
    .attr('y', centers[1].y + 10)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', '700')
    .style('font-size', '18px')
    .style('fill', '#ffffff')
    .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.2)')
    .text(`(${onlyB.length})`);
  
  // Shared label
  createLabelText(width/2, centers[0].y - 20, 'Both Users');
  
  svg.append('text')
    .attr('x', width/2)
    .attr('y', centers[0].y + 10)
    .attr('text-anchor', 'middle')
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', '700')
    .style('font-size', '18px')
    .style('fill', '#ffffff')
    .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.2)')
    .text(`(${both.length})`);
  
  // Add interaction areas
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);
  
  // Helper function to show tooltip with track list
  const showTooltip = (event, tracks, title) => {
    if (tracks.length > 0) {
      tooltip.transition()
        .duration(200)
        .style('opacity', 1);
      
      // Create tooltip content
      let content = `<div class="tooltip-header">${title}</div><div class="tooltip-content">`;
      
      // Add up to 10 tracks to tooltip
      const displayTracks = tracks.slice(0, 10);
      displayTracks.forEach(track => {
        content += `<div class="tooltip-item">${track.Track} - ${track.Artists}</div>`;
      });
      
      if (tracks.length > 10) {
        content += `<div class="tooltip-item">...and ${tracks.length - 10} more</div>`;
      }
      
      content += '</div>';
      
      tooltip.html(content)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    }
  };
  
  // Add interaction area for User 1 only
  svg.append('circle')
    .attr('cx', centers[0].x - r/2)
    .attr('cy', centers[0].y)
    .attr('r', r/2)
    .attr('class', 'interaction-area')
    .style('cursor', 'pointer')
    .on('click', () => {
      updateTrackList(onlyA, 'User 1 Only');
    })
    .on('mouseover', function(event) {
      d3.select(this).style('fill', 'rgba(29, 185, 84, 0.1)');
      showTooltip(event, onlyA, 'User 1 Only');
    })
    .on('mouseout', function() {
      d3.select(this).style('fill', 'transparent');
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
  
  // Add interaction area for User 2 only
  svg.append('circle')
    .attr('cx', centers[1].x + r/2)
    .attr('cy', centers[1].y)
    .attr('r', r/2)
    .attr('class', 'interaction-area')
    .style('cursor', 'pointer')
    .on('click', () => {
      updateTrackList(onlyB, 'User 2 Only');
    })
    .on('mouseover', function(event) {
      d3.select(this).style('fill', 'rgba(25, 20, 20, 0.1)');
      showTooltip(event, onlyB, 'User 2 Only');
    })
    .on('mouseout', function() {
      d3.select(this).style('fill', 'transparent');
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
  
  // Add interaction area for shared
  svg.append('circle')
    .attr('cx', width/2)
    .attr('cy', centers[0].y)
    .attr('r', r/3)
    .attr('class', 'interaction-area')
    .style('cursor', 'pointer')
    .on('click', () => {
      updateTrackList(both, 'Shared Tracks');
    })
    .on('mouseover', function(event) {
      d3.select(this).style('fill', 'rgba(255, 255, 255, 0.1)');
      showTooltip(event, both, 'Shared Tracks');
    })
    .on('mouseout', function() {
      d3.select(this).style('fill', 'transparent');
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });
}

// Function to update the track list
function updateTrackList(tracks, title) {
  const trackListTitle = document.getElementById('track-list-title');
  const trackList = document.getElementById('track-list');
  
  // Update title
  trackListTitle.textContent = `${title} (${tracks.length} ${tracks.length === 1 ? 'track' : 'tracks'})`;
  
  // Clear existing list
  trackList.innerHTML = '';
  
  // Add tracks to list
  if (tracks.length > 0) {
    tracks.slice(0, 50).forEach(track => {
      const li = document.createElement('li');
      li.className = 'track-item';
      li.innerHTML = `<span class="track-name">${track.Track}</span><br><span class="track-artist">${track.Artists}</span>`;
      trackList.appendChild(li);
    });
    
    if (tracks.length > 50) {
      const li = document.createElement('li');
      li.className = 'track-item';
      li.textContent = `...and ${tracks.length - 50} more tracks`;
      trackList.appendChild(li);
    }
  } else {
    const li = document.createElement('li');
    li.className = 'track-item';
    li.textContent = 'No tracks found';
    trackList.appendChild(li);
  }
}
