const heightInput = document.getElementById('height-input');
const widthInput = document.getElementById('width-input'); 
const marginInput = document.getElementById('margin-input');

let margin = {top: 20, right: 30, bottom: 30, left: 40};
let width = 1000 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;

heightInput.addEventListener('change', (e) => {
  if (!e.target.value) {
    height = 600 - margin.top - margin.bottom;
    d3.select("#chart-heatmap svg").remove();
    createHeatmap("#chart-heatmap", heatmapData);
  } else {
    const newHeight = parseInt(e.target.value);
    if (!isNaN(newHeight)) {
      height = newHeight - margin.top - margin.bottom;
      d3.select("#chart-heatmap svg").remove();
      createHeatmap("#chart-heatmap", heatmapData);
    }
  }
});

widthInput.addEventListener('change', (e) => {
  if (!e.target.value) {
    width = 1000 - margin.left - margin.right;
    d3.select("#chart-heatmap svg").remove();
    createHeatmap("#chart-heatmap", heatmapData);
  } else {
    const newWidth = parseInt(e.target.value);
    if (!isNaN(newWidth)) {
      width = newWidth - margin.left - margin.right;
      d3.select("#chart-heatmap svg").remove();
      createHeatmap("#chart-heatmap", heatmapData);
    }
  }
});

marginInput.addEventListener('change', (e) => {
  if (!e.target.value) {
    margin = {top: 20, right: 30, bottom: 30, left: 40};
    width = 1000 - margin.left - margin.right;
    height = 600 - margin.top - margin.bottom;
    d3.select("#chart-heatmap svg").remove();
    createHeatmap("#chart-heatmap", heatmapData);
  } else {
    const newMargin = parseInt(e.target.value);
    if (!isNaN(newMargin)) {
      margin = {top: newMargin, right: newMargin, bottom: newMargin, left: newMargin};
      width = parseInt(widthInput.value || 1000) - margin.left - margin.right;
      height = parseInt(heightInput.value || 600) - margin.top - margin.bottom;
      d3.select("#chart-heatmap svg").remove();
      createHeatmap("#chart-heatmap", heatmapData);
    }
  }
});

function createHeatmap(selector, data) {
    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const categories = [...new Set(data.map(d => d.Category))];
    const subcategories = [...new Set(data.map(d => d['Sub-Category']))];

    const x = d3.scaleBand()
        .domain(subcategories)
        .range([0, width])
        .padding(0.05);

    const y = d3.scaleBand()
        .domain(categories)
        .range([0, height])
        .padding(0.05);

    const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0, d3.max(data, d => d.Sales)]);

    svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d['Sub-Category']))
        .attr("y", d => y(d.Category))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .attr("fill", d => colorScale(d.Sales))
        .on("mouseover", function (event, d) {
            d3.select(this).attr("stroke", "orange").attr("stroke-width", 2);
        })
        .on("mouseout", function (event, d) {
            d3.select(this).attr("stroke", null);
        });

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .attr("transform", "rotate(45)")
        .style("text-anchor", "start")
        .style("font-size", "10px");

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0))
        .selectAll("text")
        .style("font-size", "10px");

    svg.selectAll(".domain").remove();
}

// Dados para matriz de calor
const heatmapData = [{'Category': 'Furniture', 'Sub-Category': 'Bookcases', 'Sales': 1466572.2418}, {'Category': 'Furniture', 'Sub-Category': 'Chairs', 'Sales': 1501681.7642}, {'Category': 'Furniture', 'Sub-Category': 'Furnishings', 'Sales': 385578.2559}, {'Category': 'Furniture', 'Sub-Category': 'Tables', 'Sales': 757041.9244}, {'Category': 'Office Supplies', 'Sub-Category': 'Appliances', 'Sales': 1011064.305}, {'Category': 'Office Supplies', 'Sub-Category': 'Art', 'Sales': 372091.9659}, {'Category': 'Office Supplies', 'Sub-Category': 'Binders', 'Sales': 461911.5057}, {'Category': 'Office Supplies', 'Sub-Category': 'Envelopes', 'Sales': 170904.3016}, {'Category': 'Office Supplies', 'Sub-Category': 'Fasteners', 'Sales': 83242.3159}, {'Category': 'Office Supplies', 'Sub-Category': 'Labels', 'Sales': 73404.03}, {'Category': 'Office Supplies', 'Sub-Category': 'Paper', 'Sales': 244291.7194}, {'Category': 'Office Supplies', 'Sub-Category': 'Storage', 'Sales': 1127085.8614}, {'Category': 'Office Supplies', 'Sub-Category': 'Supplies', 'Sales': 243074.2206}, {'Category': 'Technology', 'Sub-Category': 'Accessories', 'Sales': 749237.0185}, {'Category': 'Technology', 'Sub-Category': 'Copiers', 'Sales': 1509436.27328}, {'Category': 'Technology', 'Sub-Category': 'Machines', 'Sales': 779060.0671}, {'Category': 'Technology', 'Sub-Category': 'Phones', 'Sales': 1706824.1392}];
createHeatmap("#chart-heatmap", heatmapData);
