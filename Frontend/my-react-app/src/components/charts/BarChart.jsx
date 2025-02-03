import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
    const chartRef = useRef();
  
    useEffect(() => {
      if (!data || data.length === 0) return;
  
      //set up chart dimensions
      const width = 800;
      const height = 400;
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };
  
      //clear previous chart
      d3.select(chartRef.current).selectAll('*').remove();
  
      //create SVG container
      const svg = d3.select(chartRef.current)
        .attr('width', width)
        .attr('height', height);
  
      //create scales
      const x = d3.scaleBand()
        .domain(data.map(d => d[0])) // Words
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[1])]) // Frequencies
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      //add X axis
      svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
  
      //add Y axis
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));
  
      //add bars
      svg.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d[0]))
        .attr('y', d => y(d[1]))
        .attr('width', x.bandwidth())
        .attr('height', d => y(0) - y(d[1]))
        .attr('fill', 'steelblue');
    }, [data]);
  
    return <svg ref={chartRef}></svg>;
  };
  
  export default BarChart;