class ChartConfig {
    heightInput = document.getElementById("height-input");
    widthInput = document.getElementById("width-input");
    marginInput = document.getElementById("margin-input");
    categoryInput = document.getElementById("category-input");
    valueInput = document.getElementById("value-input");
    addDataButton = document.getElementById("add-data-button");
    createNewChartButton = document.getElementById("create-new-chart-button");
    additionalChartsContainer = document.getElementById(
      "additional-charts-container"
    );
    labelXInput = document.getElementById("label-x-input");
    labelYInput = document.getElementById("label-y-input");
    margin = { top: 20, right: 30, bottom: 30, left: 40 };
    width = 1000 - this.margin.left - this.margin.right;
    height = 600 - this.margin.top - this.margin.bottom;

    loadConfigEvents(chartReference) {
        this.heightInput.addEventListener('change', (e) => {
            const newHeight = parseInt(e.target.value);
            if (!isNaN(newHeight)) {
                this.height = newHeight - this.margin.top - this.margin.bottom;
                chartReference.create("#chart", chartReference.data, { height: this.height + this.margin.top + this.margin.bottom });
            }
        });

        this.widthInput.addEventListener('change', (e) => {
            const newWidth = parseInt(e.target.value);
            if (!isNaN(newWidth)) {
                this.width = newWidth - this.margin.left - this.margin.right;
                chartReference.create("#chart", chartReference.data, { width: this.width + this.margin.left + this.margin.right });
            }
        });

        this.marginInput.addEventListener('change', (e) => {
            const newMargin = parseInt(e.target.value);
            if (!isNaN(newMargin)) {
                this.margin = { top: newMargin, right: newMargin, bottom: newMargin, left: newMargin };
                chartReference.create("#chart", chartReference.data, { margin: this.margin });
            }
        });

        this.labelXInput.addEventListener('change', (e) => {
            chartReference.create("#chart", chartReference.data, { labelX: e.target.value, labelY: chartReference.labelYInput.value });
        });

        this.labelYInput.addEventListener('change', (e) => {
            chartReference.create("#chart", chartReference.data, { labelY: e.target.value, labelX: chartReference.labelXInput.value });
        });


      //   this.addDataButton.addEventListener('click', () => {
      //     const newCategory = this.categoryInput.value.trim();
      //     const newValue = parseFloat(this.valueInput.value);
      
      //     if (newCategory && !isNaN(newValue)) {
      //         const existingData = chartReference.data.find(d => d.category === newCategory);
      //         if (existingData) {
      //             existingData.value = newValue;
      //         } else {
      //             chartReference.data.push({ category: newCategory, value: newValue });
      //         }        
      //         chartReference.create("#chart", chartReference.data, { width: this.width + this.margin.left + this.margin.right, height: this.height + this.margin.top + this.margin.bottom, margin: this.margin });
      
      //         // Limpar os inputs
      //         this.categoryInput.value = '';
      //         this.valueInput.value = '';
      //     } else {
      //         alert("Por favor, insira uma categoria válida e um valor numérico.");
      //     }
      // });
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
    }

}