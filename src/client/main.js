DHO.main = function() {
	include('Assert');
	include('Debug');
	include('StaticData');
	include('Game');
	include('GameTime');
	include('UserInterface');

	debug.logInfo("Initializing");

	// override our data root if we have it stored somewhere else
	staticData.setRoot("");
	
	// Set the template data
	include('TemplateProvider').SetData(include('TemplateContent'));
	
	// Initialize components
	debug.init();
	staticData.init();
    game.init();
    userInterface.init();

    // Set the update interval for the non-ui components
    var interval = 1000 / 60;
    var intervalHook = setInterval(function() {
        onUpdate();
    }, interval);
    
    // Set the update for the ui, we use animation frame which usually is around 60 fps but is tied to refresh rate
    //  this is generally nicer than using setInterval for animations and UI
    requestAnimationFrame(onUIUpdate);

	var gameTime = gameTime.create();
	function onUpdate() {
		if(assert.hasAsserted() === true) {
			clearInterval(intervalHook);
			console.assert(false, "Aborting update cycle, asserts occured!");
			return;
		}

		DHO.currentUpdateTick++;
		gameTime.update();

		// Update the debug control if enabled
		if(DHO.isDebug === true) {
			debug.update(gameTime);
		}

		DHO.resetFrame();
		staticData.update(gameTime);
	    game.update(gameTime);
	};
	
	function onUIUpdate() {
		if(assert.hasAsserted() === true) {
			console.assert(false, "Aborting UI update cycle, asserts occured!");
			return;
		}

		DHO.currentUpdateTick++;

		userInterface.update(gameTime);
	    
	    requestAnimationFrame(onUIUpdate);
	};
};

$(document).ready(function() {
	DHO.main();
});
