// Declare variables
const csvData = [];
const filteredRowList = [];
const excludedWords = new Set();
// let filteredRowLength = 0;

function initializeApp() {
    // Initalize app
    document.addEventListener('DOMContentLoaded', () => {
        loadCSVDataFromLocalStorage().forEach(row => csvData.push(row));
        // const filteredData = [...csvData];
    
        // If data exists
        if (csvData.length > 0) {
            // Populate Current File Text
            populateActiveFileElement();
            // Replace file picker with clear and export options
            swapFileOptions();
            excludedWords.clear()
            // Populate exludedWords set variable
            loadDataFromLocalStorage('excludedWords').forEach(({word, colIndex}) => {
                excludedWords.add({ word, colIndex });
            });
            updateExcludedWordsList();
        };
        filterDataWithExclusions();
        // renderTable(csvData);
    })
}

// FILE MANAGEMENT

function populateActiveFileElement(filteredRowLength) {
    filename = loadDataFromLocalStorage('filename');
    // filename = filename.length ? filename : "No File Active"
    fileInput = document.getElementById('currentFile');
    fileInput.innerHTML = filename;
    fileInputRows = document.getElementById('currentFileRows');
    fileInputRows.textContent = filteredRowLength;
    // fileInputRows.innerHTML = csvData.length ? csvData.length - 1: 0;
    // fileInput.className = 'p-2 m-2';
}

function loadCSV(file) {
    clearData();
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
}

function swapFileOptions() {
    csvController = document.getElementById('csvController');
    if (csvController.getElementsByTagName('input').length) {
        csvController.className = 'flex flex-row m-1 w-2/5'
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
        exportBtn.addEventListener('click', exportFilteredCSV);
        exportDiv.appendChild(exportBtn)
        csvController.appendChild(clearDiv);
        csvController.appendChild(exportDiv);    
    } else if (csvController.getElementsByTagName('div').length) {
        csvController.innerHTML = '';
        inputFile = document.createElement('input');
        inputFile.id = 'csvFileInput';
        inputFile.type = 'file';
        inputFile.accept=".csv";
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
    saveDataToLocalStorage('filename','No Active File');
    // document.getElementById('csvFileInput').value = null
    csvData.length = 0;
    renderTable(csvData);
    swapFileOptions();
    populateActiveFileElement();
    excludedWords.clear();
    localStorage.removeItem('excludedWords');
    updateExcludedWordsList();
}

function exportFilteredCSV() {
    let filename = loadDataFromLocalStorage('filename');
    filename = `${filename.replace('.csv','')}_filtered`;
    let tableData = filterTable(csvData, excludedWords);
    exportCSV(filename, tableData);
}

function exportCSV(filename, tableData) {
    const csvContent = tableData.map(row => row.map(value => {
        if (typeof value === 'string') {
            // Enclose string values in double quotes and escape double quotes inside
            return `"${value.replace(/"/g, '""')}"`;
        } else {
            // Convert non-string values to string and handle as needed
            return String(value);
        }
    }).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// TABLE FORMATTING

function rowSplit(row, delimiter) {
    // Parse a CSV line into an array of columns
    // Ensures that delimites within quotes aren't used to split the column
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
    // if (typeof value === 'set') {value=Array.from(value);}
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
    populateActiveFileElement(tableData.length);
    const tableContainer = document.getElementById('csvTableContainer');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    table.id = "csvTable";
    table.className = 'table-auto';
    tableData.forEach((row, rowIndex) => {
        const header = rowIndex===0 ? true : false
        table.appendChild(renderRow(row,rowIndex,header))
    }) 
    tableContainer.appendChild(table);
}

function renderRow(row, rowIndex, header=false) {
    rowColor = rowIndex % 2 ? 'bg-lime-100' : 'bg-lime-200';
    dtl_el = header ? 'th' : 'td' //detail element is table header or table detail
    const tr = document.createElement('tr');
    row.forEach((cell, colIndex) => {
        const td = document.createElement(dtl_el);
        td.className = `px-4 py-2 ${rowColor}`;
        // runs cell prep on cell if not header else runs header prep 
        const words = header ? headerPrep(cell) : cellPrep(cell, colIndex);
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

function cellSpan(cellContent) {
    const cellSpan = document.createElement('span');
    cellSpan.className = 'p-2';
    cellSpan.textContent = cellContent;
    return cellSpan;
}

// Function to prep cells for display
function cellPrep(cell, colIndex, trunc=2) {
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
                // const columnIndex = row.indexOf(cell); // Get the column index of the clicked word
                excludedWords.add({ word, colIndex }); // Add word and column index to excludedWords Set
                saveDataToLocalStorage('excludedWords',Array.from(excludedWords));
                updateExcludedWordsList();
                filterDataWithExclusions();
            });     
            out_arr.push(wordSpan);  
        });
    }
    return out_arr;
}

function sortColumns() {
    
}

function filterDataWithExclusions() {
    renderTable(filterTable(csvData, excludedWords));
}

function filterTable(tableData, wordList) {
    const filteredData = tableData.filter((row, rowIndex) => {
        // Skip filtering the header row (rowIndex === 0)
        if (rowIndex === 0) {
            return true; // Keep the header row in the filtered data
        }

        // Check if any excluded word exists in the current row
        const shouldIncludeRow = !Array.from(wordList).some(wordItem => {
            const { word, colIndex } = wordItem;
            return row[colIndex] ? row[colIndex].toLowerCase().includes(word.toLowerCase()): '';
        });

        return shouldIncludeRow;
    });
    return filteredData
}

// OUTPUT TO SCREEN
function updateExcludedWordsList() {
    const excludedWordsList = document.getElementById('excludedWordsList');
    excludedWordsList.innerHTML = '';
    const excludedWordsText = document.createElement('h3')
    excludedWordsText.textContent = 'Excluded Words:';
    excludedWordsText.className = 'p-2 m-2 w-1/5 rounded-md border border-gray-500';
    excludedWordsList.appendChild(excludedWordsText);
    excludedWords.forEach(item => {
        // const {word, colIndex} = item;
        const wordElement = document.createElement('div');
        wordElement.textContent = `${item.word} (${csvData[0][item.colIndex]})`; // Display word with column association
        wordElement.className = 'p-2 m-2 w-1/5 bg-amber-300 rounded-md';
        wordElement.addEventListener('click', event => {
            excludedWords.delete(item);
            updateExcludedWordsList();
            saveDataToLocalStorage('excludedWords',Array.from(excludedWords));
            filterDataWithExclusions();
        });
        excludedWordsList.appendChild(wordElement);
    });

}

initializeApp()

// EVENT LISTENERS
document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    loadCSV(file);
    populateActiveFileElement();

}); 

