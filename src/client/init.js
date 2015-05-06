// set the main namespace
DHO = {
		isDebug: false,
        isVerboseDebug: false,
        componentUpdateList: [],
        componentUpdateCount: 0,
        componentInitCount: 0,
        currentUpdateTick: 0,
        resetFrame: function() {
            DHO.componentUpdateList = [];
            DHO.componentUpdateCount = 0;
        }
};

var StrLoc = function(str) {
	return str;
};

// #IfDebug
DHO.isDebug = true;
// #EndIf

if (typeof window !== 'undefined') {
    declare("$", jQuery);
} else {
    console.log("Running in non-browser mode, exiting...");
}
