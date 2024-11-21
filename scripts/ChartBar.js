class ChartBar extends ChartConfig {
    data = [];
    addDataButton = document.getElementById("add-data-button");
    xInput = document.getElementById("x-input");
    yInput = document.getElementById("y-input");
  constructor(data) {
    super();
    this.data = data;
    this.loadUpdateEvents();
    super.loadConfigEvents(this);
  }

  create(selector, data, config = {}) {
    {
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
        .scaleBand()
        .domain(data.map((d) => d.category))
        .range([0, width])
        .padding(0.1);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value)])
        .nice()
        .range([height, 0]);

      svg
        .append("g")
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", (d) => x(d.category))
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => height - y(d.value))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue")
        .on("mouseover", function () {
          d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function () {
          d3.select(this).attr("fill", "steelblue");
        });

      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg
        .append("text")
        .attr(
          "transform",
          `translate(${width / 2}, ${height + margin.bottom - 10})`
        )
        .style("text-anchor", "middle")
        .text(labelX || "");

      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(labelY || "");
    }
  }

  loadUpdateEvents() {
      this.addDataButton.addEventListener('click', () => {
          const newCategory = this.xInput.value.trim();
          const newValue = parseFloat(this.yInput.value);
        
          if (newCategory && !isNaN(newValue)) {
              const existingData = this.data.find(d => d.category === newCategory);
              if (existingData) {
                  existingData.value = newValue;
              } else {
                  this.data.push({ category: newCategory, value: newValue });
              }        
              this.create("#chart", this.data, { width: this.width + this.margin.left + this.margin.right, height: this.height + this.margin.top + this.margin.bottom, margin: this.margin });
          } else {
              alert("Por favor, insira uma categoria válida e um valor numérico.");
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
