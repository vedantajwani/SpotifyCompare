// js/venn.js
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export function drawVenn(onlyA, onlyB, both) {
  const width = 500, height = 300, r = 100;
  const centers = [{ x: 200, y: 150 }, { x: 300, y: 150 }];

  d3.select('#venn').selectAll('*').remove();
  const svg = d3.select('#venn')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('circle')
    .attr('cx', centers[0].x).attr('cy', centers[0].y).attr('r', r)
    .style('fill-opacity', 0.5);

  svg.append('circle')
    .attr('cx', centers[1].x).attr('cy', centers[1].y).attr('r', r)
    .style('fill-opacity', 0.5);

  svg.append('text')
    .attr('x', centers[0].x - 20).attr('y', centers[0].y)
    .text(`Only A: ${onlyA.length}`);

  svg.append('text')
    .attr('x', centers[1].x + 20).attr('y', centers[1].y)
    .text(`Only B: ${onlyB.length}`);

  svg.append('text')
    .attr('x', (centers[0].x + centers[1].x)/2 - 30)
    .attr('y', centers[0].y)
    .text(`Both: ${both.length}`);
}
