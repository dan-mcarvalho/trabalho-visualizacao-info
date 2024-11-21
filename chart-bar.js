const heightInput = document.getElementById('height-input');
const widthInput = document.getElementById('width-input');
const marginInput = document.getElementById('margin-input');
const categoryInput = document.getElementById('category-input');
const valueInput = document.getElementById('value-input');
const addDataButton = document.getElementById('add-data-button');
const createNewChartButton = document.getElementById('create-new-chart-button');
const additionalChartsContainer = document.getElementById('additional-charts-container');
const labelXInput = document.getElementById('label-x-input');
const labelYInput = document.getElementById('label-y-input');
const csvUploadInput = document.getElementById('csv-input');
let margin = { top: 20, right: 30, bottom: 30, left: 40 };
let width = 1000 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;

let barData = [
    { category: "A", value: 30 },
    { category: "B", value: 80 },
    { category: "C", value: 45 },
    { category: "D", value: 60 },
    { category: "E", value: 20 },
    { category: "F", value: 90 }
];

function createBarChart(selector, data, config = {}) {
    const { width = 1000, height = 600, margin = { top: 20, right: 30, bottom: 50, left: 50 }, labelX , labelY } = config;

    d3.select(selector).select("svg").remove();

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
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue")
        .on("mouseover", function () {
            d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "steelblue");
        });

    svg.append("g")
        .call(d3.axisLeft(y));
            
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .text(labelX || "");

    svg.append("g")
            .call(d3.axisLeft(y));
    

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(labelY || "");
}



createBarChart("#chart-bar", barData, {
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom,
    margin,
    labelX: labelXInput.value || "Categoria", // Passa o valor inicial do input global ou um padrão
    labelY: labelYInput.value || "Valor" // Passa o valor inicial do input global ou um padrão
});


heightInput.addEventListener('change', (e) => {
    const newHeight = parseInt(e.target.value);
    if (!isNaN(newHeight)) {
        height = newHeight - margin.top - margin.bottom;
        createBarChart("#chart-bar", barData, { width: width + margin.left + margin.right, height: height + margin.top + margin.bottom, margin });
    }
});

labelXInput.addEventListener('change', () => {
    createBarChart("#chart-bar", barData, { 
        width: width + margin.left + margin.right, 
        height: height + margin.top + margin.bottom, 
        margin, 
        labelX: labelXInput.value || "Categoria", 
        labelY: labelYInput.value || "Valor" 
    });
});
labelYInput.addEventListener('change', () => {
    createBarChart("#chart-bar", barData, { 
        width: width + margin.left + margin.right, 
        height: height + margin.top + margin.bottom, 
        margin, 
        labelX: labelXInput.value || "Categoria", 
        labelY: labelYInput.value || "Valor" 
    });
});

widthInput.addEventListener('change', (e) => {
    const newWidth = parseInt(e.target.value);
    if (!isNaN(newWidth)) {
        width = newWidth - margin.left - margin.right;
        createBarChart("#chart-bar", barData, { width: width + margin.left + margin.right, height: height + margin.top + margin.bottom, margin });
    }
});

marginInput.addEventListener('change', (e) => {
    const newMargin = parseInt(e.target.value);
    if (!isNaN(newMargin)) {
        margin = { top: newMargin, right: newMargin, bottom: newMargin, left: newMargin };
        width = parseInt(widthInput.value || 1000) - margin.left - margin.right;
        height = parseInt(heightInput.value || 600) - margin.top - margin.bottom;
        createBarChart("#chart-bar", barData, { width: width + margin.left + margin.right, height: height + margin.top + margin.bottom, margin });
    }
});
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        readCSV(file);
    } else {
        alert('Nenhum arquivo selecionado.');
    }
}
function readCSV(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const csv = reader.result;
        parseCSV(csv);
    };
    reader.onerror = function (e) {
        console.error('Error reading file:', e);
    };
    reader.readAsText(file);
}

function parseCSV(csvData) {
    Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        complete: function (result) {
            const originalData = result.data;
            const filteredData = originalData.filter(row => row.category && row.value);

            if (filteredData.length < originalData.length) {
                alert(`Warning: ${originalData.length - filteredData.length} rows with missing data were skipped.`);
            }

            barData = filteredData
                .map(row => ({
                    category: row.category,
                    value: parseFloat(row.value)
                }))
                .filter(d => !isNaN(d.value));

            if (barData.length < filteredData.length) {
                alert(`Warning: ${filteredData.length - barData.length} rows with invalid value data were skipped.`);
            }

            if (barData.length > 0) {
                createBarChart("#chart-bar", barData, {
                    width: width + margin.left + margin.right,
                    height: height + margin.top + margin.bottom,
                    margin,
                    labelX: labelXInput.value || "Categoria",
                    labelY: labelYInput.value || "Valor"
                });
            } else {
                alert('No valid data to display.');
            }
        },
        error: function (error) {
            console.error('Error parsing CSV:', error);
            alert('Error parsing CSV file.');
        }
    });
}

csvUploadInput.addEventListener('change', handleFileSelect);
csvUploadInput.addEventListener('change', function() {
    this.value = '';
});
// Adicionar dados ao gráfico via input
addDataButton.addEventListener('click', () => {
    const newCategory = categoryInput.value.trim();
    const newValue = parseFloat(valueInput.value);

    if (newCategory && !isNaN(newValue)) {
        // Check if the category already exists in barData
        const existingData = barData.find(d => d.category === newCategory);
        if (existingData) {
            existingData.value = newValue;
        } else {
            barData.push({ category: newCategory, value: newValue });
        }
        // Re-render the chart with the updated data
        createBarChart("#chart-bar", barData, {
            width: width + margin.left + margin.right,
            height: height + margin.top + margin.bottom,
            margin,
            labelX: labelXInput.value || "Categoria",
            labelY: labelYInput.value || "Valor"
        });
        // Clear the input fields
        categoryInput.value = '';
        valueInput.value = '';
    } else {
        alert("Please enter a valid category and numeric value.");
    }
});

// Função para criar novos gráficos de maneira independente
// Função para criar novos gráficos de maneira independente
createNewChartButton.addEventListener('click', () => {
    // Criar um novo contêiner para o novo gráfico e seus inputs
    const newChartContainer = document.createElement('div');
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

    // Dados iniciais para o novo gráfico
    const newChartData = [];

    // Selecionar elementos do novo gráfico
    const chartHolder = newChartContainer.querySelector('.chart-holder');
    const newHeightInput = newChartContainer.querySelector('.height-input');
    const newWidthInput = newChartContainer.querySelector('.width-input');
    const newMarginInput = newChartContainer.querySelector('.margin-input');
    const newCategoryInput = newChartContainer.querySelector('.category-input');
    const newValueInput = newChartContainer.querySelector('.value-input');
    const newAddDataButton = newChartContainer.querySelector('.add-data-button');
    const newLabelXInput = newChartContainer.querySelector('.label-x-input');
    const newLabelYInput = newChartContainer.querySelector('.label-y-input');
    const newCsvUploadInput = newChartContainer.querySelector('.csv-input')

    let newMargin = { top: 20, right: 30, bottom: 30, left: 40 };
    let newWidth = 1000 - newMargin.left - newMargin.right;
    let newHeight = 600 - newMargin.top - newMargin.bottom;

    // Criar o novo gráfico
    createBarChart(chartHolder, newChartData, {
        width: newWidth + newMargin.left + newMargin.right,
        height: newHeight + newMargin.top + newMargin.bottom,
        margin: newMargin,
        labelX: newLabelXInput.value,
        labelY: newLabelYInput.value
    });
// Manipulador para carregar CSV no novo gráfico
    // Adicionar manipulação para carregar CSV
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
                            newChartData.length = 0; // Clear existing data
                            newChartData.push(...parsedData); // Add new data
                            createBarChart(chartHolder, newChartData, {
                                width: newWidth + newMargin.left + newMargin.right,
                                height: newHeight + newMargin.top + newMargin.bottom,
                                margin: newMargin,
                                labelX: newLabelXInput.value || "Categoria",
                                labelY: newLabelYInput.value || "Valor"
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


    // Eventos para atualizar as dimensões do novo gráfico dinamicamente
    newHeightInput.addEventListener('change', (e) => {
        const updatedHeight = parseInt(e.target.value);
        if (!isNaN(updatedHeight)) {
            newHeight = updatedHeight - newMargin.top - newMargin.bottom;
            createBarChart(chartHolder, newChartData, {
                width: newWidth + newMargin.left + newMargin.right,
                height: newHeight + newMargin.top + newMargin.bottom,
                margin: newMargin,
                labelX: newLabelXInput.value,
                labelY: newLabelYInput.value
            });
        }
    });

    newWidthInput.addEventListener('change', (e) => {
        const updatedWidth = parseInt(e.target.value);
        if (!isNaN(updatedWidth)) {
            newWidth = updatedWidth - newMargin.left - newMargin.right;
            createBarChart(chartHolder, newChartData, {
                width: newWidth + newMargin.left + newMargin.right,
                height: newHeight + newMargin.top + newMargin.bottom,
                margin: newMargin,
                labelX: newLabelXInput.value,
                labelY: newLabelYInput.value
            });
        }
    });

    newMarginInput.addEventListener('change', (e) => {
        const updatedMargin = parseInt(e.target.value);
        if (!isNaN(updatedMargin)) {
            newMargin = { top: updatedMargin, right: updatedMargin, bottom: updatedMargin, left: updatedMargin };
            newWidth = parseInt(newWidthInput.value || 1000) - newMargin.left - newMargin.right;
            newHeight = parseInt(newHeightInput.value || 600) - newMargin.top - newMargin.bottom;
            createBarChart(chartHolder, newChartData, {
                width: newWidth + newMargin.left + newMargin.right,
                height: newHeight + newMargin.top + newMargin.bottom,
                margin: newMargin,
                labelX: newLabelXInput.value,
                labelY: newLabelYInput.value
            });
        }
    });

    // Adicionar dados ao novo gráfico via input
    newAddDataButton.addEventListener('click', () => {
        const newCat = newCategoryInput.value.trim();
        const newVal = parseFloat(newValueInput.value);

        if (newCat && !isNaN(newVal)) {
            const existingNewData = newChartData.find(d => d.category === newCat);
            if (existingNewData) {
                existingNewData.value = newVal;
            } else {
                newChartData.push({ category: newCat, value: newVal });
            }
            createBarChart(chartHolder, newChartData, {
                width: newWidth + newMargin.left + newMargin.right,
                height: newHeight + newMargin.top + newMargin.bottom,
                margin: newMargin,
                labelX: newLabelXInput.value,
                labelY: newLabelYInput.value
            });

            newCategoryInput.value = '';
            newValueInput.value = '';
        } else {
            alert("Por favor, insira uma categoria válida e um valor numérico.");
        }
    });

    // Eventos para atualizar os rótulos X e Y
    newLabelXInput.addEventListener('change', (e) => {
        const updatedLabelX = e.target.value;
        createBarChart(chartHolder, newChartData, {
            width: newWidth + newMargin.left + newMargin.right,
            height: newHeight + newMargin.top + newMargin.bottom,
            margin: newMargin,
            labelX: updatedLabelX,
            labelY: newLabelYInput.value
        });
    });

    newLabelYInput.addEventListener('change', (e) => {
        const updatedLabelY = e.target.value;
        createBarChart(chartHolder, newChartData, {
            width: newWidth + newMargin.left + newMargin.right,
            height: newHeight + newMargin.top + newMargin.bottom,
            margin: newMargin,
            labelX: newLabelXInput.value,
            labelY: updatedLabelY
        });
    });
});
