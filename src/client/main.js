DHO.main = function() {
	include('Log');
	include('Assert');
	include('StaticData');
	include('Game');
	include('GameTime');
	include('UserInterface');
	include('Network');

	log.info("Initializing");

	// override our data root if we have it stored somewhere else
	staticData.setRoot("");
	
	// Set the template data
	include('TemplateProvider').SetData(include('TemplateContent'));
	
	// Initialize components
	staticData.init();
    game.init();
    userInterface.init();
	network.init();

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

		DHO.resetFrame();
		staticData.update(gameTime);
		network.update(gameTime);
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
