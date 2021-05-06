import React, { useEffect } from "react";
import * as d3 from "d3";

function LineChart(props) {
  const { data, width, height } = props;

  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    // Add logic to draw the chart here
    console.log(data[0]);

    const min = Math.min.apply(
        null,
        data.map((item) => item[4])
      ),
      max = Math.max.apply(
        null,
        data.map((item) => item[4])
      );

    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");

    const xScale = d3
      .scaleLinear()
      .domain([data[0][0], data[data.length - 1][0]])
      .range([0, width]);

    const yScale = d3.scaleLinear().range([height, 0]).domain([min, max]);

    const line = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[4]))
      .curve(d3.curveMonotoneX);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(-height).tickFormat(""));
    svg
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(""));
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom().scale(xScale).tickSize(15));
    svg.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f00")
      .attr("stroke-width", 1)
      .attr("class", "line")
      .attr("d", line);
  }
  return <div id="container" />;
}

export default LineChart;
