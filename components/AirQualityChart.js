// AirQualityChart.jsx

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const AirQualityChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extracting values and coordinates from the data
    const values = data.results.map((result) => result.value);
    const coordinates = data.results.map((result) => result.coordinates);

    // Create scale for circle size
    const sizeScale = d3
      .scaleLinear()
      .domain([0, d3.max(values)])
      .range([5, 30]);

    // Create scale for circle color
    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(values)]);

    // Create scales for x and y axes
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(coordinates, (d) => d.longitude),
        d3.max(coordinates, (d) => d.longitude),
      ])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(coordinates, (d) => d.latitude),
        d3.max(coordinates, (d) => d.latitude),
      ])
      .range([height, 0]);

    // Draw circles
    svg
      .selectAll("circle")
      .data(coordinates)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.longitude))
      .attr("cy", (d) => yScale(d.latitude))
      .attr("r", (d, i) => sizeScale(values[i]))
      .attr("fill", (d, i) => colorScale(values[i]))
      .attr("opacity", 0.7)
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .on("mouseover", (event, d) => {
        // Show tooltip on mouseover
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(
            `<strong>Location:</strong> ${data.results[i].location}<br>
                 <strong>Parameter:</strong> ${data.results[i].parameter}<br>
                 <strong>Value:</strong> ${data.results[i].value} ${data.results[i].unit}`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 15 + "px");
      })
      .on("mouseout", () => {
        // Hide tooltip on mouseout
        tooltip.transition().duration(500).style("opacity", 0);
      });

    // Draw x-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale))
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Longitude");

    // Draw y-axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 10)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text("Latitude");

    // Draw legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 120}, ${height - 20})`);

    legend
      .append("rect")
      .attr("width", 100)
      .attr("height", 15)
      .attr("fill", "url(#legendGradient)");

    const legendScale = d3
      .scaleLinear()
      .domain([0, d3.max(values)])
      .range([0, 100]);

    legend
      .call(
        d3
          .axisBottom(legendScale)
          .ticks(5)
          .tickSize(13)
          .tickFormat(d3.format(".1f"))
      )
      .select(".domain")
      .remove();
  }, [data]);

  const tooltip = d3
    .select(chartRef.current)
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  return <svg ref={chartRef}></svg>;
};

export default AirQualityChart;
