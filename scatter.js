const heightInput = document.getElementById('height-input');
const widthInput = document.getElementById('width-input'); 
const marginInput = document.getElementById('margin-input');
const xInput = document.getElementById('x-input');
const yInput = document.getElementById('y-input');
const addDataButton = document.getElementById('add-data-button');
const createNewChartButton = document.getElementById('create-new-chart-button');
const additionalChartsContainer = document.getElementById('additional-charts-container');

let margin = {top: 20, right: 30, bottom: 30, left: 40};
let width = 1000 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;

// Atualiza as dimensões do gráfico ao modificar os inputs
heightInput.addEventListener('change', (e) => {
    const newHeight = parseInt(e.target.value);
    if (!isNaN(newHeight)) {
        height = newHeight - margin.top - margin.bottom;
        d3.select("#chart-scatter svg").remove();
        createScatterPlot("#chart-scatter", scatterData);
    }
});

widthInput.addEventListener('change', (e) => {
    const newWidth = parseInt(e.target.value);
    if (!isNaN(newWidth)) {
        width = newWidth - margin.left - margin.right;
        d3.select("#chart-scatter svg").remove();
        createScatterPlot("#chart-scatter", scatterData);
    }
});

marginInput.addEventListener('change', (e) => {
    const newMargin = parseInt(e.target.value);
    if (!isNaN(newMargin)) {
        margin = {top: newMargin, right: newMargin, bottom: newMargin, left: newMargin};
        width = parseInt(widthInput.value || 1000) - margin.left - margin.right;
        height = parseInt(heightInput.value || 600) - margin.top - margin.bottom;
        d3.select("#chart-scatter svg").remove();
        createScatterPlot("#chart-scatter", scatterData);
    }
});

// Função para adicionar dados ao gráfico
addDataButton.addEventListener('click', () => {
    const xValue = parseFloat(xInput.value);
    const yValue = parseFloat(yInput.value);

    if (!isNaN(xValue) && !isNaN(yValue)) {
        scatterData.push({ Sales: xValue, Profit: yValue });
        d3.select("#chart-scatter svg").remove();
        createScatterPlot("#chart-scatter", scatterData);

        xInput.value = '';
        yInput.value = '';
    } else {
        alert('Por favor, insira valores válidos para X e Y.');
    }
});

// Função para criar novos gráficos
createNewChartButton.addEventListener('click', () => {
    const newChartContainer = document.createElement('div');
    newChartContainer.className = 'chart-container';
    newChartContainer.innerHTML = `
        <div class="chart-config-inputs-holder">
            <label>Altura:</label><input type="text" class="height-input" value="600" />
            <label>Largura:</label><input type="text" class="width-input" value="1000" />
            <label>Margem:</label><input type="text" class="margin-input" value="20" />
        </div>
        <div class="chart-data-inputs-holder">
            <label>X:</label><input type="number" class="x-input" placeholder="Eixo X" />
            <label>Y:</label><input type="number" class="y-input" placeholder="Eixo Y" />
            <button class="add-data-button">Adicionar ao Gráfico</button>
        </div>
        <div class="chart-holder"></div>
    `;
    additionalChartsContainer.appendChild(newChartContainer);

    const newScatterData = [{ Sales: 100, Profit: 50 }];
    const chartHolder = newChartContainer.querySelector('.chart-holder');
    const newHeightInput = newChartContainer.querySelector('.height-input');
    const newWidthInput = newChartContainer.querySelector('.width-input');
    const newMarginInput = newChartContainer.querySelector('.margin-input');
    const newXInput = newChartContainer.querySelector('.x-input');
    const newYInput = newChartContainer.querySelector('.y-input');
    const newAddDataButton = newChartContainer.querySelector('.add-data-button');

    let newMargin = {top: 20, right: 30, bottom: 30, left: 40};
    let newWidth = 1000 - newMargin.left - newMargin.right;
    let newHeight = 600 - newMargin.top - newMargin.bottom;

    createScatterPlot(chartHolder, newScatterData);

    newHeightInput.addEventListener('change', (e) => {
        const updatedHeight = parseInt(e.target.value);
        if (!isNaN(updatedHeight)) {
            newHeight = updatedHeight - newMargin.top - newMargin.bottom;
            d3.select(chartHolder).select("svg").remove();
            createScatterPlot(chartHolder, newScatterData, { width: newWidth, height: newHeight, margin: newMargin });
        }
    });

    newWidthInput.addEventListener('change', (e) => {
        const updatedWidth = parseInt(e.target.value);
        if (!isNaN(updatedWidth)) {
            newWidth = updatedWidth - newMargin.left - newMargin.right;
            d3.select(chartHolder).select("svg").remove();
            createScatterPlot(chartHolder, newScatterData, { width: newWidth, height: newHeight, margin: newMargin });
        }
    });

    newMarginInput.addEventListener('change', (e) => {
        const updatedMargin = parseInt(e.target.value);
        if (!isNaN(updatedMargin)) {
            newMargin = {top: updatedMargin, right: updatedMargin, bottom: updatedMargin, left: updatedMargin};
            d3.select(chartHolder).select("svg").remove();
            createScatterPlot(chartHolder, newScatterData, { width: newWidth, height: newHeight, margin: newMargin });
        }
    });

    newAddDataButton.addEventListener('click', () => {
        const xValue = parseFloat(newXInput.value);
        const yValue = parseFloat(newYInput.value);

        if (!isNaN(xValue) && !isNaN(yValue)) {
            newScatterData.push({ Sales: xValue, Profit: yValue });
            d3.select(chartHolder).select("svg").remove();
            createScatterPlot(chartHolder, newScatterData);
            newXInput.value = '';
            newYInput.value = '';
        } else {
            alert('Por favor, insira valores válidos para X e Y.');
        }
    });
});

// Função para criar o gráfico de dispersão
function createScatterPlot(selector, data, config = { width: width, height: height, margin: margin }) {
    const { width, height, margin } = config;

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Sales)])
        .nice()
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.Profit), d3.max(data, d => d.Profit)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.Sales))
        .attr("cy", d => y(d.Profit))
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("opacity", 0.7)
        .on("mouseover", function () {
            d3.select(this).attr("fill", "orange").attr("r", 6);
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "steelblue").attr("r", 4);
        });

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom - 5)
        .style("text-anchor", "middle")
        .text("Sales");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", -margin.left + 11)
        .style("text-anchor", "middle")
        .text("Profit");
}

// Dados para gráfico de dispersão
const scatterData = [{'Sales': 641.4, 'Profit': -423.45}, {'Sales': 50.58, 'Profit': 22.74}, {'Sales': 61.71, 'Profit': 4.29}, {'Sales': 396.576, 'Profit': -84.384}, {'Sales': 16.44, 'Profit': 8.22}, {'Sales': 242.88, 'Profit': 41.28}, {'Sales': 24.72, 'Profit': 11.1}, {'Sales': 28.68, 'Profit': -7.17}, {'Sales': 161.514, 'Profit': 51.984}, {'Sales': 387.099, 'Profit': 51.579}, {'Sales': 45.09, 'Profit': 22.53}, {'Sales': 16.74, 'Profit': 6.18}, {'Sales': 193.89144, 'Profit': 20.97144}, {'Sales': 45.66, 'Profit': -33.484}, {'Sales': 118.8, 'Profit': 53.4}, {'Sales': 45.36, 'Profit': 21.7728}, {'Sales': 319.77, 'Profit': -76.77}, {'Sales': 246.6945, 'Profit': -125.2755}, {'Sales': 105.06, 'Profit': 36.72}, {'Sales': 756.81, 'Profit': 210.21}, {'Sales': 111.15, 'Profit': 48.906}, {'Sales': 709.0275, 'Profit': -100.2225}, {'Sales': 41.37, 'Profit': 6.93}, {'Sales': 698.04112, 'Profit': 131.48112}, {'Sales': 182.994, 'Profit': -320.2395}, {'Sales': 22.176, 'Profit': 3.276}, {'Sales': 29.34, 'Profit': 10.8558}, {'Sales': 14.37, 'Profit': 3.0}, {'Sales': 662.19296, 'Profit': 197.71296}, {'Sales': 13.11, 'Profit': 4.44}, {'Sales': 38.4, 'Profit': 19.2}, {'Sales': 390.72, 'Profit': 191.36}, {'Sales': 73.584, 'Profit': 8.2782}, {'Sales': 655.776, 'Profit': -36.444}, {'Sales': 150.633, 'Profit': -3.507}, {'Sales': 171.396, 'Profit': -114.264}, {'Sales': 128.88, 'Profit': 9.0}, {'Sales': 1324.88, 'Profit': 423.92}, {'Sales': 183.75, 'Profit': 64.26}, {'Sales': 34.68, 'Profit': 14.2}, {'Sales': 172.08, 'Profit': 27.48}, {'Sales': 122.352, 'Profit': 13.7646}, {'Sales': 784.728, 'Profit': 62.208}, {'Sales': 97.32, 'Profit': 4.86}, {'Sales': 2582.16, 'Profit': 593.88}, {'Sales': 36.36, 'Profit': 12.2715}, {'Sales': 9.78, 'Profit': 2.34}, {'Sales': 35.97, 'Profit': 7.17}, {'Sales': 225.54, 'Profit': 13.5}, {'Sales': 271.44, 'Profit': 122.148}, {'Sales': 36.384, 'Profit': -29.136}, {'Sales': 95.04, 'Profit': 47.52}, {'Sales': 3.96, 'Profit': 1.4652}, {'Sales': 17.712, 'Profit': -0.408}, {'Sales': 6.912, 'Profit': 2.5056}, {'Sales': 5.104, 'Profit': -8.6768}, {'Sales': 74.48, 'Profit': 35.0}, {'Sales': 33.21, 'Profit': 10.26}, {'Sales': 30.3, 'Profit': 4.2}, {'Sales': 18.96, 'Profit': -6.18}, {'Sales': 46.44, 'Profit': 15.3}, {'Sales': 4.448, 'Profit': 0.3336}, {'Sales': 11.04, 'Profit': -13.8}, {'Sales': 61.95, 'Profit': 7.35}, {'Sales': 17.55, 'Profit': 0.0}, {'Sales': 1285.47, 'Profit': 565.38}, {'Sales': 17.28, 'Profit': 2.04}, {'Sales': 66.96, 'Profit': 20.72}, {'Sales': 775.62, 'Profit': 139.59}, {'Sales': 37.66, 'Profit': 14.56}, {'Sales': 727.5, 'Profit': 121.2}, {'Sales': 145.68, 'Profit': 59.7}, {'Sales': 32.32, 'Profit': 14.22}, {'Sales': 110.052, 'Profit': -53.208}, {'Sales': 85.056, 'Profit': 28.7064}, {'Sales': 331.536, 'Profit': -82.884}, {'Sales': 624.24, 'Profit': 31.2}, {'Sales': 16.44, 'Profit': 8.22}, {'Sales': 22.336, 'Profit': 7.8176}, {'Sales': 785.79, 'Profit': 91.59}, {'Sales': 32.7, 'Profit': -6.54}, {'Sales': 142.68, 'Profit': 32.76}, {'Sales': 262.872, 'Profit': 8.712}, {'Sales': 144.99, 'Profit': 12.96}, {'Sales': 142.2, 'Profit': 32.58}, {'Sales': 14.91, 'Profit': 4.6221}, {'Sales': 49.32, 'Profit': 5.4}, {'Sales': 8.016, 'Profit': 1.002}, {'Sales': 248.82, 'Profit': 89.55}, {'Sales': 842.352, 'Profit': 42.1176}, {'Sales': 144.6, 'Profit': 7.2}, {'Sales': 14.724, 'Profit': -2.706}, {'Sales': 22.04, 'Profit': 7.92}, {'Sales': 207.684, 'Profit': 83.004}, {'Sales': 420.864, 'Profit': -631.296}, {'Sales': 4535.976, 'Profit': 1644.2913}, {'Sales': 1272.42, 'Profit': -1094.34}, {'Sales': 12.176, 'Profit': 4.4138}, {'Sales': 198.272, 'Profit': 61.96}, {'Sales': 24.672, 'Profit': 0.0}, {'Sales': 692.94, 'Profit': 173.235}, {'Sales': 12.96, 'Profit': -7.56}, {'Sales': 2060.744, 'Profit': 643.9825}, {'Sales': 130.62, 'Profit': 46.98}, {'Sales': 117.408, 'Profit': -41.112}, {'Sales': 484.176, 'Profit': -137.324}, {'Sales': 354.9, 'Profit': 17.745}, {'Sales': 44.7, 'Profit': 0.8}, {'Sales': 2152.776, 'Profit': 726.5619}, {'Sales': 66.54, 'Profit': 32.6046}, {'Sales': 11.09, 'Profit': 5.4341}, {'Sales': 167.86, 'Profit': 53.62}, {'Sales': 24.534, 'Profit': -28.626}, {'Sales': 47.43, 'Profit': 17.07}, {'Sales': 31.35, 'Profit': 14.7}, {'Sales': 8.04, 'Profit': 2.88}, {'Sales': 95.84, 'Profit': 34.742}, {'Sales': 37.93, 'Profit': 6.8274}, {'Sales': 5.68, 'Profit': 1.7608}, {'Sales': 136.5525, 'Profit': -6.4275}, {'Sales': 22.92, 'Profit': 11.0}, {'Sales': 19.68, 'Profit': 6.888}, {'Sales': 153.657, 'Profit': 27.297}, {'Sales': 211.62, 'Profit': 14.79}, {'Sales': 76.95, 'Profit': 0.0}, {'Sales': 231.12, 'Profit': 39.24}, {'Sales': 47.331, 'Profit': 16.821}, {'Sales': 1101.48, 'Profit': 429.5772}, {'Sales': 95.04, 'Profit': 23.76}, {'Sales': 38.412, 'Profit': -5.148}, {'Sales': 46.71, 'Profit': 7.47}, {'Sales': 8.16, 'Profit': 1.95}, {'Sales': 757.8454, 'Profit': -471.4546}, {'Sales': 12.32, 'Profit': 1.44}, {'Sales': 256.5, 'Profit': 48.6}, {'Sales': 19.593, 'Profit': -26.787}, {'Sales': 48.9, 'Profit': 17.6}, {'Sales': 357.0, 'Profit': 57.12}, {'Sales': 155.85, 'Profit': 4.65}, {'Sales': 1038.84, 'Profit': 51.942}, {'Sales': 56.7, 'Profit': 26.082}, {'Sales': 380.7, 'Profit': -335.16}, {'Sales': 105.52, 'Profit': 18.96}, {'Sales': 124.41, 'Profit': 14.9292}, {'Sales': 27.78, 'Profit': 6.93}, {'Sales': 47.16, 'Profit': 16.92}, {'Sales': 31.92, 'Profit': 9.2568}, {'Sales': 23.592, 'Profit': -23.028}, {'Sales': 58.17, 'Profit': 15.69}, {'Sales': 23.7, 'Profit': 9.48}, {'Sales': 58.86, 'Profit': -19.14}, {'Sales': 131.85, 'Profit': 54.0}, {'Sales': 9.78, 'Profit': 2.34}, {'Sales': 20.58, 'Profit': 5.94}, {'Sales': 330.5367, 'Profit': 54.3267}, {'Sales': 489.27948, 'Profit': 97.05948}, {'Sales': 32.736, 'Profit': -24.624}, {'Sales': 32.0, 'Profit': 1.6}, {'Sales': 185.58, 'Profit': 76.0878}, {'Sales': 231.36, 'Profit': 64.68}, {'Sales': 12.96, 'Profit': 6.2208}, {'Sales': 599.16, 'Profit': 0.0}, {'Sales': 18.96, 'Profit': 0.36}, {'Sales': 2605.92, 'Profit': 364.8}, {'Sales': 28.395, 'Profit': -5.715}, {'Sales': 2.97, 'Profit': -0.6435}, {'Sales': 96.08, 'Profit': 46.1184}, {'Sales': 165.24, 'Profit': 59.4}, {'Sales': 131.52, 'Profit': 9.2}, {'Sales': 1145.34, 'Profit': 356.22}, {'Sales': 229.284, 'Profit': -7.656}, {'Sales': 16.74, 'Profit': 8.0352}, {'Sales': 51.27, 'Profit': 17.94}, {'Sales': 15.24, 'Profit': 4.98}, {'Sales': 39.92, 'Profit': 11.1776}, {'Sales': 84.784, 'Profit': -20.1362}, {'Sales': 11.13, 'Profit': 0.75}, {'Sales': 390.24, 'Profit': 195.12}, {'Sales': 249.1344, 'Profit': -47.8656}, {'Sales': 23.99, 'Profit': 5.5177}, {'Sales': 546.56, 'Profit': 142.08}, {'Sales': 1104.408, 'Profit': 208.608}, {'Sales': 121.23, 'Profit': 8.37}, {'Sales': 16.818, 'Profit': -12.902}, {'Sales': 26.38, 'Profit': 12.1348}, {'Sales': 35.04, 'Profit': 5.52}, {'Sales': 399.95, 'Profit': 143.982}, {'Sales': 90.72, 'Profit': -5.13}, {'Sales': 118.95, 'Profit': 11.85}, {'Sales': 255.68, 'Profit': 76.704}, {'Sales': 37.64, 'Profit': 3.0}, {'Sales': 5.94, 'Profit': 0.0}, {'Sales': 20.2, 'Profit': 1.4}, {'Sales': 29.016, 'Profit': -6.304}, {'Sales': 195.2, 'Profit': 44.88}, {'Sales': 435.99, 'Profit': 178.74}, {'Sales': 166.05, 'Profit': 26.55}, {'Sales': 13.848, 'Profit': 5.193}, {'Sales': 520.5, 'Profit': 104.1}, {'Sales': 191.646, 'Profit': 31.941}, {'Sales': 15.75, 'Profit': 7.56}, {'Sales': 154.7, 'Profit': 0.0}, {'Sales': 150.12, 'Profit': 21.0}, {'Sales': 33.45, 'Profit': 15.387}, {'Sales': 37.38, 'Profit': 0.36}, {'Sales': 83.97, 'Profit': 27.63}, {'Sales': 366.72, 'Profit': 54.96}, {'Sales': 12.078, 'Profit': -20.142}, {'Sales': 11.168, 'Profit': -2.5128}, {'Sales': 45.4104, 'Profit': -24.9396}, {'Sales': 2.394, 'Profit': -6.3441}, {'Sales': 33.6, 'Profit': 10.08}, {'Sales': 39.72, 'Profit': 13.08}, {'Sales': 95.06948, 'Profit': 21.70948}, {'Sales': 82.8, 'Profit': -4.14}, {'Sales': 37.26, 'Profit': 8.91}, {'Sales': 280.872, 'Profit': -430.728}, {'Sales': 17.472, 'Profit': 5.6784}, {'Sales': 46.74, 'Profit': 21.96}, {'Sales': 13.584, 'Profit': -4.416}, {'Sales': 358.533, 'Profit': 123.333}, {'Sales': 75.6, 'Profit': 12.0}, {'Sales': 35.34, 'Profit': 9.18}, {'Sales': 841.568, 'Profit': 294.5488}, {'Sales': 6.992, 'Profit': 0.5244}, {'Sales': 248.856, 'Profit': -74.664}, {'Sales': 113.4, 'Profit': 35.1}, {'Sales': 39.57, 'Profit': 15.03}, {'Sales': 23.088, 'Profit': -5.072}, {'Sales': 72.744, 'Profit': -15.4581}, {'Sales': 39.36, 'Profit': -11.84}, {'Sales': 30.51, 'Profit': 13.11}, {'Sales': 20.704, 'Profit': 7.764}, {'Sales': 10.368, 'Profit': 3.6288}, {'Sales': 76.368, 'Profit': -84.012}, {'Sales': 153.6, 'Profit': 76.8}, {'Sales': 498.24, 'Profit': -16.62}, {'Sales': 31.5, 'Profit': 10.08}, {'Sales': 105.98, 'Profit': 4.2392}, {'Sales': 12.32, 'Profit': 1.848}, {'Sales': 247.5, 'Profit': 81.6}, {'Sales': 82.593, 'Profit': 9.093}, {'Sales': 52.44, 'Profit': 3.6}, {'Sales': 165.54824, 'Profit': 49.42824}, {'Sales': 21.4, 'Profit': 6.206}, {'Sales': 19.44, 'Profit': 9.3312}, {'Sales': 57.2949, 'Profit': -10.3851}, {'Sales': 20.2, 'Profit': 4.64}, {'Sales': 96.96, 'Profit': 6.46}, {'Sales': 260.88, 'Profit': 12.96}, {'Sales': 5.56, 'Profit': 1.4456}, {'Sales': 315.18, 'Profit': 56.7}, {'Sales': 394.98, 'Profit': 15.78}, {'Sales': 66.36, 'Profit': 8.52}, {'Sales': 635.96, 'Profit': 165.3496}, {'Sales': 98.0, 'Profit': 5.88}, {'Sales': 3.52, 'Profit': 1.6896}, {'Sales': 1.44, 'Profit': -1.17}, {'Sales': 149.6, 'Profit': 56.84}, {'Sales': 4.095, 'Profit': -6.705}, {'Sales': 82.69428, 'Profit': 36.27428}, {'Sales': 135.54, 'Profit': 40.59}, {'Sales': 64.26, 'Profit': 32.1}, {'Sales': 6.5, 'Profit': 2.72}, {'Sales': 80.1, 'Profit': 3.15}, {'Sales': 9.135, 'Profit': -6.105}, {'Sales': 15.615, 'Profit': -5.085}, {'Sales': 238.152, 'Profit': 89.307}, {'Sales': 68.184, 'Profit': -125.016}, {'Sales': 758.484, 'Profit': 126.324}, {'Sales': 77.52, 'Profit': 36.36}, {'Sales': 101.58, 'Profit': 1.98}, {'Sales': 132.555, 'Profit': -42.435}, {'Sales': 39.96, 'Profit': 18.7812}, {'Sales': 194.8, 'Profit': 60.32}, {'Sales': 66.339, 'Profit': -5.271}, {'Sales': 146.79, 'Profit': 20.52}, {'Sales': 310.392, 'Profit': -512.1468}, {'Sales': 6.63, 'Profit': 3.1161}, {'Sales': 159.66, 'Profit': 33.48}, {'Sales': 391.22748, 'Profit': -0.99252}, {'Sales': 93.0, 'Profit': 17.64}, {'Sales': 365.25, 'Profit': 116.85}, {'Sales': 107.648, 'Profit': 33.64}, {'Sales': 18.99, 'Profit': 6.81}, {'Sales': 5.472, 'Profit': -4.128}, {'Sales': 49.92, 'Profit': -16.98}, {'Sales': 15.66, 'Profit': -12.54}, {'Sales': 147.168, 'Profit': 16.5564}, {'Sales': 26.82, 'Profit': 13.38}, {'Sales': 100.872, 'Profit': -108.468}, {'Sales': 104.6925, 'Profit': -5.6475}, {'Sales': 31.17, 'Profit': 7.14}, {'Sales': 3.321, 'Profit': -4.329}, {'Sales': 327.84, 'Profit': 134.4}, {'Sales': 34.02, 'Profit': 14.28}, {'Sales': 62.982, 'Profit': -14.6958}, {'Sales': 19.16, 'Profit': 0.16}, {'Sales': 153.684, 'Profit': 44.364}, {'Sales': 110.48, 'Profit': 22.08}, {'Sales': 137.07, 'Profit': 56.16}, {'Sales': 60.144, 'Profit': 20.2986}, {'Sales': 84.96, 'Profit': 38.16}, {'Sales': 57.84, 'Profit': 16.17}, {'Sales': 422.5032, 'Profit': 132.3432}, {'Sales': 174.33, 'Profit': 27.81}, {'Sales': 27.054, 'Profit': -18.066}, {'Sales': 73.89, 'Profit': 7.38}, {'Sales': 84.6, 'Profit': 21.9}, {'Sales': 22.62, 'Profit': 0.44}, {'Sales': 216.432, 'Profit': -37.908}, {'Sales': 26.25, 'Profit': 8.64}, {'Sales': 31.3866, 'Profit': -22.5534}, {'Sales': 76.176, 'Profit': 26.6616}, {'Sales': 215.46, 'Profit': 16.74}, {'Sales': 148.5, 'Profit': 48.96}, {'Sales': 20.736, 'Profit': 7.2576}, {'Sales': 115.11, 'Profit': 13.77}, {'Sales': 7.56, 'Profit': -2.13}, {'Sales': 131.94, 'Profit': 60.66}, {'Sales': 39.888, 'Profit': -2.112}, {'Sales': 101.7, 'Profit': 11.16}, {'Sales': 12.56, 'Profit': 4.0192}, {'Sales': 71.199, 'Profit': -4.041}, {'Sales': 20.82, 'Profit': 1.86}, {'Sales': 831.4608, 'Profit': 230.3808}, {'Sales': 64.864, 'Profit': 6.4864}, {'Sales': 795.8295, 'Profit': -74.9205}, {'Sales': 463.176, 'Profit': -216.384}, {'Sales': 87.156, 'Profit': 22.236}, {'Sales': 14.62, 'Profit': 6.8714}, {'Sales': 42.1986, 'Profit': -35.8614}, {'Sales': 288.08268, 'Profit': 103.28268}, {'Sales': 145.68, 'Profit': 59.7}, {'Sales': 20.8449, 'Profit': -1.9851}, {'Sales': 149.95, 'Profit': 31.4895}, {'Sales': 21.78, 'Profit': 10.86}, {'Sales': 132.51, 'Profit': 66.15}, {'Sales': 44.43, 'Profit': 14.64}, {'Sales': 51.968, 'Profit': -10.3936}, {'Sales': 35.216, 'Profit': 2.6412}, {'Sales': 81.42, 'Profit': 39.06}, {'Sales': 35.9976, 'Profit': -8.8824}, {'Sales': 95.85, 'Profit': 22.95}, {'Sales': 21.2742, 'Profit': -1.6758}, {'Sales': 314.352, 'Profit': -15.7176}, {'Sales': 510.12, 'Profit': -10.26}, {'Sales': 161.61, 'Profit': 42.0186}, {'Sales': 100.8, 'Profit': 29.16}, {'Sales': 24.246, 'Profit': -0.834}, {'Sales': 39.69, 'Profit': 3.51}, {'Sales': 23.36, 'Profit': 6.0736}, {'Sales': 485.676, 'Profit': -27.084}, {'Sales': 1076.406, 'Profit': -38.034}, {'Sales': 599.985, 'Profit': -479.988}, {'Sales': 40.96, 'Profit': 18.84}, {'Sales': 135.09, 'Profit': 28.77}, {'Sales': 40.248, 'Profit': -81.852}, {'Sales': 13.36, 'Profit': 6.4128}, {'Sales': 13.95, 'Profit': 3.87}, {'Sales': 63.84, 'Profit': 16.5984}, {'Sales': 5.28, 'Profit': 2.376}, {'Sales': 54.82, 'Profit': 0.0}, {'Sales': 18.16, 'Profit': 1.816}, {'Sales': 122.97, 'Profit': 60.2553}, {'Sales': 535.8, 'Profit': -96.48}, {'Sales': 1447.44, 'Profit': 506.52}, {'Sales': 86.928, 'Profit': -126.072}, {'Sales': 31.62, 'Profit': 12.96}, {'Sales': 468.765, 'Profit': -459.405}, {'Sales': 4.02, 'Profit': -1.11}, {'Sales': 57.06, 'Profit': 4.5}, {'Sales': 107.982, 'Profit': -26.9955}, {'Sales': 106.704, 'Profit': 16.464}, {'Sales': 364.92, 'Profit': 83.91}, {'Sales': 289.44, 'Profit': 23.1}, {'Sales': 192.78, 'Profit': 46.26}, {'Sales': 162.4476, 'Profit': 52.7676}, {'Sales': 1034.964, 'Profit': -86.436}, {'Sales': 34.08, 'Profit': 15.28}, {'Sales': 659.9, 'Profit': 217.767}, {'Sales': 175.176, 'Profit': 23.256}, {'Sales': 14.82, 'Profit': -1.5}, {'Sales': 121.58, 'Profit': 15.8}, {'Sales': 4.992, 'Profit': -6.498}, {'Sales': 613.89, 'Profit': 171.81}, {'Sales': 51.6, 'Profit': 24.75}, {'Sales': 287.4456, 'Profit': -45.1044}, {'Sales': 111.672, 'Profit': 6.9795}, {'Sales': 697.16, 'Profit': 146.4036}, {'Sales': 194.64, 'Profit': 64.2}, {'Sales': 137.25, 'Profit': 63.09}, {'Sales': 71.67, 'Profit': 29.37}, {'Sales': 189.95, 'Profit': 45.588}, {'Sales': 92.16, 'Profit': 27.63}, {'Sales': 38.412, 'Profit': -3.528}, {'Sales': 283.92, 'Profit': 70.98}, {'Sales': 150.39, 'Profit': 31.5}, {'Sales': 16.4, 'Profit': 4.264}, {'Sales': 19.971, 'Profit': -17.319}, {'Sales': 292.8, 'Profit': 114.0}, {'Sales': 6.34, 'Profit': 2.2}, {'Sales': 101.94, 'Profit': 29.5626}, {'Sales': 63.792, 'Profit': -11.748}, {'Sales': 13.5, 'Profit': 4.32}, {'Sales': 39.39, 'Profit': 19.29}, {'Sales': 46.62, 'Profit': 7.7}, {'Sales': 646.5375, 'Profit': -17.2725}, {'Sales': 12.35, 'Profit': 5.434}, {'Sales': 90.06, 'Profit': -87.84}, {'Sales': 87.804, 'Profit': 13.644}, {'Sales': 272.544, 'Profit': -54.576}, {'Sales': 48.93, 'Profit': -2.97}, {'Sales': 658.672, 'Profit': 8.232}, {'Sales': 8.127, 'Profit': -5.433}, {'Sales': 61.254, 'Profit': -130.686}, {'Sales': 49.104, 'Profit': -4.956}, {'Sales': 121.08, 'Profit': 41.16}, {'Sales': 22.248, 'Profit': 7.5087}, {'Sales': 18.93, 'Profit': 7.56}, {'Sales': 1266.36, 'Profit': 265.92}, {'Sales': 2171.16, 'Profit': -2750.28}, {'Sales': 19.332, 'Profit': 6.612}, {'Sales': 995.28, 'Profit': 358.2}, {'Sales': 100.49, 'Profit': 25.1225}, {'Sales': 64.96, 'Profit': 31.12}, {'Sales': 3.15, 'Profit': 1.512}, {'Sales': 853.65, 'Profit': 221.85}, {'Sales': 81.54, 'Profit': 38.3238}, {'Sales': 2605.392, 'Profit': -553.878}, {'Sales': 1232.28, 'Profit': 529.83}, {'Sales': 47.04, 'Profit': 17.4}, {'Sales': 16.2, 'Profit': -8.1}, {'Sales': 111.0, 'Profit': 9.9}, {'Sales': 47.68, 'Profit': 12.8}, {'Sales': 244.2, 'Profit': 29.25}, {'Sales': 42.28, 'Profit': 19.8716}, {'Sales': 428.34, 'Profit': 137.04}, {'Sales': 973.12, 'Profit': -24.38}, {'Sales': 16.056, 'Profit': -21.984}, {'Sales': 315.981, 'Profit': 49.131}, {'Sales': 464.97, 'Profit': 209.2365}, {'Sales': 755.0946, 'Profit': -419.3054}, {'Sales': 179.88, 'Profit': 53.88}, {'Sales': 91.824, 'Profit': -121.776}, {'Sales': 394.98, 'Profit': 15.78}, {'Sales': 425.91, 'Profit': 106.47}, {'Sales': 53.28, 'Profit': 4.74}, {'Sales': 37.68, 'Profit': 10.5504}, {'Sales': 7.56, 'Profit': 0.3024}, {'Sales': 84.784, 'Profit': -16.9568}, {'Sales': 16.56, 'Profit': 6.12}, {'Sales': 10.68, 'Profit': 0.3}, {'Sales': 39.92, 'Profit': 11.1776}, {'Sales': 357.3648, 'Profit': 124.8048}, {'Sales': 533.76, 'Profit': 0.0}, {'Sales': 47.64, 'Profit': 12.36}, {'Sales': 268.5, 'Profit': 72.48}, {'Sales': 459.3, 'Profit': 188.3}, {'Sales': 80.838, 'Profit': -1.962}, {'Sales': 173.94, 'Profit': 13.9152}, {'Sales': 103.2, 'Profit': 11.34}, {'Sales': 70.74, 'Profit': 33.24}, {'Sales': 81.54, 'Profit': 36.693}, {'Sales': 33.93, 'Profit': -22.62}, {'Sales': 106.56, 'Profit': 43.68}, {'Sales': 125.895, 'Profit': -75.705}, {'Sales': 58.2, 'Profit': 12.72}, {'Sales': 7.408, 'Profit': 1.2038}, {'Sales': 58.08, 'Profit': 3.96}, {'Sales': 166.536, 'Profit': 29.556}, {'Sales': 1058.58, 'Profit': 105.84}, {'Sales': 58.9548, 'Profit': -11.3652}, {'Sales': 17.73, 'Profit': 1.53}, {'Sales': 607.824, 'Profit': 60.744}, {'Sales': 558.576, 'Profit': -18.624}, {'Sales': 70.98, 'Profit': 34.7802}, {'Sales': 60.64, 'Profit': 27.8944}, {'Sales': 1719.807, 'Profit': 117.657}, {'Sales': 58.02, 'Profit': 6.36}, {'Sales': 115.6356, 'Profit': 40.3956}, {'Sales': 447.72, 'Profit': -286.65}, {'Sales': 131.84, 'Profit': -0.06}, {'Sales': 35.1, 'Profit': 12.6}, {'Sales': 86.94, 'Profit': 1.92}, {'Sales': 210.5685, 'Profit': 54.7185}, {'Sales': 21.024, 'Profit': 0.504}, {'Sales': 16.096, 'Profit': 5.2312}, {'Sales': 39.75, 'Profit': 1.59}, {'Sales': 57.6, 'Profit': 28.8}, {'Sales': 83.25, 'Profit': 14.985}, {'Sales': 82.08, 'Profit': 24.48}, {'Sales': 21.465, 'Profit': -47.235}, {'Sales': 42.784, 'Profit': 6.384}, {'Sales': 359.85, 'Profit': 147.51}, {'Sales': 141.75, 'Profit': 69.45}, {'Sales': 492.96, 'Profit': 29.52}, {'Sales': 80.46, 'Profit': -59.58}, {'Sales': 34.92, 'Profit': 1.02}, {'Sales': 8.37, 'Profit': 0.57}];
createScatterPlot("#chart-scatter", scatterData);