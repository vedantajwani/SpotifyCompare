// js/venn.js
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export function drawVenn(onlyA, onlyB, both, dataType = 'artists') {
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
  
  // Create a subtle pattern for the background
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
  
  // Create circles with metallic gradients
  const circleA = svg.append('circle')
    .attr('cx', centers[0].x)
    .attr('cy', centers[0].y)
    .attr('r', r)
    .style('fill', 'url(#metallic-green)')
    .style('fill-opacity', 0.7)
    .style('stroke', '#1DB954')
    .style('stroke-width', 2)
    .style('filter', 'drop-shadow(0px 0px 10px rgba(29, 185, 84, 0.3))');
  
  const circleB = svg.append('circle')
    .attr('cx', centers[1].x)
    .attr('cy', centers[1].y)
    .attr('r', r)
    .style('fill', 'url(#metallic-black)')
    .style('fill-opacity', 0.7)
    .style('stroke', '#444444')
    .style('stroke-width', 2)
    .style('filter', 'drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.5))');
  
  // Add labels with premium styling
  const labelStyle = (selection) => {
    selection
      .style('font-family', 'Montserrat, sans-serif')
      .style('font-weight', '600')
      .style('font-size', '14px')
      .style('fill', '#ffffff')
      .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
  };
  
  // User 1 label
  svg.append('text')
    .attr('x', centers[0].x - 80)
    .attr('y', centers[0].y - 20)
    .attr('text-anchor', 'middle')
    .text(`User 1 Only`)
    .call(labelStyle);
  
  svg.append('text')
    .attr('x', centers[0].x - 80)
    .attr('y', centers[0].y + 10)
    .attr('text-anchor', 'middle')
    .text(`(${onlyA.length})`)
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', '700')
    .style('font-size', '18px')
    .style('fill', '#1DB954')
    .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
  
  // User 2 label
  svg.append('text')
    .attr('x', centers[1].x + 80)
    .attr('y', centers[1].y - 20)
    .attr('text-anchor', 'middle')
    .text(`User 2 Only`)
    .call(labelStyle);
  
  svg.append('text')
    .attr('x', centers[1].x + 80)
    .attr('y', centers[1].y + 10)
    .attr('text-anchor', 'middle')
    .text(`(${onlyB.length})`)
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', '700')
    .style('font-size', '18px')
    .style('fill', '#ffffff')
    .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
  
  // Shared label
  svg.append('text')
    .attr('x', (centers[0].x + centers[1].x) / 2)
    .attr('y', centers[0].y - 20)
    .attr('text-anchor', 'middle')
    .text(`Shared`)
    .call(labelStyle);
  
  svg.append('text')
    .attr('x', (centers[0].x + centers[1].x) / 2)
    .attr('y', centers[0].y + 10)
    .attr('text-anchor', 'middle')
    .text(`(${both.length})`)
    .style('font-family', 'Montserrat, sans-serif')
    .style('font-weight', '700')
    .style('font-size', '18px')
    .style('fill', '#ffffff')
    .style('text-shadow', '0 1px 3px rgba(0, 0, 0, 0.5)');
  
  // Add tooltips for the intersection
  if (both.length > 0) {
    // Remove any existing tooltips
    d3.selectAll('.tooltip').remove();
    
    const tooltipDiv = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);
    
    // Create a transparent overlay for the intersection area
    const intersectionX = (centers[0].x + centers[1].x) / 2;
    const intersectionY = centers[0].y;
    
    svg.append('circle')
      .attr('cx', intersectionX)
      .attr('cy', intersectionY)
      .attr('r', 60)
      .style('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mouseover', function(event) {
        tooltipDiv.transition()
          .duration(200)
          .style('opacity', 1);
        
        // Create the tooltip content
        let tooltipContent = `<strong>Shared ${dataType}:</strong><br>`;
        both.slice(0, 10).forEach(item => {
          tooltipContent += `${item}<br>`;
        });
        
        if (both.length > 10) {
          tooltipContent += `<em>...and ${both.length - 10} more</em>`;
        }
        
        tooltipDiv.html(tooltipContent)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltipDiv.transition()
          .duration(500)
          .style('opacity', 0);
      });
    
    // Add a hint to hover
    svg.append('text')
      .attr('x', intersectionX)
      .attr('y', intersectionY + 40)
      .attr('text-anchor', 'middle')
      .text('Hover to see shared items')
      .style('font-family', 'Montserrat, sans-serif')
      .style('font-size', '11px')
      .style('fill', 'rgba(255, 255, 255, 0.6)')
      .style('font-style', 'italic');
  }
}
