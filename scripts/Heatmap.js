class ChartHeatmap extends ChartConfig {
    data = [];
    addDataButton = document.getElementById("add-data-button");
    xInput = document.getElementById("x-input");
    yInput = document.getElementById("y-input");

  constructor(data) {
    super();
    this.data = data;
    super.loadConfigEvents(this);
    this.loadUpdateEvents();
  }
  create(selector, data, config = {}) {
    const {
        width = 1000,
        height = 600,
        margin = { top: 20, right: 30, bottom: 50, left: 50 },
      } = config;

      d3.select(selector).select("svg").remove();

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


  loadUpdateEvents() {
    this.addDataButton.addEventListener('click', () => {
        const xValue = parseFloat(this.xInput.value);
        const yValue = parseFloat(this.yInput.value);
        console.log(!isNaN(xValue) && !isNaN(yValue));
    
        if (!isNaN(xValue) && !isNaN(yValue)) {
            this.data.push({ Sales: xValue, Profit: yValue });
            d3.select("#chart")
                .selectAll("svg")
                .remove();
            this.create("#chart", this.data);
        } else {
            alert('Por favor, insira valores válidos para X e Y.');
        }
    });
  }


  remove() {
    d3.select("#chart")
      .selectAll("svg")
      .remove();

    // Remove all event listeners by cloning and replacing elements
    const newXInput = this.xInput.cloneNode(true);
    this.xInput.parentNode.replaceChild(newXInput, this.xInput);
    this.xInput = newXInput;

    const newYInput = this.yInput.cloneNode(true);
    this.yInput.parentNode.replaceChild(newYInput, this.yInput);
    this.yInput = newYInput;

    const newAddDataButton = this.addDataButton.cloneNode(true);
    this.addDataButton.parentNode.replaceChild(newAddDataButton, this.addDataButton);
    this.addDataButton = newAddDataButton;
    super.remove()
  }
}
