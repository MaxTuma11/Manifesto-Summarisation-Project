import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    //set up chart dimensions
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 70, left: 40 }; 

    //clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    //create svg container
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
      .style('text-anchor', 'end')
      .style('font-size', '12px')
      .style('fill', '#333'); 

    //add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px') 
      .style('fill', '#333'); 

    //add bars
    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d[0]))
      .attr('y', d => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => y(0) - y(d[1]))
      .attr('fill', '#08003ab3')
      .attr('rx', 4) 
      .attr('ry', 4)
      .on('mouseover', function (event, d) {
        //highlight bar on hover
        d3.select(this)
          .attr('fill', '#08003a'); //darker shade for hover
      })
      .on('mouseout', function (event, d) {
        //revert to original color
        d3.select(this)
          .attr('fill', '#08003ab3');
      });

    //add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Most Common Words In The Manifesto');
  }, [data]);

  return <svg ref={chartRef}></svg>;
};

export default BarChart;