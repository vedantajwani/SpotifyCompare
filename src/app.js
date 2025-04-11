import { fetchUserTopTracks } from './data.js';

async function draw() {
  // TODO: obtain OAuth token, then:
  const data = await fetchUserTopTracks('YOUR_TOKEN_HERE');
  // Simple bar chart example:
  const svg = d3.select('#viz')
    .append('svg')
    .attr('width', 800)
    .attr('height', 600);

  const tracks = data.items.slice(0, 10);
  const x = d3.scaleBand()
    .domain(tracks.map(d => d.name))
    .range([0, 800])
    .padding(0.1);
  const y = d3.scaleLinear()
    .domain([0, d3.max(tracks, d => d.popularity)])
    .range([600, 0]);

  svg.selectAll('rect')
    .data(tracks)
    .join('rect')
      .attr('x', d => x(d.name))
      .attr('y', d => y(d.popularity))
      .attr('width', x.bandwidth())
      .attr('height', d => 600 - y(d.popularity));
}

draw();
