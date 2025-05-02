// js/charts.js

/**
 * Draw a grouped bar-chart of two genre→count maps.
 */
export function drawGenreChart(genres1, genres2, selector) {
  const data = Array.from(new Set([...Object.keys(genres1), ...Object.keys(genres2)]))
    .map(g => ({ genre: g, user1: genres1[g]||0, user2: genres2[g]||0 }));

  const margin = { top:20, right:20, bottom:60, left:50 };
  const width  = 700 - margin.left - margin.right;
  const height = 400 - margin.top  - margin.bottom;

  const x0 = d3.scaleBand()
    .domain(data.map(d => d.genre))
    .rangeRound([0, width])
    .paddingInner(0.1);

  const x1 = d3.scaleBand()
    .domain(['user1','user2'])
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.user1,d.user2))]).nice()
    .range([height, 0]);

  const svg = d3.select(selector).html('').append('svg')
      .attr('width',  width  + margin.left + margin.right)
      .attr('height', height + margin.top  + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  svg.append('g')
      .selectAll('g')
      .data(data)
      .join('g')
        .attr('transform', d => `translate(${x0(d.genre)},0)`)
      .selectAll('rect')
      .data(d => ['user1','user2'].map(k => ({ key:k, value:d[k] })))
      .join('rect')
        .attr('class', d => `bar ${d.key}`)
        .attr('x',      d => x1(d.key))
        .attr('y',      d => y(d.value))
        .attr('width',  x1.bandwidth())
        .attr('height', d => height - y(d.value));

  svg.append('g')
      .attr('class','axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0));

  svg.append('g')
      .call(d3.axisLeft(y));
}


/**
 * Draw a grouped bar-chart of averaged audio-feature values.
 */
export function drawAudioFeatureChart(f1, f2, selector) {
  const metrics = [
    'danceability','energy','valence',
    'acousticness','instrumentalness',
    'speechiness','liveness','tempo'
  ];
  const data = metrics.map(m => ({
    feature: m,
    user1: d3.mean(f1, d => d[m]),
    user2: d3.mean(f2, d => d[m])
  }));

  const margin = { top:20, right:20, bottom:60, left:50 };
  const width  = 700 - margin.left - margin.right;
  const height = 400 - margin.top  - margin.bottom;

  const x0 = d3.scaleBand()
    .domain(data.map(d => d.feature))
    .range([0, width])
    .paddingInner(0.1);

  const x1 = d3.scaleBand()
    .domain(['user1','user2'])
    .range([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.user1,d.user2))]).nice()
    .range([height, 0]);

  const svg = d3.select(selector).html('').append('svg')
      .attr('width',  width  + margin.left + margin.right)
      .attr('height', height + margin.top  + margin.bottom)
    .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

  svg.append('g')
      .selectAll('g')
      .data(data)
      .join('g')
        .attr('transform', d => `translate(${x0(d.feature)},0)`)
      .selectAll('rect')
      .data(d => ['user1','user2'].map(k => ({ key:k, value:d[k] })))
      .join('rect')
        .attr('class', d => `bar ${d.key}`)
        .attr('x',      d => x1(d.key))
        .attr('y',      d => y(d.value))
        .attr('width',  x1.bandwidth())
        .attr('height', d => height - y(d.value));

  svg.append('g')
      .attr('class','axis--x')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x0));

  svg.append('g')
      .call(d3.axisLeft(y));
}
