// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Load CSV data from localStorage on page load
    csvData = loadCSVDataFromLocalStorage();
    renderTable(csvData);
});

// let csvData = [];

function loadCSV(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csv = event.target.result;
        csvData = csv.split('\n').map(row => row.split(','));
        saveCSVDataToLocalStorage(csvData); // Save CSV data to localStorage
        renderTable(csvData);
    };
    reader.readAsText(file);
}

function renderTable(data) {
    const table = document.getElementById('csvTable');
    table.innerHTML = '';

    // Create table header row with clickable column headers
    const headerRow = document.createElement('tr');
    data[0].forEach((cell, colIndex) => {
        const th = document.createElement('th');
        th.textContent = cell;
        th.className = 'px-4 py-2'
        th.style.cursor = 'pointer'; // Set cursor to pointer for clickable effect
        th.addEventListener('click', () => toggleColumnFilter(colIndex));
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create table rows with data
    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.className = 'px-4 py-2'
            const words = cell.split(' '); // Split cell content into words
            words.forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word;

                // Add hover effect, click-to-exclude, and drag capability to words
                wordSpan.style.cursor = 'pointer'; // Set cursor to pointer for clickable effect
                wordSpan.addEventListener('mouseover', () => {
                    wordSpan.style.backgroundColor = 'lightyellow'; // Highlight on hover
                });
                wordSpan.addEventListener('mouseout', () => {
                    wordSpan.style.backgroundColor = ''; // Remove highlight on mouseout
                });
                wordSpan.addEventListener('click', () => {
                    const columnIndex = row.indexOf(cell); // Get the column index of the clicked word
                    excludedWords.add({ word, columnIndex }); // Add word and column index to excludedWords Set
                    updateExcludedWordsList();
                    filterDataWithExclusions();
                });                
                wordSpan.setAttribute('draggable', true);
                wordSpan.addEventListener('dragstart', event => {
                    event.dataTransfer.setData('text/plain', JSON.stringify({ word, columnIndex: row.indexOf(cell) }));
                    wordSpan.style.backgroundColor = 'lightblue'; // Highlight when ready to drag
                });
                wordSpan.addEventListener('dragend', event => {
                    wordSpan.style.backgroundColor = ''; // Reset background color
                });

                td.appendChild(wordSpan);
                td.appendChild(document.createTextNode(' ')); // Add space between words
            });
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
}

// function renderTable(data) {
//     const table = document.getElementById('csvTable');
//     table.innerHTML = '';

//     // Create table header row with clickable column headers
//     const headerRow = document.createElement('tr');
//     data[0].forEach((cell, colIndex) => {
//         const th = document.createElement('th');
//         th.textContent = cell;
//         th.style.cursor = 'pointer'; // Set cursor to pointer for clickable effect
//         th.addEventListener('click', () => toggleColumnFilter(colIndex));
//         headerRow.appendChild(th);
//     });
//     table.appendChild(headerRow);

//     // Create table rows with data
//     data.slice(1).forEach(row => {
//         const tr = document.createElement('tr');
//         row.forEach(cell => {
//             const td = document.createElement('td');
//             const words = cell.split(' '); // Split cell content into words
//             words.forEach(word => {
//                 const wordSpan = document.createElement('span');
//                 wordSpan.textContent = word;

//                 // Add hover effect, click-to-exclude, and drag capability to words
//                 wordSpan.style.cursor = 'pointer'; // Set cursor to pointer for clickable effect
//                 wordSpan.addEventListener('mouseover', () => {
//                     wordSpan.style.backgroundColor = 'lightyellow'; // Highlight on hover
//                 });
//                 wordSpan.addEventListener('mouseout', () => {
//                     wordSpan.style.backgroundColor = ''; // Remove highlight on mouseout
//                 });
//                 wordSpan.addEventListener('click', () => {
//                     excludedWords.add({ word, columnIndex: row.indexOf(cell) }); // Add word and column index to excludedWords Set
//                     updateExcludedWordsList();
//                     filterDataWithExclusions();
//                 });
//                 wordSpan.setAttribute('draggable', true);
//                 wordSpan.addEventListener('dragstart', event => {
//                     event.dataTransfer.setData('text/plain', JSON.stringify({ word, columnIndex: row.indexOf(cell) }));
//                     wordSpan.style.backgroundColor = 'lightblue'; // Highlight when ready to drag
//                 });
//                 wordSpan.addEventListener('dragend', event => {
//                     wordSpan.style.backgroundColor = ''; // Reset background color
//                 });

//                 td.appendChild(wordSpan);
//                 td.appendChild(document.createTextNode(' ')); // Add space between words
//             });
//             tr.appendChild(td);
//         });
//         table.appendChild(tr);
//     });
// }

function deleteColumn(colIndex) {
    csvData.forEach(row => row.splice(colIndex, 1));
    saveCSVDataToLocalStorage(csvData); // Save updated CSV data to localStorage
    renderTable(csvData);
}

function sortData(colIndex, order) {
    csvData.slice(1).sort((a, b) => {
        if (order === 'asc') {
            return a[colIndex].localeCompare(b[colIndex]);
        } else {
            return b[colIndex].localeCompare(a[colIndex]);
        }
    });

    // Update csvData with sorted data (including header row)
    csvData = [csvData[0], ...csvData.slice(1).sort((a, b) => {
        if (order === 'asc') {
            return a[colIndex].localeCompare(b[colIndex]);
        } else {
            return b[colIndex].localeCompare(a[colIndex]);
        }
    })];

    saveCSVDataToLocalStorage(csvData); // Save sorted CSV data to localStorage
    renderTable(csvData); // Render table with sorted data
}

function exportCSV() {
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function clearData() {
    localStorage.removeItem('csvData'); // Remove CSV data from localStorage
    csvData = [];
    renderTable(csvData);
}

function filterData(keyword) {
    const filteredData = csvData.filter(row => {
        return row.some(cell => cell.includes(keyword));
    });
    renderTable(filteredData);
}

document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    loadCSV(file);
});

document.getElementById('deleteColumnBtn').addEventListener('click', function() {
    const colIndex = prompt('Enter column index to delete:');
    if (colIndex !== null && !isNaN(colIndex)) {
        deleteColumn(parseInt(colIndex));
    }
});

document.getElementById('sortBtn').addEventListener('click', () => {
    const colIndex = prompt('Enter column index to sort by:');
    const order = prompt('Enter sort order (asc or desc):');
    if (colIndex !== null && order !== null && !isNaN(colIndex)) {
        sortData(parseInt(colIndex), order);
    }
});

document.getElementById('exportBtn').addEventListener('click', exportCSV);

document.getElementById('clearBtn').addEventListener('click', clearData);

document.getElementById('filterInput').addEventListener('input', function(event) {
    const keyword = event.target.value.toLowerCase();
    filterData(keyword);
});



const excludedWords = new Set();

function updateExcludedWordsList() {
    const excludedWordsList = document.getElementById('excludedWordsList');
    excludedWordsList.innerHTML = '';

    excludedWords.forEach(item => {
        const wordElement = document.createElement('div');
        wordElement.textContent = `${item.word} (Column: ${data[0][item.columnIndex]})`; // Display word with column association
        wordElement.setAttribute('draggable', true);

        // Implement drag events
        wordElement.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', JSON.stringify({ word: item.word, columnIndex: item.columnIndex }));
        });

        wordElement.addEventListener('dragend', event => {
            // Optional: Handle drag end behavior
        });

        excludedWordsList.appendChild(wordElement);
    });
}

function filterDataWithExclusions() {
    const filteredData = csvData.filter(row => {
        const shouldIncludeRow = !Array.from(excludedWords).some(word => {
            return row.some(cell => cell.toLowerCase().includes(word.toLowerCase()));
        });
        return shouldIncludeRow;
    });
    renderTable(filteredData);
}

// Initialize drag-and-drop events for exclusion words
const excludeSidebar = document.getElementById('excludeSidebar');
excludeSidebar.addEventListener('dragover', event => {
    event.preventDefault();
});

// Handle dropping words into excluded words list
excludeSidebar.addEventListener('drop', event => {
    event.preventDefault();
    const { word, columnIndex } = JSON.parse(event.dataTransfer.getData('text/plain'));
    excludedWords.add({ word, columnIndex }); // Add word and column index to excludedWords Set
    updateExcludedWordsList();
    filterDataWithExclusions();
    });

// Handle removing words from exclusions on drag back to table
document.getElementById('csvTable').addEventListener('drop', event => {
    event.preventDefault();
    const { word, columnIndex } = JSON.parse(event.dataTransfer.getData('text/plain'));
    excludedWords.delete({ word, columnIndex }); // Remove word and column index from excludedWords Set
    updateExcludedWordsList();
    filterDataWithExclusions();
});

// Handle removing words from exclusions on drag back to table
document.getElementById('csvTable').addEventListener('dragover', event => {
    event.preventDefault();
});

const filteredColumns = new Set();

function filterDataWithExclusions() {
    const filteredData = csvData.filter((row, rowIndex) => {
        // Skip filtering the header row (rowIndex === 0)
        if (rowIndex === 0) {
            return true; // Keep the header row in the filtered data
        }

        // Check if any excluded word exists in the current row
        const shouldIncludeRow = !Array.from(excludedWords).some(wordItem => {
            const { word, columnIndex } = wordItem;
            return row[columnIndex].toLowerCase().includes(word.toLowerCase());
        });

        return shouldIncludeRow;
    });

    renderTable(filteredData);

    // Display labels next to filtered columns
    const table = document.getElementById('csvTable');
    const headerRow = table.querySelector('tr');
    headerRow.childNodes.forEach((th, colIndex) => {
        if (filteredColumns.has(colIndex)) {
            if (!th.querySelector('.filterLabel')) {
                const label = document.createElement('span');
                label.textContent = ' (Filtered)';
                label.className = 'filterLabel';
                th.appendChild(label);
            }
        } else {
            const label = th.querySelector('.filterLabel');
            if (label) {
                th.removeChild(label);
            }
        }
    });
}

// Function to save CSV data to localStorage
function saveCSVDataToLocalStorage(data) {
    localStorage.setItem('csvData', JSON.stringify(data));
}

// Function to load CSV data from localStorage
function loadCSVDataFromLocalStorage() {
    const storedData = localStorage.getItem('csvData');
    return storedData ? JSON.parse(storedData) : [];
}

// Update filteredColumns set when a column is selected for filtering
function toggleColumnFilter(colIndex) {
    if (filteredColumns.has(colIndex)) {
        filteredColumns.delete(colIndex);
    } else {
        filteredColumns.add(colIndex);
    }
    filterDataWithExclusions();
}

// Modify header row creation to add column filter click event
data[0].forEach((cell, colIndex) => {
    const th = document.createElement('th');
    th.textContent = cell;
    th.style.cursor = 'pointer'; // Set cursor to pointer for clickable effect
    th.addEventListener('click', () => toggleColumnFilter(colIndex)); // Toggle column filter
    headerRow.appendChild(th);
});

// Render initial table
renderTable(csvData);
