fetch(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json").

then(res => res.json()).
then(res => {
  const baseTemp = res.baseTemperature;
  const values = res.monthlyVariance;
  createChart(baseTemp, values);
});

function createChart(baseTemp, values) {
  const width = 1200,
  height = 600,
  padding = 60;

  const maxYear = d3.max(values, d => d.year);
  const minYear = d3.min(values, d => d.year);

  const xScale = d3.
  scaleLinear().
  domain([minYear, maxYear + 1]).
  range([padding, width - padding]);
  const yScale = d3.
  scaleTime().
  domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)]).
  range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  const tooltip = d3.select("#tooltip");

  const svg = d3.
  select("body").
  append("svg").
  style("width", width).
  style("height", height);

  svg.
  append("g").
  call(xAxis).
  attr("transform", "translate(0," + (height - padding) + ")").
  attr("id", "x-axis");

  svg.
  append("g").
  call(yAxis).
  attr("id", "y-axis").
  attr("transform", "translate(" + padding + ",0)");

  svg.
  selectAll("rect").
  data(values).
  enter().
  append("rect").
  attr("class", "cell").
  attr("fill", (d) =>
  d.variance <= -1 ?
  "SteelBlue" :
  d.variance <= 0 ?
  "LightSteelBlue" :
  d.variance < 1 ?
  "Orange" :
  "Crimson").

  attr("data-month", d => d.month - 1).
  attr("data-year", d => d.year).
  attr("data-temp", d => baseTemp + d.variance).
  attr("height", (height - 2 * padding) / 12).
  attr("y", d => yScale(new Date(0, d.month - 1, 0, 0, 0, 0, 0))).
  attr("width", (width - 2 * padding) / (maxYear - minYear)).
  attr("x", d => xScale(d.year)).
  on("mouseover", d => {
    tooltip.transition().style("visibility", "visible");
    tooltip.text("Variance:" + d.variance);
    tooltip.attr("data-year", d.year);
  }).
  on("mouseout", d => {
    tooltip.transition().style("visibility", "hidden");
  });

  const legend = d3.select("body").append("svg").attr("id", "legend");

  const legendData = [
  { color: "SteelBlue", state: "Less than or equal to -1" },
  { color: "LightSteelBlue", state: "Less than or equal to 0" },
  { color: "Orange", state: "Less than 1" },
  { color: "Crimson", state: "Greater than or equal to 1" }];


  legend.
  selectAll("rect").
  data(legendData).
  enter().
  append("rect").
  attr("x", 10).
  attr("y", (d, i) => 40 * i).
  attr("width", 40).
  attr("height", 40).
  attr("fill", d => d.color);

  legend.
  selectAll("text").
  data(legendData).
  enter().
  append("text").
  text(d => d.state).
  attr("x", 60).
  attr("y", (d, i) => 40 * i + 20);
}