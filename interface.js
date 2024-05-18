const settings = {
    themeSettings : {
        mainColor : 'slate',
        accentColor : 'amber',
        warningColor : 'red',
        textColor: 'amber',
        brightness : 3, //1-5 
        contrast : 2, //1-3
        lowClrVal : 200,
        midClrVal : 500,
        highClrVal : 700,
        color_choices : ['zinc','yellow','violet','teal','stone','slate','sky','rose','red','purple','pink','prange','neutral','lime','indigo','green','gray','fuchsia','emerald','cyan','blue','amber'],
        rounded : 'md', 
        cellOverflow : 'x-scroll',
        precision : 2,
    },
    colors : {
        textColorLight : 'text-amber-200',
        textColorDark : 'text-amber-800',
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
        textColorLight : function(){return `text-${this.themeSettings.accentColor}-200`},
        textColorDark : function(){return `text-${this.themeSettings.accentColor}-800`},
        mainColorLow : function(){return `bg-${this.themeSettings.mainColor}-${this.themeSettings.lowClrVal}`},
        mainColorMid : function(){return `bg-${this.themeSettings.mainColor}-${this.themeSettings.midClrVal}`},
        mainColorHigh : function(){return `bg-${this.themeSettings.mainColor}-${this.themeSettings.highClrVal}`},
        accentColorLow : function(){return `bg-${this.themeSettings.accentColor}-${this.themeSettings.lowClrVal}`},
        accentColorMid : function(){return `bg-${this.themeSettings.accentColor}-${this.themeSettings.midClrVal}`},
        accentColorHigh : function(){return `bg-${this.themeSettings.accentColor}-${this.themeSettings.highClrVal}`},
        warningColorLow : function(){return `bg-${this.themeSettings.warningColor}-${this.themeSettings.lowClrVal}`},
        warningColorMid : function(){return `bg-${this.themeSettings.warningColor}-${this.themeSettings.midClrVal}`},
        warningColorHigh : function(){return `bg-${this.themeSettings.warningColor}-${this.themeSettings.highClrVal}`},
    },

    setBrightness : function(brightness) {
        console.log(this.themeSettings)
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
        const oldClrs = [this.colors.textColorDark,this.colors.textColorLight];
        oldClrs.forEach(clr => this.refreshNodes(clr));
        // this.refreshTextClrs();
    },
    setMainColor : function(mainColor) {
        this.themeSettings.mainColor = mainColor;
        this.storeSettings();
        const oldClrs = [this.colors.mainColorHigh,this.colors.mainColorMid,this.colors.mainColorLow];
        oldClrs.forEach(clr => this.refreshNodes(clr));
        // this.refreshMainClrs();
    },
    setAccentColor : function(accentColor) {
        this.themeSettings.accentColor = accentColor;
        this.storeSettings();
        const oldClrs = [this.colors.accentColorHigh,this.colors.accentColorMid,this.colors.accentColorLow];
        oldClrs.forEach(clr => this.refreshNodes(clr));
        // this.refreshAccentClrs();
    },
    setWarningColor : function(warningColor) {
        this.themeSettings.warningColor = warningColor;
        this.storeSettings();
        const oldClrs = [this.colors.warningColorHigh,this.colors.warningColorMid,this.colors.warningColorLow]
        oldClrs.forEach(clr => this.refreshNodes(clr));
        // this.refreshWarningClrs();
    },
    storeSettings : function() {
        localStorage.setItem('settings',JSON.stringify(this.themeSettings));
    },
    loadSettings : function() {
        storedSettings = localStorage.getItem('setttings');
        this.themeSettings = Object.keys(storeSettings).length ? JSON : [];
    },
    refreshValues : function() {
        midMap = {1:300,2:400,3:500,4:600,5:700}; 
        this.midClrVal = midMap[this.brightness];
        this.lowClrVal = Math.max(((3-this.contrast)*100),50);
        this.highClrVal = Math.min(((this.contrast)*100)+this.midClrVal,950);
        // this.refreshAllClrs();
    },
    refreshTextClrs: function() {
        this.colors.textColorDark = `bg-${this.themeSettings.textColor}-800`;
        this.colors.textColorLight = `bg-${this.themeSettings.textColor}-200`;
        // return [this.colors.textColorDark,this.colors.textColorLight];
    },
    refreshMainClrs : function() {
        this.colors.mainColorLow = `bg-${this.themeSettings.mainColor}-${this.themeSettings.lowClrVal}`;
        this.colors.mainColorMid = `bg-${this.themeSettings.mainColor}-${this.themeSettings.midClrVal}`;
        this.colors.mainColorHigh = `bg-${this.themeSettings.mainColor}-${this.themeSettings.highClrVal}`;
    },
    refreshAccentClrs : function() {
        this.colors.accentColorLow = `bg-${this.themeSettings.accentColor}-${this.themeSettings.lowClrVal}`;
        this.colors.accentColorMid = `bg-${this.themeSettings.accentColor}-${this.themeSettings.midClrVal}`;
        this.colors.accentColorHigh = `bg-${this.themeSettings.accentColor}-${this.themeSettings.highClrVal}`;
    },
    refreshWarningClrs : function() {
        this.colors.warningColorLow = `bg-${this.themeSettings.warningColor}-${this.themeSettings.lowClrVal}`;
        this.colors.warningColorMid = `bg-${this.themeSettings.warningColor}-${this.themeSettings.midClrVal}`;
        this.colors.warningColorHigh = `bg-${this.themeSettings.warningColor}-${this.themeSettings.highClrVal}`;
    },
    refreshAllClrs : function() {
        this.refreshMainClrs();
        this.refreshAccentClrs();
        this.refreshWarningClrs();
    },
    refreshNodes : function(classvalue) {
        const nodes = document.querySelectorAll(`.${classvalue}`)
        nodes.forEach(node => {
            clrInd = Array.from(node.classlist).indexOf(color);
            node.classlist[clrInd] = this.getColors[oldClr]();
        });
        this.colors[oldClr] = this.getColors[oldClr]()
    },
}