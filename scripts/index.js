let currentChart;
let currentChartType;
const createNewChartButton = document.getElementById("create-new-chart-button");
const activeCharts = [];
const availableCharts = [
    {
      type: "bar",
      class: ChartBar,
      data: barData, //in datasets.js
    },
    {
      type: "scatter",
      class: ChartScatter,
      data: scatterData, //in datasets.js
    },
    {
      type: "heatmap",
      class: ChartHeatmap,
      data: heatmapData, //in datasets.js
    },
  ];
const updateChart = async (type) => {
    const superstore = await fetch('superstore.csv')
    .then(response => response.text())
    .catch(error => {
        console.error('Error loading superstore.csv:', error);
        return null;
    });

  const types = ["bar", "scatter", "heatmap"];
  if (currentChart && currentChart.type !== type) {
    currentChart.remove();
    delete currentChart;
    currentChart = null;
  }
  const selectedChart = document.querySelector(`[name=${type}]`);
  if (selectedChart) {
    selectedChart.classList.add("chart-option--selected");
  }
  types.forEach((type) => {
    if (!selectedChart || type !== selectedChart?.name) {
      document
        .querySelector(`[name=${type}]`)
        .classList.remove("chart-option--selected");
    }
  });

  const chart = availableCharts.find((chart) => chart.type === type);

  if (superstore) {
    chart.data = superstore;
  }

  if (chart) {
    currentChart = new chart.class(chart.data);
    currentChart.create("#chart", chart.data);
    currentChart.loadUpdateEvents();
    currentChartType = chart.type;
  }
  // Clear any existing additional charts
  const additionalChartsContainer = document.getElementById("additional-charts-container");
  if (additionalChartsContainer) {
    additionalChartsContainer.innerHTML = '';
  }
  activeCharts.length = 0;
};


createNewChartButton.addEventListener('click', () => {
    const newChartContainer = document.createElement('div');
    const additionalChartsContainer = document.getElementById("additional-charts-container");
    newChartContainer.className = 'chart-container';
    newChartContainer.innerHTML = `
        <div class="chart-config-inputs-holder">
            <span class="chart-config-inputs-holder__title">Configurações do gráfico |</span>
            <div class="chart-config-inputs-holder__input">
              <label>Altura:</label>
              <input type="text" class="height-input" value="600" placeholder="600" />
            </div>
            <div class="chart-config-inputs-holder__input">
              <label>Largura:</label>
              <input type="text" class="width-input" value="1000" placeholder="1000" />
            </div>
            <div class="chart-config-inputs-holder__input">
              <label>Margem:</label>
              <input type="text" class="margin-input" value="20" placeholder="20" />
            </div>
            <div class="chart-config-inputs-holder__input">
              <label for="label-x-input">Label X:</label>
              <input type="text" class="label-x-input" value="Categoria" placeholder="20" />
            </div>
            <div class="chart-config-inputs-holder__input">
              <label for="label-y-input">Label Y:</label>
              <input type="text" class="label-y-input" value="Valor" placeholder="20" />
            </div>
        </div>
        <div class="chart-data-inputs-holder">
            <span class="chart-config-inputs-holder__title">Adicionar Dados ao Gráfico |</span>
            <div class="chart-config-inputs-holder__input">
              <label>X:</label>
              <input type="text" class="category-input" placeholder="Categoria" />
            </div>
            <div class="chart-config-inputs-holder__input">
              <label>Y:</label>
              <input type="number" class="value-input" placeholder="Valor" />
            </div>
            <button type="button" class="add-data-button">Adicionar ao Gráfico</button>
        </div>


        <div class="csv-input-holder">
            <div class="csv-input-holder__input">
                <label>Carregar CSV:</label>
                <input type="file" class="csv-input" accept=".csv" />
            </div>
        </div>



        <div class="chart-holder"></div>
    `;
    additionalChartsContainer.appendChild(newChartContainer);
    const xInput = newChartContainer.querySelector('.category-input');
    const yInput = newChartContainer.querySelector('.value-input');

    // Find the chart type and create new instance with empty data
    const chart = availableCharts.find((chart) => chart.type === currentChartType);
    const newActiveChart = new chart.class([]);  // Initialize with empty data array
    
    // Get all inputs for this specific chart container
    const heightInput = newChartContainer.querySelector('.height-input');
    const widthInput = newChartContainer.querySelector('.width-input');
    const labelXInput = newChartContainer.querySelector('.label-x-input');
    const labelYInput = newChartContainer.querySelector('.label-y-input');
    const addDataButton = newChartContainer.querySelector('.add-data-button');
    const marginInput = newChartContainer.querySelector('.margin-input');
    const newCsvUploadInput = newChartContainer.querySelector('.csv-input')

    
    // Create chart in its specific holder
    const chartHolder = newChartContainer.querySelector('.chart-holder');
    newActiveChart.create(chartHolder, [], {
        width: 1000,
        height: 600,
        labelX: "Categoria",
        labelY: "Valor"
    });

    newCsvUploadInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
              const csvContent = e.target.result;

              Papa.parse(csvContent, {
                  header: true,
                  skipEmptyLines: true,
                  complete: function (result) {
                      const parsedData = result.data.map(row => ({
                          category: row.category,
                          value: parseFloat(row.value),
                      })).filter(d => d.category && !isNaN(d.value));

                      if (parsedData.length > 0) {
                          newActiveChart.data = parsedData;
                          newActiveChart.create(chartHolder, parsedData, {
                              width: parseInt(widthInput.value) || 1000,
                              height: parseInt(heightInput.value) || 600,
                              margin: {
                                  top: parseInt(marginInput.value) || 20,
                                  right: parseInt(marginInput.value) || 20,
                                  bottom: parseInt(marginInput.value) || 20,
                                  left: parseInt(marginInput.value) || 20
                              },
                              labelX: labelXInput.value || "Categoria",
                              labelY: labelYInput.value || "Valor"
                          });
                      } else {
                          alert("No valid data found in CSV.");
                      }
                  },
                  error: function (error) {
                      alert("Error parsing CSV.");
                      console.error(error);
                  }
              });
          };
          reader.readAsText(file);
      } else {
          alert("No file selected.");
      }
  });

    // Set up event listeners for this specific chart
    heightInput.addEventListener('change', (e) => {
        const newHeight = parseInt(e.target.value);
        if (!isNaN(newHeight)) {
            newActiveChart.create(chartHolder, newActiveChart.data, { height: newHeight });
        }
    });

    marginInput.addEventListener('change', (e) => {
        const newMargin = parseInt(e.target.value);
        if (!isNaN(newMargin)) {
            const margin = { top: newMargin, right: newMargin, bottom: newMargin, left: newMargin };
            newActiveChart.create(chartHolder, newActiveChart.data, { margin });
        }
    });

    widthInput.addEventListener('change', (e) => {
        const newWidth = parseInt(e.target.value);
        if (!isNaN(newWidth)) {
            newActiveChart.create(chartHolder, newActiveChart.data, { width: newWidth });
        }
    });

    labelXInput.addEventListener('change', (e) => {
        newActiveChart.create(chartHolder, newActiveChart.data, { 
            labelX: e.target.value, 
            labelY: labelYInput.value 
        });
    });

    labelYInput.addEventListener('change', (e) => {
        newActiveChart.create(chartHolder, newActiveChart.data, { 
            labelY: e.target.value, 
            labelX: labelXInput.value 
        });
    });

    
    addDataButton.addEventListener('click', () => {
        const xValue = xInput.value.trim();
        const yValue = parseFloat(yInput.value);

        if (newActiveChart instanceof ChartBar) {
            if (xValue && !isNaN(yValue)) {
                const existingData = newActiveChart.data.find(d => d.category === xValue);
                if (existingData) {
                    existingData.value = yValue;
                } else {
                    newActiveChart.data.push({ category: xValue, value: yValue });
                }
            } else {
                alert("Por favor, insira uma categoria válida e um valor numérico.");
                return;
            }
        } else if (newActiveChart instanceof ChartScatter) {
            // Scatter plot data handling
            if (!isNaN(xValue) && !isNaN(yValue)) {
                newActiveChart.data.push({ Sales: parseFloat(xValue), Profit: yValue });
            } else {
                alert('Por favor, insira valores numéricos válidos para X e Y.');
                return;
            }
        }

        // Update chart and clear inputs
        newActiveChart.create(chartHolder, newActiveChart.data);
        xInput.value = '';
        yInput.value = '';
    });

    activeCharts.push(newActiveChart);
});

updateChart("bar");
