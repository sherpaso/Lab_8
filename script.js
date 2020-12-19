// Create the margin convention
const margin = { top: 20, right: +6, bottom: 20, left: 20 };
const width = 1000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Create a SVG
const svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr(
    "transform",
    "translate(" + (margin.left + 20) + "," + margin.top + ")"
  );

d3.csv("driving.csv", d3.autoType).then((data) => {
  // Create x- and y-scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.miles))
    .nice()
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.gas))
    .nice()
    .range([height, 0]);

  // Generate axes
  const xAxis = d3
    .axisBottom()
    .scale(xScale)
    .ticks(10, "s")
    .tickFormat(function (d) {
      {
        return d3.format(",")(d);
      }
    });

  const yAxis = d3
    .axisLeft()
    .scale(yScale)
    .ticks(10, "s")
    .tickFormat(function (d) {
      return "$" + d3.format(".2f")(d);
    });

  const xAxisG = svg
    .append("g")
    .attr("class", "axis x-axis")
    .call(xAxis)
    .attr("transform", `translate(${0}, ${margin.top + height - 18})`);
  xAxisG.select(".domain").remove();

  const yAxisG = svg
    .append("g")
    .attr("class", "axis y-axis")
    .attr("transform", `translate(${margin.left - 16}, ${margin.top - 19})`)
    .call(yAxis);
  yAxisG.select(".domain").remove();

  xAxisG
    .selectAll(".tick line")
    .clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.4); // make it transparent

  yAxisG
    .selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.4); // make it transparent

  //Add circles for data points
  let marker = svg
    .append("g")
    .selectAll("circles")
    .data(data)
    .enter()
    .append("g");

  marker
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.miles);
    })
    .attr("cy", function (d) {
      return yScale(d.gas);
    })
    .attr("r", 5)
    .style("fill", "green")
    .attr("stroke", "black");

  //Generate labels for data points
  marker
    .append("text")
    .attr("x", function (d) {
      return xScale(d.miles);
    })
    .attr("y", function (d) {
      return yScale(d.gas);
    })
    .text(function (d) {
      return d.year;
    })
    .attr("font-size", "12px");
  marker.selectAll("text").each(position).call(halo); // or .each(d=> position(d))

  svg
    .append("text")
    .attr("x", 24)
    .attr("y", 5.5)
    .text("Cost per Gallon")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .call(halo);

  svg
    .append("text")
    .attr("x", width - 190)
    .attr("y", height - 20)
    .text("Miles per Person per Year")
    .attr("font-size", 14)
    .attr("font-weight", "bold")
    .call(halo);

  // Define a line path generator
  const line = d3
    .line()
    .x(function (d) {
      return xScale(d.miles);
    })
    .y(function (d) {
      return yScale(d.gas);
    });

  svg
    .append("path")
    .datum(data)
    .attr("d", line)
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("fill", "none");
});

function position(d) {
  const t = d3.select(this);
  switch (d.side) {
    case "top":
      t.attr("text-anchor", "middle").attr("dy", "-0.7em");
      break;
    case "right":
      t.attr("dx", "0.5em").attr("dy", "0.32em").attr("text-anchor", "start");
      break;
    case "bottom":
      t.attr("text-anchor", "middle").attr("dy", "1.4em");
      break;
    case "left":
      t.attr("dx", "-0.5em").attr("dy", "0.32em").attr("text-anchor", "end");
      break;
  }
}

function halo(text) {
  text
    .select(function () {
      return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round");
}
