// declare variables
const csvData = [];

// initalize app
document.addEventListener('DOMContentLoaded', () => {
    csvData.length = 0;
    loadCSVDataFromLocalStorage().forEach(row => csvData.push(row));
    populateActiveFileElement();
    renderTable(csvData);
})

// FILE MANAGEMENT

function populateActiveFileElement() {
    filename = loadDataFromLocalStorage('filename');
    // filename = filename.length ? filename : "No File Active"
    fileInput = document.getElementById('currentFile');
    fileInput.innerHTML = filename;
    // fileInput.className = 'p-2 m-2';
}

function loadCSV(file) {
    filename = file.name;
    saveDataToLocalStorage('filename',filename);
    const reader = new FileReader();
    reader.onload = function(event) {
        const csv = event.target.result;
        csvData.length = 0;
        csvSplit = csv.split('\n')
        csvSplit.map(row => csvData.push(rowSplit(row,','))); // OPTIONS DELIMITER IS FLEXIBLE
        saveCSVDataToLocalStorage(csvData);
        renderTable(csvData);
    };
    reader.readAsText(file);
    populateActiveFileElement();
    swapFileOptions();
}

function swapFileOptions() {
    csvController = document.getElementById('csvController');
    if (csvController.getElementsByTagName('input').length) {
        csvController.className = 'flex flex-row m-1 w-2/5'
        console.log('was input');
        csvController.innerHTML = '';
        clearDiv = document.createElement('div');
        clearDiv.className = "m-1 w-1/2 m-2 border border-gray-500 rounded-md";
        clearBtn = document.createElement('button');
        clearBtn.id = 'clearData'
        clearBtn.className = 'p-2 m-2'
        clearBtn.textContent = 'Clear Data'
        clearBtn.addEventListener('click', clearData);
        clearDiv.appendChild(clearBtn)
        exportDiv = document.createElement('div');
        exportDiv.className = "m-1 w-1/2 m-2 border border-gray-500 rounded-md";
        exportBtn = document.createElement('button');   
        exportBtn.id = 'exportData'
        exportBtn.className = 'p-2 m-2'
        exportBtn.textContent = 'Export CSV'
        exportBtn.addEventListener('click', exportData);
        exportDiv.appendChild(exportBtn)
        csvController.appendChild(clearDiv);
        csvController.appendChild(exportDiv);    
    } else if (csvController.getElementsByTagName('div').length) {
        console.log('was div');
        csvController.innerHTML = '';
        inputFile = document.createElement('input');
        inputFile.id = 'csvFileInput';
        inputFile.className = 'p-2 m-2';
        inputFile.addEventListener('change', function(event) {
            const file = event.target.files[0];
            loadCSV(file);
            populateActiveFileElement();
        }); 
        csvController.appendChild(inputFile);        
    }
    
}

function clearData() {
    localStorage.removeItem('csvData'); // Remove CSV data from localStorage
    localStorage.removeItem('filename');
    // document.getElementById('csvFileInput').value = null
    csvData.length = 0;
    populateActiveFileElement();
    renderTable(csvData);
    swapFileOptions();

    // excludedWords.clear();
    // updateExcludedWordsList();
}

function exportData() {
    // DATA to be exported from stored table and rerun through excluded word filters
}

// TABLE FORMATTING

function rowSplit(row, delimiter) {
    // Parse a CSV line into an array of columns
    const columns = [];
    let currentColumn = '';
    let withinQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"') {
            // Toggle the withinQuotes flag when encountering a quote
            withinQuotes = !withinQuotes;
        } else if (char === delimiter && !withinQuotes) {
            // Push current column to columns array when encountering a delimiter outside quotes
            columns.push(currentColumn.trim());
            currentColumn = ''; // Reset current column
        } else {
            // Append character to current column
            currentColumn += char;
        }
    }

    // Push the last column (or the only column if no delimiters found)
    columns.push(currentColumn.trim());

    return columns;
}

// Function to load CSV data from localStorage 
// if csv exists else returns empty array
function loadDataFromLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : []
}

// Function to save CSV data to localStorage 
function saveDataToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}


// Function to load CSV data from localStorage 
// if csv exists else returns empty array
function loadCSVDataFromLocalStorage() {
    const storedData = localStorage.getItem('csvData');
    return storedData ? JSON.parse(storedData) : []
}

// Function to save CSV data to localStorage 
function saveCSVDataToLocalStorage(data) {
    localStorage.setItem('csvData', JSON.stringify(data));
}

// Function to 
function renderTable(tableData) {
    const table = document.getElementById('csvTable');
    table.innerHTML = '';
    tableData.forEach((row, rowIndex) => {
        const header = rowIndex===0 ? true : false
        table.appendChild(renderRow(row,header))
    }) 
}

function renderRow(row, header=false) {
    dtl_el = header ? 'th' : 'td' //detail element is table header or table detail
    const tr = document.createElement('tr');
    row.forEach((cell, colIndex) => {
        const td = document.createElement(dtl_el);
        td.className = 'px-4 py-2';
        // runs cell prep on cell if not header else runs header prep 
        const words = header ? headerPrep(cell) : cellPrep(cell);
        // const words = cell;
        words.forEach(word => td.appendChild(word));
        tr.appendChild(td);
    });
    return tr
}

function headerPrep(cell) {
    const out_arr = []
    headerSpan = document.createElement('span');
    headerSpan.addEventListener('click',sortColumns);     
    headerSpan.className = 'p-2'
    headerSpan.textContent = cell
    out_arr.push(headerSpan)
    return out_arr;
}

function sortColumns() {
    
}

function cellSpan(cellContent) {
    const cellSpan = document.createElement('span');
    cellSpan.textContent = word;
    cellSpan.className = 'p-2';
    cellSpan.textContent = cellContent;
    return cellSpan;
}

// Function to prep cells for display
function cellPrep(cell, trunc=2, hl_clr='lightblue') {
    const out_arr = []
    if (typeof (cell) === "number") {
        if (!isNaN(cell.trim())) {
            let value = parseFloat(column.trim()).toFixed(trunc);
            
            // Check if the value ends with .00 (indicating no decimal places)
            if (value.endsWith('.00')) {
                value = parseInt(value)
                out_arr.push(cellSpan(value)); // Convert to integer
                return out_arr;
            } else {
                out_arr.push(cellSpan(value)); // Keep as float with two decimal places
                return out_arr;
            }
        } 
    } else if (typeof (cell) === "string") {
        const words = cell.split(' '); // Split cell content into words
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.className = 'p-2';

            // Add hover effect, click-to-exclude, and drag capability to words
            wordSpan.style.cursor = 'pointer'; // Set cursor to pointer for clickable effect
            wordSpan.addEventListener('mouseover', () => {
                // wordSpan.style.backgroundColor = '#ed8936'; // Highlight on hover
                wordSpan.className = "p-2 border bg-lime-300 rounded-md" //OPTIONS
            });
            wordSpan.addEventListener('mouseout', () => {
                // wordSpan.style.backgroundColor = ''; // Remove highlight on mouseout
                wordSpan.className = 'p-2'
            });
            wordSpan.addEventListener('click', () => {
                const columnIndex = row.indexOf(cell); // Get the column index of the clicked word
                excludedWords.add({ word, columnIndex }); // Add word and column index to excludedWords Set
                updateExcludedWordsList();
                filterDataWithExclusions();
            });     
            out_arr.push(wordSpan);  
        });
    }
    return out_arr;
}

// EVENT LISTENERS

document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    loadCSV(file);
    populateActiveFileElement();

}); 

