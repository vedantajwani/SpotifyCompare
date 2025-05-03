// js/compare.js
import { drawVenn } from './venn.js';
import { drawBarCharts } from './barChart.js';
import { compareLists } from './compareArtists.js';

document.addEventListener('DOMContentLoaded', () => {
  // Load the Venn diagram with artists data by default
  loadVennData('artists');
  
  // Set up event listeners for the bar chart checkboxes
  const barChartCheckboxes = document.querySelectorAll('input[data-chart-type]');
  
  barChartCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      // Uncheck all other checkboxes
      barChartCheckboxes.forEach(cb => {
        if (cb !== checkbox) {
          cb.checked = false;
        }
      });
      
      // Update bar chart visualization based on selected type
      if (checkbox.checked) {
        const chartType = checkbox.getAttribute('data-chart-type');
        loadBarChartData(chartType);
      }
    });
  });
  
  // Initial load with artists data for bar chart
  loadBarChartData('artists');
});

async function loadVennData(dataType) {
  try {
    let data1, data2;
    
    if (dataType === 'artists') {
      data1 = await fetch('./data/top50artists1.json').then(res => res.json());
      data2 = await fetch('./data/top50artists2.json').then(res => res.json());
    } else if (dataType === 'tracks') {
      data1 = await fetch('./data/top50tracks1.json').then(res => res.json());
      data2 = await fetch('./data/top50tracks2.json').then(res => res.json());
    }
    
    // Draw Venn diagram
    const { onlyA, onlyB, both } = compareLists(data1, data2);
    drawVenn(onlyA, onlyB, both, dataType);
  } catch (error) {
    console.error('Error loading Venn data:', error);
  }
}

async function loadBarChartData(chartType) {
  try {
    let data1, data2;
    
    if (chartType === 'artists') {
      data1 = await fetch('./data/top50artists1.json').then(res => res.json());
      data2 = await fetch('./data/top50artists2.json').then(res => res.json());
    } else if (chartType === 'tracks') {
      data1 = await fetch('./data/top50tracks1.json').then(res => res.json());
      data2 = await fetch('./data/top50tracks2.json').then(res => res.json());
    }
    
    // Draw bar charts
    drawBarCharts(data1, data2);
  } catch (error) {
    console.error('Error loading bar chart data:', error);
  }
}
