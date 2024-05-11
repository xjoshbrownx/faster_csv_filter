// Declare variables
const csvData = [];
const filteredRowList = [];
const excludedWords = new Set();
let mainColor = 'slate';
let accentColor = 'amber';
let warningColor = 'red';
let rounded = 'rounded-md';
let border = 'border border-gray-500';
let overflow = 'overflow-x-scroll';
let brightness = 400;
let contrast = 200;
const color_choices = ['Zinc','Yellow','Violet','Teal','Stone','Slate','Sky','Rose','Red','Purple','Pink','Orange','Neutral','Lime','Indigo','Green','Gray','Fuchsia','Emerald','Cyan','Blue','Amber'];

// ADD INDEX FUNCTIONALITY
// let filteredRowLength = 0;

function initializeApp() {
    // Initalize app
    document.addEventListener('DOMContentLoaded', () => {
        fileManagementUI();
        loadCSVData().forEach(row => csvData.push(row));
        // const filteredData = [...csvData];
        
        // If data exists
        if (csvData.length > 0) {
            // Populate Current File Text
            populateActiveFileElement();
            // Replace file picker with clear and export options
            swapFileOptions();
            excludedWords.clear()
            // Populate exludedWords set variable
            
            const loadedWords = loadDataFromLocalStorage('excludedWords')
            if (loadedWords.length) {loadedWords.forEach(({word, colIndex}) => {
                excludedWords.add({ word, colIndex });
            });}
        };
        updateExcludedWordsList();
        filterDataWithExclusions();
        // renderTable(csvData);
    })
}

// FILE MANAGEMENT

function populateActiveFileElement(filteredRowLength) {
    filename = loadDataFromLocalStorage('filename');
    // filename = filename.length ? filename : "No File Active"
    fileInput = document.getElementById('currentFile');
    fileInput.textContent = filename;
    fileInputRows = document.getElementById('currentFileRows');
    fileInputRows.textContent = `${filteredRowLength} rows of `;
    originalFileRows = document.getElementById('originalFileRows');
    originalFileRows.textContent = csvData.length;
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
        storeCSVData(csvData);
        renderTable(csvData);
    };
    reader.readAsText(file);
    populateActiveFileElement();
}

function swapFileOptions() {
    const csvController = document.getElementById('csvController');
    if (csvController.getElementsByTagName('input').length) {
        csvController.className = 'flex flex-row m-1 w-2/5'
        csvController.innerHTML = '';
        clearDiv = document.createElement('div');
        clearDiv.className = `m-1 w-1/2 m-2 ${border} ${rounded}`;
        clearBtn = document.createElement('button');
        clearBtn.id = 'clearData'
        clearBtn.className = 'p-2 m-2'
        clearBtn.textContent = 'Clear Data'
        clearBtn.addEventListener('click', clearData);
        clearDiv.appendChild(clearBtn)
        exportDiv = document.createElement('div');
        exportDiv.className = `m-1 w-1/2 m-2 ${border} ${rounded}`;
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
        const inputFile = document.createElement('input');
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

// clears filename, csvdata, excluded words from local storage and from page
function clearData() {
    localStorage.removeItem('csvData'); // Remove CSV data from localStorage
    saveDataToLocalStorage('filename','No Active File');
    localStorage.removeItem('excludedWords');
    // document.getElementById('csvFileInput').value = null
    csvData.length = 0;
    excludedWords.clear();
    renderTable(csvData);
    swapFileOptions();
    populateActiveFileElement();
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

// LOCAL STORAGE FUNCTIONS


// if csv exists load CSV data from localStorage 
// else returns empty array
function loadDataFromLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : []
}

// Function to save CSV data to localStorage 
function saveDataToLocalStorage(key, value) {
    // if (typeof value === 'set') {value=Array.from(value);}
    localStorage.setItem(key, JSON.stringify(value));
}

function saveSetToLocalStorage(name, setData) {
    saveDataToLocalStorage(name,Array.from(setData));
}

function loadSetFromLocatStorage(name) {
    const loadedSet = loadDataFromLocalStorage(name)
    const outSet = new Set();
    if (loadedSet.length) {loadedSet.forEach(({key, value}) => {
        outSet.add({ key, value });
    });}
    return outSet;
}

// Function to load CSV data from localStorage 
// if csv exists else returns empty array
function loadArrayFromLocalStorage(name) {
    const storedData = localStorage.getItem(name);
    return storedData ? JSON.parse(storedData) : []
}

function saveArrayToLocalStorage(name, arrData) {
    // if (typeof value === 'set') {value=Array.from(value);}
    localStorage.setItem(name, JSON.stringify(arrData));
}

// Function to load CSV data from localStorage 
// if csv exists else returns empty array
function loadCSVData() {
    const storedData = localStorage.getItem('csvData');
    return storedData ? JSON.parse(storedData) : []
}

// Function to save CSV data to localStorage 
function storeCSVData(data) {
    localStorage.setItem('csvData', JSON.stringify(data));
}

function storeExcludedWords() {
    saveDataToLocalStorage('excludedWords',Array.from(excludedWords));
}

// HTML RENDERING AND CONTROL

function fileManagementUI() {
    const body = document.getElementsByTagName('body');
    const headerContainer = headerContainerUI();
    const excludeModule = excludeModuleUI();
    const csvTableContainer = csvTableContainerUI();

    // ASSEMBLE STRUCTURE    
    body[0].appendChild(headerContainer);
    body[0].appendChild(excludeModule);
    body[0].appendChild(csvTableContainer);
}

function moduleInstance(id, classNameText) {
    const headerContainer = document.getElementById('headerContainer');
    const moduleOuter = document.createElement('div');
    moduleOuter.id = id;
    className = classNameText ? classNameText : `p-4 m-4 w-11/12 flex justify-between flex-row ${border} ${rounded}`;
    moduleOuter.className = className;
    headerContainer.appendChild(moduleOuter);
    return moduleOuter;

} 

function headerContainerUI() {
    const headerContainer = document.createElement('div');
    headerContainer.id = 'headerContainer';
    headerContainer.className = `bg-${mainColor}-${getLowClrVal()} p-4 m-4 w-11/12 ${rounded}`;
    const controllerContainer = document.createElement('div');
    controllerContainer.id = "controllerContainer";
    controllerContainer.className = "flex flex-row items-center"; 
    const csvController = csvControllerUI();
    const currentFileContainer = currentFileContainerUI();
    const toolsContainer = toolsContainerUI();
    // ASSEMBLE STRUCTURE 

    controllerContainer.appendChild(csvController);
    controllerContainer.appendChild(currentFileContainer);
    headerContainer.appendChild(controllerContainer);
    headerContainer.appendChild(toolsContainer);
    return headerContainer;
}

function toolsContainerUI() {
    const toolContainer = document.createElement('div');
    toolContainer.id = "toolContainer";
    toolContainer.className = "flex flex-row items-center"; 
    // const hideColumnBtn = document.createElement('div');
    // hideColumnBtn.id = 'hideColumnBtn';
    // hideColumnBtn.className = 'p-2 m-2';
    // hideColumnBtn.textContent = 'Hide Column';
    const hideColumnBtn = toolBtnGen('hideColumnBtn','w-1/5','Show/Hide Columns',hideColAction);
    const optionsBtn = toolBtnGen('optionsBtn','w-1/5','Options',optionBtnAction);
    const addModuleBtn = toolBtnGen('addModuleBtn','w-1/5','Add Module',addModuleBtnAction);    
    toolContainer.appendChild(hideColumnBtn);
    toolContainer.appendChild(optionsBtn);
    toolContainer.appendChild(addModuleBtn);
    return toolContainer;
}

function optionBtnAction() {
    //ADD CODE TO TAKE ACTION ON OPTIONS
    const headerContainer = document.getElementById('headerContainer');
    const optionContainer = document.createElement('div');
    optionContainer.className = 'flex flex-row items-center overflow-wrap';
    optionContainer.id = 'optionContainer';
    const pickMainClrBtn = toolBtnGen('pickMainClrBtn','w-1/5','Main Color', pickMainClrAction);
    const pickAccentClrBtn = toolBtnGen('pickAccentClrBtn','w-1/5','Accent Color', pickAccentClrAction);
    optionContainer.appendChild(pickMainClrBtn);
    optionContainer.appendChild(pickAccentClrBtn);
    headerContainer.appendChild(optionContainer);
    return '';
}

function pickAccentClrAction() {
    console.log('pick accent color btn');
    return '';
}

function pickMainClrAction() {
    console.log('pick main color btn');
    return '';
}


function pickColorUI() {
    const pickColor = document.createElement('div');
    pickColor.id = 'pickClrContainer';
    pickColor.className = 'flex flex-row items-center overflow-wrap w-11/12'
    color_choices.forEach(color => {
        pickColor.appendChild(colorBtn(color));
    });
    return pickColor;
}

function colorChoiceUI(color, callback) {
    const colorBtn = document.createElement('button');
    colorBtn.className = `rounded-full bg-${color}-500`;
    colorBtn.id = `colorBtn-${color}`;
    colorBtn.addEventListener('click', callback);
    return colorBtn;

}

function hideColAction() {
    return ''
}

function addModuleBtnAction() {
    return ''
}

function refreshColors(newColor, newBrightness, newContrast) {
    let oldLowClr = `bg-${mainColor}-${getLowClrVal()}`;
    let oldMidClr = `bg-${mainColor}-${getMidClrVal()}`;
    let oldHighClr = `bg-${mainColor}-${getHighClrVal()}`;
    let newLowClr = `bg-${newColor}-${newBrightness-newContrast}`;
    let newMidClr = `bg-${newColor}-${newBrightness}`;
    let newHighClr = `bg-${newColor}-${newBrightness+newContrast}`;

    lowList = document.getElementsByClassName(oldLowClr);
    midList = document.getElementsByClassName(oldMidClr);
    highList = document.getElementsByClassName(oldHighClr);

    if (lowList) Array.from(lowList).forEach(element => {
        element.className = element.className.replace(oldLowClr,newLowClr);
    })
    if (midList) Array.from(midList).forEach(element => {
        element.className = element.className.replace(oldMidClr,newMidClr);
    })
    if (highList) Array.from(highList).forEach(element => {
        element.className = element.className.replace(oldHighClr,newHighClr);
    })
    mainColor = newColor;
    brightness = newBrightness;
    contrast = newContrast;
}

function toolBtnGen(id, width, label,callback) {
    const div = document.createElement('div');;
    div.className = `m-2 ${width} bg-${mainColor}-${getMidClrVal()} ${border} ${rounded}`;
    const button = document.createElement('button');
    button.id = id;
    button.className = '"p-2 m-2';
    button.textContent = label;
    button.addEventListener('click', function(event) {
        callback();
    });
    div.appendChild(button);
    return div;
}

function csvControllerUI() {
    const csvController = document.createElement('div');
    csvController.id = 'csvController';
    csvController.className = `m-1 w-2/5 ${rounded}`;
    const csvFileInput = document.createElement('input');
    csvFileInput.id = 'csvFileInput';
    csvFileInput.type = 'file';
    csvFileInput.accept=".csv";
    csvFileInput.className = 'p-2 m-2';
    csvFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        loadCSV(file);
        populateActiveFileElement();
    });
    csvController.appendChild(csvFileInput);
    return csvController;
}

function currentFileContainerUI() {
    const currentFileContainer = document.createElement('div');
    currentFileContainer.id = 'currentFileContainer';
    currentFileContainer.className = `"m-1 w-3/5 bg-${mainColor}-${getHighClrVal()} flex justify-between ${rounded}`;
    const currentFileTextLeft = document.createElement('div');
    currentFileTextLeft.id = 'currentFileTextLeft';
    currentFileTextLeft.className = `justify-self-start p-2 m-2`;
    const currentFile = document.createElement('p');
    currentFile.id = 'currentFile';
    currentFile.textContent = 'No Active File';
    const currentFileTextRight = document.createElement('div');
    currentFileTextRight.id = 'currentFileTextRight';
    currentFileTextRight.className = `justify-self-end p-2 m-2`;
    const p = document.createElement('p');
    const currentFileRows = document.createElement('span');
    currentFileRows.id = 'currentFileRows';
    const span = document.createElement('span');
    const originalFileRows = document.createElement('span');
    originalFileRows.id = 'originalFileRows';
    // ASSEMBLE STRUCTURE
    currentFileTextLeft.appendChild(currentFile);
    p.appendChild(currentFileRows);
    p.appendChild(span);
    p.appendChild(originalFileRows);
    currentFileTextRight.appendChild(p);
    currentFileContainer.appendChild(currentFileTextLeft);
    currentFileContainer.appendChild(currentFileTextRight);
    return currentFileContainer;    
}

function excludeModuleUI() {
    const excludeModule = document.createElement('div');
    excludeModule.id = 'excludemodule';
    excludeModule.className = `p-4 m-4 w-11/12 flex justify-between flex-row ${border} ${rounded}`;
    const excludedWordsList = document.createElement('div');
    excludedWordsList.id = 'excludedWordsList';
    excludedWordsList.className = 'w-4/5 flex py-2 flex-wrap';
    const excludedControls = document.createElement('div');
    excludedControls.id = 'excludedControls';
    excludedControls.className = `w/1/5 flex flex-col py-2 items-center ${border} ${rounded}`;
    excludeModule.appendChild(excludedWordsList);
    excludeModule.appendChild(excludedControls);
    return excludeModule;
}

function csvTableContainerUI() {
    const csvTableContainer = document.createElement('div');
    csvTableContainer.id = 'csvTableContainer';
    csvTableContainer.className = `p-4 m-4 w-11/12 ${overflow} ${rounded}`;
    return csvTableContainer;
}

function getLowClrVal() {
    return brightness - contrast;
}

function getHighClrVal() {
    return brightness + contrast;
}

function getMidClrVal() {
    return brightness;
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
// Function to render table to html on page
function renderTable(tableData, page) {
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
    rowColor = rowIndex % 2 ? `bg-${mainColor}-${getLowClrVal()-100}` : `bg-${mainColor}-${getLowClrVal()}`;
    dtl_el = header ? 'th' : 'td' //detail element is table header or table detail
    const tr = document.createElement('tr');
    row.forEach((cell, colIndex) => {
        const td = document.createElement(dtl_el);
        td.className = `text-left px-4 py-2 ${rowColor}`;
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
                wordSpan.className = `p-2 border bg-${mainColor}-${getMidClrVal()} ${rounded}` //OPTIONS
            });
            wordSpan.addEventListener('mouseout', () => {
                // wordSpan.style.backgroundColor = ''; // Remove highlight on mouseout
                wordSpan.className = 'p-2'
            });
            wordSpan.addEventListener('click', () => {
                // const columnIndex = row.indexOf(cell); // Get the column index of the clicked word
                excludedWords.add({ word, colIndex }); // Add word and column index to excludedWords Set
                // saveDataToLocalStorage('excludedWords',Array.from(excludedWords));
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

// filter function used for display
function filterDataWithExclusions() {
    renderTable(filterTable(csvData, excludedWords));
}

// generic table filtering function used for both display and export
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
    const excludedControls = document.getElementById('excludedControls');
    excludedWordsList.innerHTML = '';
    excludedControls.innerHTML = '';
    const excludedWordsText = sidebarBtnGen('h3','Excluded Words:', `bg-${mainColor}-${getMidClrVal()}`);
    excludedWordsList.appendChild(excludedWordsText);
    excludedWords.forEach(item => {
        // const {word, colIndex} = item;
        let text = `${item.word} (${csvData[0][item.colIndex]})`;
        let eventFunc = wordElementLogic(item);
        const wordElement = sidebarBtnGen('div',text, `bg-${accentColor}-${getLowClrVal()}`, '', 'click', eventFunc);
        excludedWordsList.appendChild(wordElement);
    });
    if (excludedWords.size) {
        exportExclude = sidebarBtnGen('div','Export List',`bg-${mainColor}-${getMidClrVal()}`,'','click',exportExcludeWords);
        clearExclude = sidebarBtnGen('div','Clear List',`bg-${warningColor}-500`,'','click',clearExcludeWords);
        excludedControls.appendChild(exportExclude);
        excludedControls.appendChild(clearExclude);
    } else {
            const importExclude = document.createElement('input');
            importExclude.id = 'excludeListInput';
            importExclude.type = 'file';
            importExclude.accept=".csv";
            importExclude.textContent = 'Import Excluded Words List';
            importExclude.className = `p-2 m-2 ${rounded}`;
            importExclude.addEventListener('change', function(event) {
                const file = event.target.files[0];
                importExcludeWords(file);
            }); 
            excludedControls.appendChild(importExclude);  
    };
}

// converts excluded words to an array for csv export
function excludedWordsToArray(setOfObjects) {
    // Convert set of objects to array of arrays
    return Array.from(setOfObjects, obj => [obj.word, obj.colIndex]);
}

function arrayOfArraysToSet(arrayOfArrays) {
    // Convert array of arrays to set of objects
    const setOfObjects = new Set(arrayOfArrays.map(arr => ({ prop1: arr[0], prop2: arr[1] })));
    return setOfObjects;
}

function clearExcludeWords() {
    excludedWords.clear();
    localStorage.removeItem('excludedWords');
    updateExcludedWordsList();
    filterDataWithExclusions();
}

function importExcludeWords(file){
    const reader = new FileReader();
    reader.onload = function(event) {
        const file = []
        const csv = event.target.result;
        csvSplit = csv.split('\n');
        csvSplit.map(row => file.push(rowSplit(row,','))); // OPTIONS DELIMITER IS FLEXIBLE
        file.forEach((item) => {
            [word, colIndex] = item;
            console.log(word);
            console.log(colIndex);
            excludedWords.add({ word, colIndex });
        });
        storeExcludedWords();
        updateExcludedWordsList();
    };
    reader.readAsText(file);


}

function exportExcludeWords(){
    const csvPrep = [];
    excludedWords.forEach(word => {
        csvPrep.push(word);
    });
    let filename = loadDataFromLocalStorage('filename');
    filename = `${filename.replace('.csv','')}_excludes`;
    exportCSV(filename, excludedWordsToArray(csvPrep));
}

function wordElementLogic(item) {
    return function(event) {
        excludedWords.delete(item);
        updateExcludedWordsList();
        storeExcludedWords();
        filterDataWithExclusions(); 
    };
}

function sidebarBtnGen(type, text, color='bg-amber-100', className='', event='', func='') {
    const wordButton = document.createElement(type);
    wordButton.textContent = text; 
    wordButton.className = className ? className : `px-3 py-2 my-2 mx-4 items-center ${color} ${rounded}`;
    if (event) {
        wordButton.addEventListener(event, func);
    }
    return wordButton;
}

initializeApp()

 

// LEFTOVERS

// function colorChange(color) {
//     headerContainer = getElementById("headerContainer");
//     headerContainer.className = `bg-${color}-200 p-4 m-4 w-11/12 ${rounded}`;
//     currentFileContainer = getElementById("currentFileContainer");
//     currentFileContainer.className = `bg-${color}-600 m-1 w-3/5 flex justify-between ${rounded}`
// }
