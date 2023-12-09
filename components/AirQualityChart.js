// AirQualityChart.jsx

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const AirQualityChart = ({ airQualityData, width, height }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!airQualityData || !Array.isArray(airQualityData)) {
      return;
    }

    console.log("data from chart", airQualityData[0].value);
    // using geographical information (lattitude and longitude) from json data
    const geojson = {
      type: "FeatureCollection",
      features: airQualityData.map((d) => ({
        type: "Feature",
        properties: { location: d.country, value: d.value },
        geometry: {
          type: "Point",
          coordinates: [d.coordinates.longitude, d.coordinates.latitude],
        },
      })),
    };

    //GeoJSON object
    //creating a basic map
    const projection = d3.geoEqualEarth();
    const path = d3.geoPath(projection);

    // Append a SVG element to your HTML where the map will be drawn
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Append paths for each region on the map
    svg
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", "lightgray")
      .style("stroke", "white");

    //define colour scale based on air quality values
    const colorScale = d3
      .scaleSequential(d3.interpolateViridis)
      .domain([0, d3.max(airQualityData, (d) => d.value)]);
    //color-coding based on air quality value
    svg
      .selectAll("circle")
      .data(airQualityData)
      .enter()
      .append("circle")
      .attr(
        "cx",
        (d) => projection([d.coordinates.longitude, d.coordinates.latitude])[0]
      )
      .attr(
        "cy",
        (d) => projection([d.coordinates.longitude, d.coordinates.latitude])[1]
      )
      .attr("r", 5)
      .style("fill", (d) => colorScale(d.value));
    // Draw legend
    const legend = svg.append("g").attr("transform", "translate(20,20)");

    legend
      .selectAll("rect")
      .data(colorScale.range())
      .enter()
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("x", 0)
      .attr("y", (d, i) => i * 30)
      .style("fill", (d) => d);

    legend
      .selectAll("text")
      .data(["Low", "Medium", "High"])
      .enter()
      .append("text")
      .attr("x", 30)
      .attr("y", (d, i) => i * 30 + 15)
      .text((d) => d);

    if (typeof document !== "undefined") {
      const tooltip = d3.select("body").append("div").attr("class", "tooltip");

      svg
        .selectAll("circle")
        .on("mouseover", (event, d) => {
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(`${d.country}<br>Air Quality: ${d.value}`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(500).style("opacity", 0);
        });
    }
  }, [airQualityData, width, height]);

  return <svg ref={chartRef}></svg>;
};

export default AirQualityChart;
