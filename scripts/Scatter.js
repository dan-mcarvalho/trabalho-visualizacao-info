class ChartScatter extends ChartConfig {
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
      labelX = "Categoria",
      labelY = "Valor",
    } = config;

    d3.select(selector).select("svg").remove();

    const svg = d3
      .select(selector)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Sales)])
      .nice()
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Profit), d3.max(data, (d) => d.Profit)])
      .nice()
      .range([height, 0]);

    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.Sales))
      .attr("cy", (d) => y(d.Profit))
      .attr("r", 4)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .on("mouseover", function () {
        d3.select(this).attr("fill", "orange").attr("r", 6);
      })
      .on("mouseout", function () {
        d3.select(this).attr("fill", "steelblue").attr("r", 4);
      });

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .style("text-anchor", "middle")
      .text(labelY);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -margin.left + 11)
      .style("text-anchor", "middle")
      .text(labelX);
  }


  parseCSV(csvData, config = {}) {
    //todo
    console.log(csvData, config);
  }
  loadUpdateEvents() {
    this.addDataButton.addEventListener("click", () => {
      const xValue = parseFloat(this.xInput.value);
      const yValue = parseFloat(this.yInput.value);

      if (!isNaN(xValue) && !isNaN(yValue)) {
        this.data.push({ Sales: xValue, Profit: yValue });
        d3.select("#chart").selectAll("svg").remove();
        this.create("#chart", this.data);
      } else {
        alert("Por favor, insira valores válidos para X e Y.");
      }
    });
  }

  remove() {
    d3.select("#chart").selectAll("svg").remove();

    // Remove all event listeners by cloning and replacing elements
    const newXInput = this.xInput.cloneNode(true);
    this.xInput.parentNode.replaceChild(newXInput, this.xInput);
    this.xInput = newXInput;

    const newYInput = this.yInput.cloneNode(true);
    this.yInput.parentNode.replaceChild(newYInput, this.yInput);
    this.yInput = newYInput;

    const newAddDataButton = this.addDataButton.cloneNode(true);
    this.addDataButton.parentNode.replaceChild(
      newAddDataButton,
      this.addDataButton
    );
    this.addDataButton = newAddDataButton;
    super.remove();
  }
}
