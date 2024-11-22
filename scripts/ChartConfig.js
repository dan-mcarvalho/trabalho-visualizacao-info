class ChartConfig {
    heightInput = document.getElementById("height-input")
    widthInput = document.getElementById("width-input")
    marginInput = document.getElementById("margin-input")
    categoryInput = document.getElementById("category-input");
    valueInput = document.getElementById("value-input");
    addDataButton = document.getElementById("add-data-button");
    createNewChartButton = document.getElementById("create-new-chart-button");
    additionalChartsContainer = document.getElementById(
      "additional-charts-container"
    );
    labelXInput = document.getElementById("label-x-input")
    labelYInput = document.getElementById("label-y-input")
    margin = { top: 20, right: 30, bottom: 30, left: 40 };
    width = 1000 - this.margin.left - this.margin.right;
    height = 600 - this.margin.top - this.margin.bottom;
    csvUploadInput = document.getElementById('csv-input');

    loadConfigEvents(chartReference) {
        this.heightInput.addEventListener('change', (e) => {
            const newHeight = parseInt(e.target.value);
            if (!isNaN(newHeight)) {
                this.height = newHeight - this.margin.top - this.margin.bottom;
                chartReference.create("#chart", chartReference.data, { 
                    width: this.width + this.margin.left + this.margin.right,
                    height: this.height + this.margin.top + this.margin.bottom,
                    margin: this.margin,
                    labelX: this.labelXInput.value,
                    labelY: this.labelYInput.value
                });
            }
        });

        this.widthInput.addEventListener('change', (e) => {
            const newWidth = parseInt(e.target.value);
            if (!isNaN(newWidth)) {
                this.width = newWidth - this.margin.left - this.margin.right;
                chartReference.create("#chart", chartReference.data, { 
                    width: this.width + this.margin.left + this.margin.right,
                    height: this.height + this.margin.top + this.margin.bottom,
                    margin: this.margin,
                    labelX: this.labelXInput.value,
                    labelY: this.labelYInput.value
                });
            }
        });

        this.marginInput.addEventListener('change', (e) => {
            const newMargin = parseInt(e.target.value);
            if (!isNaN(newMargin)) {
                this.margin = { top: newMargin, right: newMargin, bottom: newMargin, left: newMargin };
                chartReference.create("#chart", chartReference.data, { 
                    width: this.width + this.margin.left + this.margin.right,
                    height: this.height + this.margin.top + this.margin.bottom,
                    margin: this.margin,
                    labelX: this.labelXInput.value,
                    labelY: this.labelYInput.value
                });
            }
        });

        this.labelXInput.addEventListener('change', (e) => {
            chartReference.create("#chart", chartReference.data, { 
                width: this.width + this.margin.left + this.margin.right,
                height: this.height + this.margin.top + this.margin.bottom,
                margin: this.margin,
                labelX: e.target.value,
                labelY: this.labelYInput.value 
            });
        });

        this.labelYInput.addEventListener('change', (e) => {
            chartReference.create("#chart", chartReference.data, { 
                width: this.width + this.margin.left + this.margin.right,
                height: this.height + this.margin.top + this.margin.bottom,
                margin: this.margin,
                labelX: this.labelXInput.value,
                labelY: e.target.value
            });
        });


        // this.csvUploadInput.addEventListener('change', this.handleFileSelect());

        this.csvUploadInput.addEventListener('change', (event) => this.handleFileSelect(event, chartReference));
        
    }

    readCSV(file, chartReference) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csv = reader.result;
            chartReference.parseCSV(csv);
        };
        reader.onerror = function (e) {
            console.error('Error reading file:', e);
        };
        reader.readAsText(file);
    } 

    handleFileSelect(event, chartReference) {
        if(!event) return;
        const file = event.target.files[0];
        if (file) {
            this.readCSV(file, chartReference);
        } else {
            alert('Nenhum arquivo selecionado.');
        }
    }

    remove() {
      const newHeightInput = this.heightInput.cloneNode(true);
      this.heightInput.parentNode.replaceChild(newHeightInput, this.heightInput);
      this.heightInput = newHeightInput;

      const newWidthInput = this.widthInput.cloneNode(true);
      this.widthInput.parentNode.replaceChild(newWidthInput, this.widthInput);
      this.widthInput = newWidthInput;

      const newLabelXInput = this.labelXInput.cloneNode(true);
      this.labelXInput.parentNode.replaceChild(newLabelXInput, this.labelXInput);
      this.labelXInput = newLabelXInput;

      const newLabelYInput = this.labelYInput.cloneNode(true);
      this.labelYInput.parentNode.replaceChild(newLabelYInput, this.labelYInput);
      this.labelYInput = newLabelYInput;

      const newAddDataButton = this.addDataButton.cloneNode(true);
      this.addDataButton.parentNode.replaceChild(newAddDataButton, this.addDataButton);
      this.addDataButton = newAddDataButton;

      const newCsvUploadInput = this.csvUploadInput.cloneNode(true);
      this.csvUploadInput.parentNode.replaceChild(newCsvUploadInput, this.csvUploadInput);
      this.csvUploadInput = newCsvUploadInput;
    }

}