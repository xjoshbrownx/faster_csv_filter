// Declare variables
const csvData = [];
const filteredRowList = [];
const excludedWords = new Set();
let toolDrawer = 0;
const settings = {
    themeSettings : {
        mainColor : 'slate',
        accentColor : 'amber',
        warningColor : 'red',
        textColor: 'purple',
        brightness : 3, //1-5 
        contrast : 2, //1-3
        lowClrVal : 200,
        midClrVal : 500,
        highClrVal : 700,
        rounded : 'md',
        border : '', //'border border-gray-500',
        precision : 2,
    },
    color_choices : ['zinc','yellow','violet','teal','stone','slate','sky','rose','red','purple','pink','orange','neutral','lime','indigo','green','gray','fuchsia','emerald','cyan','blue','amber'],
    text_choices : ['zinc','yellow','violet','teal','stone','slate','sky','rose','red','purple','pink','orange','neutral','lime','indigo','green','gray','fuchsia','emerald','cyan','blue','amber','black'],
    colors : {
        textColorLight : 'text-gray-200',
        textColorDark : 'text-gray-900',
        mainColorLower : `bg-slate-50`,
        mainColorLow : `bg-slate-200`,
        mainColorMid : `bg-slate-500`,
        mainColorHigh : `bg-slate-700`,
        accentColorLow : `bg-amber-200`,
        accentColorMid : `bg-amber-500`,
        accentColorHigh : `bg-amber-700`,
        warningColorLow : `bg-red-200`,
        warningColorMid : `bg-red-500`,
        warningColorHigh : `bg-red-700`,
    },
    getColors : {
        textColorLight : function(){return `text-${settings.themeSettings.textColor}-200`},
        textColorDark : function(){return `text-${settings.themeSettings.textColor}-900`},
        mainColorLower : function(){return `bg-${settings.themeSettings.mainColor}-50`},
        mainColorLow : function(){return `bg-${settings.themeSettings.mainColor}-${settings.themeSettings.lowClrVal}`},
        mainColorMid : function(){return `bg-${settings.themeSettings.mainColor}-${settings.themeSettings.midClrVal}`},
        mainColorHigh : function(){return `bg-${settings.themeSettings.mainColor}-${settings.themeSettings.highClrVal}`},
        accentColorLow : function(){return `bg-${settings.themeSettings.accentColor}-${settings.themeSettings.lowClrVal}`},
        accentColorMid : function(){return `bg-${settings.themeSettings.accentColor}-${settings.themeSettings.midClrVal}`},
        accentColorHigh : function(){return `bg-${settings.themeSettings.accentColor}-${settings.themeSettings.highClrVal}`},
        warningColorLow : function(){return `bg-${settings.themeSettings.warningColor}-${settings.themeSettings.lowClrVal}`},
        warningColorMid : function(){return `bg-${settings.themeSettings.warningColor}-${settings.themeSettings.midClrVal}`},
        warningColorHigh : function(){return `bg-${settings.themeSettings.warningColor}-${settings.themeSettings.highClrVal}`},
    },

    setBrightness : function(brightness) {
        this.themeSettings.brightness = brightness;
        this.storeSettings();
        this.refreshValues();
    },
    setContrast : function(contrast) {
        this.themeSettings.contrast = contrast;
        this.storeSettings();
        this.refreshValues();
    },
    setTextColor : function(textColor) {
        this.themeSettings.textColor = textColor;
        this.storeSettings();
        const oldClrs = ['textColorDark','textColorLight'];
        oldClrs.forEach(clr => this.refreshClrClsUI(clr));
    },
    setMainColor : function(mainColor) {
        this.themeSettings.mainColor = mainColor;
        this.storeSettings();
        const oldClrs = ['mainColorHigh','mainColorMid','mainColorLow','mainColorLower'];
        oldClrs.forEach(clr => this.refreshClrClsUI(clr));
    },
    setAccentColor : function(accentColor) {
        this.themeSettings.accentColor = accentColor;
        this.storeSettings();
        const oldClrs = ['accentColorHigh','accentColorMid','accentColorLow'];
        oldClrs.forEach(clr => this.refreshClrClsUI(clr));
    },
    setWarningColor : function(warningColor) {
        this.themeSettings.warningColor = warningColor;
        this.storeSettings();
        const oldClrs = ['warningColorHigh','warningColorMid','warningColorLow']
        oldClrs.forEach(clr => this.refreshClrClsUI(clr));
    },
    storeSettings : function() {
        localStorage.setItem('settings',JSON.stringify(this.themeSettings));
    },
    loadSettings : function() {
        storedSettings = localStorage.getItem('settings');
        this.themeSettings = Boolean(storedSettings) ? JSON.parse(storedSettings) : settings.themeSettings;
    },
    refreshValues : function() {
        midMap = {1:300,2:400,3:500,4:600,5:700}; 
        this.midClrVal = midMap[this.brightness];
        this.lowClrVal = Math.max(((3-this.contrast)*100),50);
        this.highClrVal = Math.min(((this.contrast)*100)+this.midClrVal,950);
    },
    refreshTextClrs: function() {
        settings.refreshClrClsUI('textColorLight');
        settings.refreshClrClsUI('textColorDark');
    },
    refreshMainClrs : function() {
        settings.refreshClrClsUI('mainColorLower');
        settings.refreshClrClsUI('mainColorLow');
        settings.refreshClrClsUI('mainColorMid');
        settings.refreshClrClsUI('mainColorHigh');
    },
    refreshAccentClrs : function() {
        settings.refreshClrClsUI('accentColorLow');
        settings.refreshClrClsUI('accentColorMid');
        settings.refreshClrClsUI('accentColorHigh');
    },
    refreshWarningClrs : function() {
        settings.refreshClrClsUI('warningColorLow');
        settings.refreshClrClsUI('warningColorMid');
        settings.refreshClrClsUI('warningColorHigh');
    },
    refreshAllClrs : function() {
        this.refreshMainClrs();
        this.refreshAccentClrs();
        this.refreshWarningClrs();
        this.refreshTextClrs();
    },
    refreshClrClsUI : function(objProp) {
        // console.log(objProp);
        oldClr = this.colors[objProp];
        console.log(oldClr);
        newClr = settings.getColors[objProp]();
        console.log(newClr);
        const nodes = document.querySelectorAll(`.${oldClr}`)
        nodes.forEach(node => {
            node.classList.remove(oldClr);
            node.classList.add(newClr);
        });
        this.refreshClrCls(objProp);
    },

    refreshClrCls: function(objProp) {
        settings.colors[objProp] = settings.getColors[objProp]()
    }
}

// ADD INDEX FUNCTIONALITY
// let filteredRowLength = 0;

function initializeApp() {
    // Initalize app
    document.addEventListener('DOMContentLoaded', () => {
        settings.loadSettings();
        settings.refreshAllClrs()
        fileManagementUI();

        loadCSVData().forEach(row => csvData.push(row));
        // const filteredData = [...csvData];
        // mainColorLoad = localStorage.getItem('mainColor');
        
        // If data exists
        if (csvData.length > 0) {
            // Populate Tool Drawer Setting
            localStorage.getItem('toolDrawer');
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
        if (toolDrawer) {
            toggleToolDrawerUI();
        }
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
    toolDrawer = 0;
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
        const clearBtn = toolBtnGen(id='clearData',color='warning',width='w-1/3',label='Clear Data',callback=clearData);
        const exportBtn = toolBtnGen(id='exportData',color='main',width='w-1/3',label='Export CSV',callback=exportFilteredCSV);
        const toolHideBtn = toolBtnGen(id='toolHideBtn',color='main',width='w-1/3',label='Show Tools',callback=toggleToolDrawerUI);
        csvController.appendChild(clearBtn);
        csvController.appendChild(exportBtn); 
        csvController.appendChild(toolHideBtn);   
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

// KILL MAYBE
// function loadToolDrawerSetting() {
//     tempTool = localStorage.getItem('toolDrawer');
//     toolDrawer = tempTool ? tempTool : toolDrawer;
// }

// if csv exists load CSV data from localStorage 
// else returns empty array
function loadDataFromLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : []
}

// Function to save CSV data to localStorage 
function loadValueFromLocalStorage(key, value) {
    temp = localStorage.getItem(key);
    value = temp ? temp : value; 
}

function saveValueToLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

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
    // const screenContainer = document.createElement('div');
    // screenContainer.id = 'screenContainer';
    const screenContainer = document.getElementById('screenContainer');
    screenContainer.classList.add(`${settings.colors.textColorDark}`);
    const nameContainer = nameContainerUI();
    const headerContainer = headerContainerUI();
    const excludeModule = excludeModuleUI();
    const csvTableContainer = csvTableContainerUI();
    const optionScreen = createModalPopupUI();

    // ASSEMBLE STRUCTURE
    screenContainer.appendChild(nameContainer);
    screenContainer.appendChild(headerContainer);
    screenContainer.appendChild(excludeModule);
    screenContainer.appendChild(csvTableContainer);
    
    // body[0].appendChild(headerContainer);
    // body[0].appendChild(excludeModule);
    // body[0].appendChild(csvTableContainer);
    // body[0].appendChild(screenContainer);
    body[0].appendChild(optionScreen);
}

function moduleInstance(id, classNameText) {
    const headerContainer = document.getElementById('headerContainer');
    const moduleOuter = document.createElement('div');
    moduleOuter.id = id;
    className = classNameText ? classNameText : `p-4 m-4 w-11/12 flex justify-between flex-row ${settings.themeSettings.border} rounded-${settings.themeSettings.rounded}`;
    moduleOuter.className = className;
    headerContainer.appendChild(moduleOuter);
    return moduleOuter;
} 

function nameContainerUI() {
    const nameContainer = document.createElement('div'); 
    nameContainer.id="nameContainer";
    nameContainer.className = "w-full p-8 flex flex-row content-center justify-center";
    const appName = document.createElement('p'); 
    appName.id="appName"; 
    appName.className=`text-center tracking-wide align-middle subpixel-antialiased ${settings.colors.textColorDark} font-extrabold text-3xl`;
    appName.textContent='FASTER CSV FILTER';
    nameContainer.appendChild(appName);
    return nameContainer;
}

function headerContainerUI() {
    const headerContainer = document.createElement('div');
    headerContainer.id = 'headerContainer';
    headerContainer.className = `${settings.colors.mainColorHigh} p-4 mx-4 w-11/12 rounded-${settings.themeSettings.rounded}`;
    const controllerContainer = document.createElement('div');
    controllerContainer.id = "controllerContainer";
    controllerContainer.className = "flex flex-row items-center"; 
    const csvController = csvControllerUI();
    const currentFileContainer = currentFileContainerUI();
    const toolContainer = toolContainerUI();

    // ASSEMBLE STRUCTURE 

    controllerContainer.appendChild(csvController);
    controllerContainer.appendChild(currentFileContainer);
    headerContainer.appendChild(controllerContainer);
    headerContainer.appendChild(toolContainer);
    // headerContainer.appendChild(optionScreen);

    return headerContainer;
}

function toolContainerUI() {
    const toolContainer = document.createElement('div');
    toolContainer.id = "toolContainer";
    toolContainer.className = "flex flex-row items-center"; 
    if (toolDrawer) {populateToolContainer()} 
    return toolContainer;
}

function createModalPopupUI() {
    // const headerContainer = document.getElementById('headerContainer');    
    const optionScreen = document.createElement('div');
    optionScreen.id = 'optionScreen';
    return optionScreen
}
    
function openModalPopupUI(upper, lower) {
    const screenContainer = document.getElementById('screenContainer');
    screenContainer.classList.add('blur-sm');
    const optionScreen = document.getElementById('optionScreen');
    optionScreen.className = `fixed pin inset-0 z-40 overflow-auto ${settings.colors.mainColorHigh} blur-none bg-opacity-70 flex`;
    optionScreen.id = 'optionScreen';
    optionScreen.addEventListener('click',event => {
        optionScreen.innerHTML = '';
        optionScreen.classList = '';
        screenContainer.classList.remove('blur-sm');
    });
    const outerContainer = document.createElement('div');
    outerContainer.id = 'outerOptionScreen';
    outerContainer.className = "z-50 w-3/4 drop-shadow-lg w-half md:relative align-top m-auto justify-end md:justify-center p-8 md:rounded flex flex-col";
    const innerUpper = document.createElement('div');
    innerUpper.id = 'innerUpper';
    innerUpper.className = `p-2 h-20 flex flex-row w-full ${settings.colors.accentColorHigh} rounded-t-md items-center overflow-wrap`
    innerUpper.appendChild(upper);
    const innerLower = document.createElement('div');
    innerLower.id = 'innerLower';
    innerLower.className = `flex flex-row w-full ${settings.colors.mainColorMid} rounded-b-md items-center overflow-wrap`
    innerLower.appendChild(lower);
    outerContainer.appendChild(innerUpper);
    outerContainer.appendChild(innerLower);
    optionScreen.appendChild(outerContainer);
}

function closeModalPopupUI() {
    const optionScreen = document.getElementById('optionScreen');
    const screenContainer = document.getElementById('screenContainer');
    screenContainer.classList.remove('blur-sm');
    optionScreen.innerHTML = '';
    optionScreen.className = '';

}

function optionBtnAction() {
    console.log('optionBTNPUSHED')
    const options = populateUpperOptions('main');
    const colorBtns = pickColorUI('mainColor');
    openModalPopupUI(options,colorBtns);
}

function populateUpperOptions(highlighted) {
    const upperContainer = document.createElement('div');
    upperContainer.id = 'upperContainer';
    upperContainer.className = `flex flex-row w-full ${settings.colors.accentColorHigh} items-center overflow-wrap`;
    const pickMainClrBtn = toolBtnGen(id='pickMainClrBtn',color='main',width='w-1/5',label='Main Color', callback=mainClrOptionAction, height='h-14',event_='mouseover');
    const pickAccentClrBtn = toolBtnGen(id='pickAccentClrBtn',color='accent',width='w-1/5',label='Accent Color', callback=accentClrOptionAction, height='h-14',event_='mouseover');
    const pickWarningClrBtn = toolBtnGen(id='pickWarningClrBtn',color='warning',width='w-1/5',label='Warning Color', callback=warningClrOptionAction, height='h-14',event_='mouseover');
    const pickTextClrBtn = toolBtnGen(id='pickTextClrBtn',color='text',width='w-1/5',label='Text Color', callback=textClrOptionAction, height='h-14',event_='mouseover');
    if (highlighted === 'main') {
        pickMainClrBtn.classList.add(`border-8`); 
        pickMainClrBtn.classList.add(`border-white`);
    } else if (highlighted === 'accent') {
        pickAccentClrBtn.classList.add(`border-8`); 
        pickAccentClrBtn.classList.add(`border-white`);
    } else if (highlighted === 'warning') {
        pickWarningClrBtn.classList.add(`border-8`); 
        pickWarningClrBtn.classList.add(`border-white`);
    } else if (highlighted === 'text') {
        pickTextClrBtn.classList.add(`border-8`); 
        pickTextClrBtn.classList.add(`border-white`);
    }
    upperContainer.appendChild(pickMainClrBtn);
    upperContainer.appendChild(pickAccentClrBtn);
    upperContainer.appendChild(pickWarningClrBtn);
    upperContainer.appendChild(pickTextClrBtn);
    return upperContainer;
}

function populateLowerOptions(element) {
    const lowerContainer = document.getElementById('innerLower');
    
}

function accentClrOptionAction() {
    const options = populateUpperOptions('accent');
    const colorBtns = pickColorUI('accentColor');
    closeModalPopupUI();
    openModalPopupUI(options,colorBtns);

    return '';
}

function mainClrOptionAction() {
    const options = populateUpperOptions('main');
    const colorBtns = pickColorUI('mainColor');
    closeModalPopupUI();
    openModalPopupUI(options,colorBtns);
    return '';
}

function warningClrOptionAction() {
    const options = populateUpperOptions('warning');
    const colorBtns = pickColorUI('warningColor');
    closeModalPopupUI();
    openModalPopupUI(options,colorBtns);
    return '';
}

function textClrOptionAction() {
    const options = populateUpperOptions('text');
    const colorBtns = pickColorUI('textColor');
    closeModalPopupUI();
    openModalPopupUI(options,colorBtns);
    return '';
}

function toggleToolDrawerUI() {
    toolDrawer ? closeToolDrawerUI() : openToolDrawerUI()
    toolDrawer = toolDrawer ? 0 : 1;
}

function openToolDrawerUI() {
    toolContainer = document.getElementById("toolContainer");
    const hideColumnBtn = toolBtnGen(id='hideColumnBtn',color='main',width='w-1/5',label='Show/Hide Columns',callback=hideColAction);
    const optionsBtn = toolBtnGen(id='optionsBtn',color='main',width='w-1/5',label='Options',callback=optionBtnAction);
    const addModuleBtn = toolBtnGen(id='addModuleBtn',color='main',width='w-1/5',label='Add Module',callback=addModuleBtnAction);    
    toolContainer.appendChild(hideColumnBtn);
    toolContainer.appendChild(optionsBtn);
    toolContainer.appendChild(addModuleBtn);
}

function closeToolDrawerUI() {
    toolContainer = document.getElementById('toolContainer');
    toolContainer.innerHTML = '';
}

function pickColorUI(colorOption) {
    const pickColor = document.createElement('div');
    pickColor.id = 'pickClrContainer';
    pickColor.className = 'flex flex-row items-center flex-wrap'
    let notClrOpt1, notClrOpt2, notClrOpt3 = "";
    switch (colorOption) {
        case 'mainColor':
            notClrOpt1 = 'accentColor'; 
            notClrOpt2 = 'warningColor'; 
            notClrOpt3 = 'textColor'; 
            break;
        case 'accentColor':
            notClrOpt1 = 'mainColor'; 
            notClrOpt2 = 'warningColor'; 
            notClrOpt3 = 'textColor'; 
            break;
        case 'warningColor':
            notClrOpt1 = 'accentColor'; 
            notClrOpt2 = 'mainColor'; 
            notClrOpt3 = 'textColor'; 
            break;
        case 'textColor':
            notClrOpt1 = 'accentColor'; 
            notClrOpt2 = 'warningColor'; 
            notClrOpt3 = 'mainColor'; 
            break;
    }
    settings.color_choices.forEach(color => {
        // console.log(color);
        if (settings.themeSettings[colorOption] === color) {
            const colorBtn = colorChoiceUI(color.toLowerCase(),colorOption);
            colorBtn.classList.add('border-4');
            colorBtn.classList.add('border-white');
            // console.log(settings.themeSettings[notClrOpt1]);
            // colorBtn.classList.add(`border-${settings.themeSettings[notClrOpt1]}-500`);
            pickColor.appendChild(colorBtn);
        } else if (settings.themeSettings[notClrOpt1] === color) {
        } else if (settings.themeSettings[notClrOpt2] === color) {
        } else if (settings.themeSettings[notClrOpt3] === color) {
        } else {
            const colorBtn = colorChoiceUI(color.toLowerCase(),colorOption);
            pickColor.appendChild(colorBtn);
        }
    });

    return pickColor;
}

function colorChoiceUI(color, colorOption) {
    const colorBtn = document.createElement('button');
    colorBtn.className = `rounded-full m-4 w-14 h-14 text-xs text-center tracking-tight bg-${color}-500 drop-shadow-lg`;
    colorBtn.id = `colorBtn-${color}`;
    colorBtn.textContent = color;
   colorBtn.addEventListener('click', e => {
        switch (colorOption) {
            case 'accentColor':
                // accentColor = color;
                // saveValueToLocalStorage('accentColor',accentColor);
                // initializeApp();
                settings.setAccentColor(color);
                closeModalPopupUI();
                break;
            case 'mainColor':
                // mainColor = color;
                // saveValueToLocalStorage('mainColor',mainColor);
                // initializeApp();
                settings.setMainColor(color);
                closeModalPopupUI();
                break;
            case 'warningColor':
                // warningColor = color;
                // saveValueToLocalStorage('warningColor',warningColor);
                settings.setWarningColor(color);
                closeModalPopupUI();
                break;
            case 'textColor':
                // textColor = color;
                // saveValueToLocalStorage('warningColor',warningColor);
                settings.setTextColor(color);
                closeModalPopupUI();
                break;
        }
    });
    return colorBtn;

}

function hideColAction() {
    return ''
}

function addModuleBtnAction() {
    return ''
}

// 
function toolBtnGen(id, color='main', width='w-1/5', label='', callback, height='h-14', event_='click') {
    switch (color) {
        case 'main':
            color_swtch = `${settings.colors.mainColorMid}`;
            break;
        case 'accent':
            color_swtch = `${settings.colors.accentColorMid}`;
            break;
        case 'warning':
            color_swtch = `${settings.colors.warningColorMid}`;
            break;
        case 'clear':
            color_swtch = `bg-inherit`;
            break;
        default:
            color_swtch = `${settings.colors.mainColorMid}`;
            break;
    }

    const div = document.createElement('div');;
    div.id = `${id}-div`
    div.className = `m-2 grid justify-items-center ${height} ${width} ${color_swtch} ${settings.themeSettings.border} rounded-${settings.themeSettings.rounded}`;
    const button = document.createElement('button');
    button.id = id;
    button.className = 'text-center';
    button.textContent = label;
    button.addEventListener(event_, function(event) {
        if (callback){callback();} else {return '';}
    });
    div.appendChild(button);
    return div;
}

function csvControllerUI() {
    const csvController = document.createElement('div');
    csvController.id = 'csvController';
    csvController.className = `m-1 w-2/5 rounded-${settings.themeSettings.rounded}`;
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
    currentFileContainer.className = `"m-1 w-3/5 ${settings.colors.mainColorLow} flex justify-between rounded-${settings.themeSettings.rounded}`;
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
    excludeModule.className = `p-4 m-4 w-11/12 flex justify-between flex-row border border-gray-500 rounded-${settings.themeSettings.rounded}`;
    const excludedWordsList = document.createElement('div');
    excludedWordsList.id = 'excludedWordsList';
    excludedWordsList.className = 'w-4/5 flex py-2 flex-wrap';
    const excludedControls = document.createElement('div');
    excludedControls.id = 'excludedControls';
    excludedControls.className = `w/1/5 flex flex-col py-2 items-center border border-gray-500 rounded-${settings.themeSettings.rounded}`;
    excludeModule.appendChild(excludedWordsList);
    excludeModule.appendChild(excludedControls);
    return excludeModule;
}

function csvTableContainerUI() {
    const csvTableContainer = document.createElement('div');
    csvTableContainer.id = 'csvTableContainer';
    csvTableContainer.className = `p-4 m-4 w-11/12 overflow-x-scroll rounded-${settings.themeSettings.rounded}`;
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
    rowColor = rowIndex % 2 ? `${settings.colors.mainColorLower}` : `${settings.colors.mainColorLow}`;
    dtl_el = header ? 'th' : 'td' //detail element is table header or table detail
    const tr = document.createElement('tr');
    tr.className = `${rowColor}`
    row.forEach((cell, colIndex) => {
        const td = document.createElement(dtl_el);
        td.className = `text-left px-4 py-2`;
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
                wordSpan.className = `p-2 border ${settings.colors.mainColorMid} rounded-${settings.themeSettings.rounded}` //OPTIONS
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
    // const excludedWordsText = sidebarBtnGen('h3','Excluded Words:', `${settings.colors.mainColorMid}`);
    const excludedWordsText = toolBtnGen('excludedWordsText','main','w-1/5','Excluded Words');
    excludedWordsList.appendChild(excludedWordsText);
    excludedWords.forEach(item => {
        // const {word, colIndex} = item;
        let text = `${item.word} (${csvData[0][item.colIndex]})`;
        let eventFunc = wordElementLogic(item);
        const wordElement = toolBtnGen(id=`word_el_${text}`,color='accent',width='px-2', label=text,callback=eventFunc);
        // const wordElement = sidebarBtnGen('div',text, `bg-${accentColor}-${getMidClrVal()}`, '', 'click', eventFunc);
        excludedWordsList.appendChild(wordElement);
    });
    if (excludedWords.size) {
        exportExclude = sidebarBtnGen('div','Export List',`${settings.colors.mainColorMid}`,'','click',exportExcludeWords);
        clearExclude = sidebarBtnGen('div','Clear List',settings.colors.warningColorMid,'','click',clearExcludeWords);
        excludedControls.appendChild(exportExclude);
        excludedControls.appendChild(clearExclude);
    } else {
            const importExclude = document.createElement('input');
            importExclude.id = 'excludeListInput';
            importExclude.type = 'file';
            importExclude.accept=".csv";
            importExclude.textContent = 'Import Excluded Words List';
            importExclude.className = `p-2 m-2 rounded-${settings.themeSettings.rounded}`;
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

function sidebarBtnGen(type, text, color='bg-amber-500', className='', event='', func='') {
    const wordButton = document.createElement(type);
    wordButton.textContent = text; 
    wordButton.className = className ? className : `px-3 py-2 my-2 mx-4 items-center ${color} rounded-${settings.themeSettings.rounded}`;
    if (event) {
        wordButton.addEventListener(event, func);
    }
    return wordButton;
}

initializeApp()

 

// LEFTOVERS

// function colorChange(color) {
//     headerContainer = getElementById("headerContainer");
//     headerContainer.className = `bg-${color}-200 p-4 m-4 w-11/12 rounded-${settings.themeSettings.rounded}`;
//     currentFileContainer = getElementById("currentFileContainer");
//     currentFileContainer.className = `bg-${color}-600 m-1 w-3/5 flex justify-between rounded-${settings.themeSettings.rounded}`
// }

// function refreshColors(newColor, newBrightness, newContrast) {
    
    //     let oldLowClr = `${settings.colors.mainColorLow}`;
    //     let oldMidClr = `${settings.colors.mainColorMid}`;
    //     let oldHighClr = `${settings.colors.mainColorHigh}`;
    //     let newLowClr = `bg-${newColor}-${newBrightness-newContrast}`;
    //     let newMidClr = `bg-${newColor}-${newBrightness}`;
    //     let newHighClr = `bg-${newColor}-${newBrightness+newContrast}`;
    
    //     lowList = document.getElementsByClassName(oldLowClr);
    //     midList = document.getElementsByClassName(oldMidClr);
    //     highList = document.getElementsByClassName(oldHighClr);
    
    //     if (lowList) Array.from(lowList).forEach(element => {
    //         element.className = element.className.replace(oldLowClr,newLowClr);
    //     })
    //     if (midList) Array.from(midList).forEach(element => {
    //         element.className = element.className.replace(oldMidClr,newMidClr);
    //     })
    //     if (highList) Array.from(highList).forEach(element => {
    //         element.className = element.className.replace(oldHighClr,newHighClr);
    //     })
    //     mainColor = newColor;
    //     brightness = newBrightness;
    //     contrast = newContrast;
    // }
    
