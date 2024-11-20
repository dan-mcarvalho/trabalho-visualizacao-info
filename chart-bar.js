// D3.js is loaded via script tag in HTML
// No import needed since d3 is available globally

const margin = {top: 20, right: 30, bottom: 30, left: 40};
const width = 1000 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

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

    svg.append("g")
        .call(d3.axisBottom(x));
}

// Dados para gráfico de barras
const barData = [
    {category: "A", value: 30},
    {category: "B", value: 80},
    {category: "C", value: 45},
    {category: "D", value: 60},
    {category: "E", value: 20},
    {category: "F", value: 90}
];

// Criar gráfico de barras
createBarChart("#chart-bar", barData);