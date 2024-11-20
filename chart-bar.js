const heightInput = document.getElementById('height-input');
const widthInput = document.getElementById('width-input'); 
const marginInput = document.getElementById('margin-input');

let margin = {top: 20, right: 30, bottom: 30, left: 40};
let width = 1000 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;

heightInput.addEventListener('change', (e) => {
  if (!e.target.value) {
    height = 600 - margin.top - margin.bottom;
    d3.select("#chart-bar svg").remove();
    createBarChart("#chart-bar", barData);
  } else {
    const newHeight = parseInt(e.target.value);
    if (!isNaN(newHeight)) {
      height = newHeight - margin.top - margin.bottom;
      d3.select("#chart-bar svg").remove();
      createBarChart("#chart-bar", barData);
    }
  }
});

widthInput.addEventListener('change', (e) => {
  if (!e.target.value) {
    width = 1000 - margin.left - margin.right;
    d3.select("#chart-bar svg").remove();
    createBarChart("#chart-bar", barData);
  } else {
    const newWidth = parseInt(e.target.value);
    if (!isNaN(newWidth)) {
      width = newWidth - margin.left - margin.right;
      d3.select("#chart-bar svg").remove();
      createBarChart("#chart-bar", barData);
    }
  }
});

marginInput.addEventListener('change', (e) => {
  if (!e.target.value) {
    margin = {top: 20, right: 30, bottom: 30, left: 40};
    width = 1000 - margin.left - margin.right;
    height = 600 - margin.top - margin.bottom;
    d3.select("#chart-bar svg").remove();
    createBarChart("#chart-bar", barData);
  } else {
    const newMargin = parseInt(e.target.value);
    if (!isNaN(newMargin)) {
      margin = {top: newMargin, right: newMargin, bottom: newMargin, left: newMargin};
      width = parseInt(widthInput.value || 1000) - margin.left - margin.right;
      height = parseInt(heightInput.value || 600) - margin.top - margin.bottom;
      d3.select("#chart-bar svg").remove();
      createBarChart("#chart-bar", barData);
    }
  }
});

function createBarChart(selector, data) {
    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.category))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category))
        .attr("y", d => y(d.value))
        .attr("height", d => height - y(d.value))
        .attr("width", x.bandwidth());

    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Valor");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    svg.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text("Categoria");
}

const barData = [
    {category: "A", value: 30},
    {category: "B", value: 80},
    {category: "C", value: 45},
    {category: "D", value: 60},
    {category: "E", value: 20},
    {category: "F", value: 90}
];

createBarChart("#chart-bar", barData);
