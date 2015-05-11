String.prototype.getHashCode = function() {
    return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

function DHUtils() {
    this.version = 0.2;
    this.isEnabled = false;

    this.mainDiv = undefined;
    this.displayPlantStatus = undefined;
    this.displayGemStatus = undefined;
    this.displayMarketCoins = undefined;
    this.displayDrillStatus = undefined;
    this.displayCrusherStatus = undefined;
    this.displayGiantDrillStatus = undefined;
    this.displayRoadHeaderStatus = undefined;
    this.displaySandCollectorStatus = undefined;
    this.displaySmeltStatus = undefined;
    this.itemPerMinuteElements = {};

    this.farmingPatchCount = 6;

    this.updateInterval = 1000 / 10;

    this.itemPerMinuteTime = undefined;
    this.itemPerMinuteInterval = 60000 * 5; // Update every 5 minute to get decent statistics out of this

    this.statusBarStyle = "color: yellow; margin-left: 6px; margin-right: 2px; margin-top: 2px; float: left";

    // Have to use this one to access the global variables
    this.window = window;

    this.ItemOil = 'oil';
    this.ItemWood = 'wood';
    this.ItemPlanks = 'plank';
    this.ItemSand = 'sand';
    this.ItemStone = 'stone';
    this.ItemCopper = 'copper';
    this.ItemTin = 'tin';
    this.ItemIron = 'iron';
    this.ItemSilver = 'silver';
    this.ItemGold = 'gold';
    this.ItemQuartz = 'quartz';
    this.ItemFlint = 'flint';

    this.ItemSapphire = 'sapphire';
    this.ItemEmerald = 'emerald';
    this.ItemRuby = 'ruby';
    this.ItemDiamond = 'diamond';
    this.ItemBloodDiamond = 'bloodDiamond';

    this.ItemGlass = 'glass';
    this.ItemBronzeBar = 'bronzeBar';
    this.ItemIronBar = 'ironBar';
    this.ItemSilverBar = 'silverBar';
    this.ItemGoldBar = 'goldBar';

    this.ItemVial = 'vial';
    this.ItemDottedGreenLeaf = 'dottedGreenLeaf';
    this.ItemGreenLeaf = 'greenLeaf';
    this.ItemLimeLeaf = 'limeLeaf';
    this.ItemGoldLeaf = 'goldLeaf';
    this.ItemCrystalLeaf = 'crystalLeaf';
    this.ItemRedMushroom = 'redMushroom';

    this.ItemStarDustSeed = 'starDustSeeds';
    this.ItemRedMushroomSeed = 'redMushroomSeeds';
    this.ItemBlueMushroomSeed = 'blewitMushroomSeeds';
    this.ItemGoldLeafSeed = 'goldLeafSeeds';

    this.ItemDottedGreenLeafSeed = 'dottedGreenLeafSeeds';
    this.ItemStarDustPotion = 'starDustPotion';
    this.ItemSeedPotion = 'seedPotion';
    this.ItemSmeltingPotion = 'smeltingPotion';
    this.ItemLimeLeafSeed = 'limeLeafSeeds';
    this.ItemGreenLeafSeed = 'greenLeafSeeds';

    this.Items = [this.ItemOil, this.ItemWood, this.ItemPlanks, this.ItemSand, this.ItemStone, this.ItemCopper,
        this.ItemTin, this.ItemIron, this.ItemSilver, this.ItemGold, this.ItemQuartz, this.ItemFlint,
        this.ItemSapphire, this.ItemEmerald, this.ItemRuby, this.ItemDiamond, this.ItemBloodDiamond,
        this.ItemGlass, this.ItemBronzeBar, this.ItemIronBar, this.ItemSilverBar, this.ItemGoldBar,
        this.ItemVial, this.ItemDottedGreenLeaf, this.ItemGreenLeaf, this.ItemLimeLeaf, this.ItemGoldLeaf,
        this.ItemCrystalLeaf, this.ItemRedMushroom, this.ItemStarDustPotion, this.ItemSeedPotion, this.ItemSmeltingPotion,
        this.ItemDottedGreenLeafSeed, this.ItemStarDustSeed, this.ItemRedMushroomSeed, this.ItemBlueMushroomSeed,
        this.ItemGreenLeafSeed, this.ItemLimeLeafSeed, this.ItemGoldLeafSeed];

    this.Seeds = [this.ItemDottedGreenLeafSeed, this.ItemStarDustSeed, this.ItemRedMushroomSeed, this.ItemBlueMushroomSeed,
        this.ItemGreenLeafSeed, this.ItemLimeLeafSeed, this.ItemGoldLeafSeed];

    this.itemCount = {};

    this.ActivateableDrill = 'drill';
    this.ActivateableCrusher = 'crusher';
    this.ActivateableGiantDrill = 'giantDrill';
    this.ActivateableRoadHeader = 'roadHeader';
    this.ActivateableSandCollector = 'sandCollector';

    this.autoActionTime = undefined;
    this.autoActionDelay = 2000;

    this.autoHarvest = false;
    this.autoCollectMarket = false;
    this.autoEnableDrill = false;
    this.autoEnableCrusher = false;
    this.autoEnableGiantDrill = false;
    this.autoEnableRoadHeader = false;
    this.autoEnableSandCollector = false;
    this.autoEnableSmelting = false;

    this.SmeltingTargetGlass = 'glass';
    this.SmeltingTargetBronze = 'bronze';
    this.SmeltingTargetIron = 'iron';
    this.SmeltingTargetSilver = 'silver';
    this.SmeltingTargetGold = 'gold';
    this.SmeltingTargets = [this.SmeltingTargetGlass, this.SmeltingTargetBronze, this.SmeltingTargetIron, this.SmeltingTargetSilver, this.SmeltingTargetGold];

    this.smeltingCosts = {};
    this.smeltingResult = {};
    this.smeltingTargetIndex = 0;

    this.itemPerMinuteLastCount = {};
    this.itemPerMinute = {};

    this.chatHistoryLimit = 100;
    this.chatDataLookup = {};

    this.modList = ['zack', 'luxferre'];
    this.devList = ['smitty'];
}

DHUtils.prototype.error = function(message) {
    console.error("DHUtils - " + message);
};

DHUtils.prototype.info = function(message) {
    console.log("DHUtils - " + message);
};

DHUtils.prototype.init = function() {
    this.info("Initializing...");

    // Override some basic functions
    this.baseRefreshChat = this.window.refreshChat;
    this.window.refreshChat = this.refreshChat;
    this.resetChat();

    var root = $('#body-tag');
    if(root.length <= 0) {
        this.error("Main Element was not found");
        return;
    }

    this.initElements(root);

    this.smeltingCosts[this.SmeltingTargetGlass] = 12;
    this.smeltingCosts[this.SmeltingTargetBronze] = 1;
    this.smeltingCosts[this.SmeltingTargetIron] = 50;
    this.smeltingCosts[this.SmeltingTargetSilver] = 150;
    this.smeltingCosts[this.SmeltingTargetGold] = 500;

    this.smeltingResult[this.SmeltingTargetGlass] = this.ItemGlass;
    this.smeltingResult[this.SmeltingTargetBronze] = this.ItemBronzeBar;
    this.smeltingResult[this.SmeltingTargetIron] = this.ItemIronBar;
    this.smeltingResult[this.SmeltingTargetSilver] = this.ItemSilverBar;
    this.smeltingResult[this.SmeltingTargetGold] = this.ItemGoldBar;

    this.isEnabled = true;
    this.info("Version " + this.version + " Loaded");
};

DHUtils.prototype.initElements = function(root) {
    this.mainDiv = $('<div id="dhUtilsMain"></div>');
    this.mainDiv.css({'font-size': '10pt',
        'color': 'white',
        'top': '21px',
        'left': '0px',
        'right': '0px',
        'height': '20px',
        'position': 'absolute',
        'border-style': 'solid',
        'border-width': '1px',
        'background': '-webkit-linear-gradient(black, grey)',
        'background': '-o-linear-gradient(black, grey)',
        'background': '-moz-linear-gradient(black, grey)',
        'background': 'linear-gradient(black, grey)'});

    root.append(this.mainDiv);

	this.displayGemStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.mainDiv.append(this.displayGemStatus);
    
    this.displayPlantStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displayPlantStatus.css( 'cursor', 'pointer' );
    this.displayPlantStatus.click({self: this}, function(arg) { arg.data.self.harvestPlants(arg.shiftKey); });
    this.mainDiv.append(this.displayPlantStatus);
    
    this.displaySmeltStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displaySmeltStatus.css( 'cursor', 'pointer' );
    this.displaySmeltStatus.click({self: this}, function(arg) { arg.data.self.toggleSmelting(arg.shiftKey, arg.ctrlKey); });
    this.mainDiv.append(this.displaySmeltStatus);

    this.displayMarketCoins = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displayMarketCoins.css( 'cursor', 'pointer');
    this.displayMarketCoins.click({self: this}, function(arg) { arg.data.self.collectMarketCoins(arg.shiftKey); });
    this.mainDiv.append(this.displayMarketCoins);

    this.displayDrillStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displayDrillStatus.css( 'cursor', 'pointer' );
    this.displayDrillStatus.click({self: this}, function(arg) { arg.data.self.toggleDrill(arg.shiftKey); });
    this.mainDiv.append(this.displayDrillStatus);

    this.displayCrusherStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displayCrusherStatus.css( 'cursor', 'pointer' );
    this.displayCrusherStatus.click({self: this}, function(arg) { arg.data.self.toggleCrusher(arg.shiftKey); });
    this.mainDiv.append(this.displayCrusherStatus);
    
    this.displayGiantDrillStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displayGiantDrillStatus.css( 'cursor', 'pointer' );
    this.displayGiantDrillStatus.click({self: this}, function(arg) { arg.data.self.toggleGiantDrill(arg.shiftKey); });
    this.mainDiv.append(this.displayGiantDrillStatus);
    
    this.displayRoadHeaderStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displayRoadHeaderStatus.css( 'cursor', 'pointer' );
    this.displayRoadHeaderStatus.click({self: this}, function(arg) { arg.data.self.toggleRoadHeader(arg.shiftKey); });
    this.mainDiv.append(this.displayRoadHeaderStatus);

    this.displaySandCollectorStatus = $('<div style="' + this.statusBarStyle + '"></div>');
    this.displaySandCollectorStatus.css( 'cursor', 'pointer' );
    this.displaySandCollectorStatus.click({self: this}, function(arg) { arg.data.self.toggleSandCollector(arg.shiftKey); });
    this.mainDiv.append(this.displaySandCollectorStatus);

    for(var i = 0; i < this.Items.length; i++) {
        var material = this.Items[i];
        var box = $('#item-' + material + '-box');
        //var count = $('#' + element + 'Amount');
        if(box.length <= 0) {
            continue;
        }

        var element = $('<div id="' + material + 'PerMinute"></div>');
        box.append(element);
        this.itemPerMinuteElements[material] = element;
    }
};

DHUtils.prototype.onUpdate = function() {
    if(this.isEnabled !== true) {
        return;
    }

    var time = new Date().getTime();
    this.updateItemCount(time);
    this.updatePlantStatus(time);
    this.updateGemDisplay(time);
    this.updateItemPerMinuteDisplay(time);
    this.updateActivateableDisplay(time);
    this.updateAutoActions(time);
    this.updateSmeltDisplay(time);

    this.displayMarketCoins.text("Market Sales" + this.getAutoStateText(this.autoCollectMarket) + ": " + this.getCollectableMarketCoins());

    setTimeout(function() { dhUtils.onUpdate(); }, dhUtils.updateInterval);
};

DHUtils.prototype.getAutoStateText = function(value) {
    return value === true ? "(A)" : "";
};

DHUtils.prototype.updateItemCount = function(currentTime) {
    for(var i = 0; i < this.Items.length; i++) {
        var key = this.Items[i];
        if(this.window[key] !== undefined) {
            this.itemCount[key] = parseInt(this.window[key]);
        }
    }
};

DHUtils.prototype.updatePlantStatus = function(currentTime) {
    var state = this.getPlantState();

    this.displayPlantStatus.text("Plants" + this.getAutoStateText(this.autoHarvest) + ": " + state.growing + "G, " + state.ready + "R, " + state.dead + "D, " + state.empty.length + "E");
};

DHUtils.prototype.pickSeedToPlant = function() {
    for(var i = 0; i < this.Seeds.length; i++) {
        var key = this.Seeds[i];
        if(this.getItemCount(key) > 0) {
            return key;
        }
    }

    return undefined;
};

DHUtils.prototype.updateGemDisplay = function(currentTime) {
    var content = $('<div style="' + this.statusBarStyle + '">Gem Status:</div>');
    content.append($('<span style="color: deepskyblue; margin: 1px">' + this.getItemCount(this.ItemSapphire) + '</span>'));
    content.append($('<span style="color: greenyellow; margin: 1px">' + this.getItemCount(this.ItemEmerald) + '</span>'));
    content.append($('<span style="color: red; margin: 1px">' + this.getItemCount(this.ItemRuby) + '</span>'));
    content.append($('<span style="color: aliceblue; margin: 1px">' + this.getItemCount(this.ItemDiamond) + '</span>'));
    content.append($('<span style="color: orange; margin: 1px">' + this.getItemCount(this.ItemBloodDiamond) + '</span>'));

    this.displayGemStatus.html(content);
};

DHUtils.prototype.updateActivateableDisplay = function(currentTime) {
    var status = this.getActivateableStatus(this.ActivateableDrill) === true ? "On" : "Off";
    this.displayDrillStatus.text("Drill" + this.getAutoStateText(this.autoEnableDrill) + ": " + status);

    status = this.getActivateableStatus(this.ActivateableCrusher) === true ? "On" : "Off";
    this.displayCrusherStatus.text("Crusher" + this.getAutoStateText(this.autoEnableCrusher) + ": " + status);
    
    status = this.getActivateableStatus(this.ActivateableGiantDrill) === true ? "On" : "Off";
    this.displayGiantDrillStatus.text("GiantDrill" + this.getAutoStateText(this.autoEnableGiantDrill) + ": " + status);
    
    status = this.getActivateableStatus(this.ActivateableRoadHeader) === true ? "On" : "Off";
    this.displayRoadHeaderStatus.text("RoadHeader" + this.getAutoStateText(this.autoEnableRoadHeader) + ": " + status);

    status = this.getActivateableStatus(this.ActivateableSandCollector) === true ? "On" : "Off";
    this.displaySandCollectorStatus.text("SandCollectors" + this.getAutoStateText(this.autoEnableSandCollector) + ": " + status);
};

DHUtils.prototype.updateItemPerMinuteDisplay = function(currentTime) {
    if(this.itemPerMinuteTime === undefined)
    {
        this.itemPerMinuteTime = currentTime - this.itemPerMinuteInterval;
    }

    if(currentTime <= this.itemPerMinuteTime + this.itemPerMinuteInterval) {
        return;
    }

    // Recalc and update
    var divider = this.itemPerMinuteInterval / 60000;
    for(var i = 0; i < this.Items.length; i++) {
        var key = this.Items[i];
        var lastCount = 0;
        var count = this.getItemCount(key);
        if(this.itemPerMinuteLastCount[key] !== undefined) {
            lastCount = this.itemPerMinuteLastCount[key];
        } else {
            lastCount = count;
        }

        var value = Math.round((count - lastCount) / divider);
        this.itemPerMinuteLastCount[key] = count;
        this.itemPerMinute[key] = value;
        if(this.itemPerMinuteElements[key] !== undefined) {
            if(value >= 0) {
                this.itemPerMinuteElements[key].css({'color': 'green'});
                this.itemPerMinuteElements[key].text(value + "/m");
            } else {
                this.itemPerMinuteElements[key].css({'color': 'red'});
                this.itemPerMinuteElements[key].text("-" + value + "/m");
            }
        } else {
            console.log("No Element for Ips: " + key + " == " + this.itemPerMinute[key]);
        }
    }

    this.itemPerMinuteTime = currentTime;
};

DHUtils.prototype.updateAutoActions = function(currentTime) {
    if(this.autoActionTime === undefined) {
        this.autoActionTime = currentTime;
        return;
    }

    if(currentTime < this.autoActionTime + this.autoActionDelay) {
        return;
    }

    if(this.autoCollectMarket === true && this.getCollectableMarketCoins() > 0) {
        this.collectMarketCoins();
    }

    if(this.autoHarvest === true) {
        var plantState = this.getPlantState();
        if(plantState.ready > 0) {
            this.harvestPlants();
        }

        this.updateAutoPlant();
    }

    if(this.getItemCount(this.ItemOil) > this.getAutoOilThreshold()) {
        if(this.autoEnableDrill === true && this.getActivateableStatus(this.ActivateableDrill) !== true) {
            this.toggleDrill();
        }

        if(this.autoEnableCrusher === true && this.getActivateableStatus(this.ActivateableCrusher) !== true) {
            this.toggleCrusher();
        }
        
        if(this.autoEnableGiantDrill === true && this.getActivateableStatus(this.ActivateableGiantDrill) !== true) {
            this.toggleGiantDrill();
        }
        
        if(this.autoEnableRoadHeader === true && this.getActivateableStatus(this.ActivateableRoadHeader) !== true) {
            this.toggleRoadHeader();
        }

        if(this.autoEnableCrusher === true && this.getActivateableStatus(this.ActivateableSandCollector) !== true) {
            this.toggleSandCollector();
        }
    }

    if(this.autoEnableSmelting === true && this.getSmeltingStatus() === false) {
        this.startSmelting();
    }

    this.autoActionTime = currentTime;
};

DHUtils.prototype.updateSmeltDisplay = function(time) {
    this.displaySmeltStatus.text("Smelting" + this.getAutoStateText(this.autoEnableSmelting) + ": " + this.SmeltingTargets[this.smeltingTargetIndex] + " (" + this.getSmeltingPercentage() + "%)");
};

DHUtils.prototype.getItemCount = function(key) {
    if(this.itemCount[key] === undefined) {
        return 0;
    }

    return this.itemCount[key];
};

DHUtils.prototype.getPlantState = function() {
    var plantState = {empty: [], ready: 0, dead: 0, growing: 0};
    for(var i = 1; i <= this.farmingPatchCount; i++) {
        var state = this.window['farmingPatchTimer' + i];
        if(state === '1') {
            plantState.ready++;
        } else if (state === '-1') {
            plantState.dead++;
        } else if(state > 1) {
            plantState.growing++;
        } else {
            plantState.empty.push(i);
        }
    }

    return plantState;
};

DHUtils.prototype.updateAutoPlant = function() {
    var state = this.getPlantState();

    if(state.empty.length > 0 && this.autoHarvest) {
        for(var i = 0; i < state.empty.length; i++) {
            var slot = state.empty[i];
            var seed = this.pickSeedToPlant();
            if(slot > 4 || seed === undefined) {
                continue;
            }

            // applyPlantSeed(slot, )
            console.log('Planting ' + seed + ' in ' + slot)
            applyPlantSeed(seed, slot);
        }
    }
};

DHUtils.prototype.harvestPlants = function(shiftState) {
    if(shiftState) {
        this.autoHarvest = !this.autoHarvest;
        return;
    }

    for(var i = 1; i <= this.farmingPatchCount; i++) {
        var state = this.window['farmingPatchTimer' + i];
        if (state === '1') {
            this.window.openFarmingDialogue(i);
            this.info("Harvesting Field " + i);
        }
    }
};

DHUtils.prototype.toggleDrill = function(shiftState) {
    if(bindedDrill <= 0) {
        return;
    }

    if(shiftState) {
        this.autoEnableDrill = !this.autoEnableDrill;
        return;
    }

    if(this.getActivateableStatus(this.ActivateableDrill)) {
        this.info("Turning off Drills");
        this.toggleActivated(this.ActivateableDrill);
    } else {
        this.info("Turning on Drills");
        this.toggleActivated(this.ActivateableDrill, true);
    }
};

DHUtils.prototype.toggleCrusher = function(shiftState) {
    if(bindedCrusher <= 0) {
        return;
    }

    if(shiftState) {
        this.autoEnableCrusher = !this.autoEnableCrusher;
        return;
    }

    if(this.getActivateableStatus(this.ActivateableCrusher)) {
        this.info("Turning off Crushers");
        this.toggleActivated(this.ActivateableCrusher);
    } else {
        this.info("Turning on Crushers");
        this.toggleActivated(this.ActivateableCrusher, true);
    }
};

DHUtils.prototype.toggleGiantDrill = function(shiftState) {
    if(bindedGiantDrill <= 0) {
        return;
    }

    if(shiftState) {
        this.autoEnableGiantDrill = !this.autoEnableGiantDrill;
        return;
    }

    if(this.getActivateableStatus(this.ActivateableGiantDrill)) {
        this.info("Turning off Giant Drills");
        this.toggleActivated(this.ActivateableGiantDrill);
    } else {
        this.info("Turning on Giant Drills");
        this.toggleActivated(this.ActivateableGiantDrill, true);
    }
};

DHUtils.prototype.toggleRoadHeader = function(shiftState) {
    if(bindedRoadHeader <= 0) {
        return;
    }

    if(shiftState) {
        this.autoEnableRoadHeader = !this.autoEnableRoadHeader;
        return;
    }

    if(this.getActivateableStatus(this.ActivateableRoadHeader)) {
        this.info("Turning off Road Header");
        this.toggleActivated(this.ActivateableRoadHeader);
    } else {
        this.info("Turning on Road Header");
        this.toggleActivated(this.ActivateableRoadHeader, true);
    }
};

DHUtils.prototype.toggleSandCollector = function(shiftState) {
    if(bindedSandCollector <= 0) {
        return;
    }

    if(shiftState) {
        this.autoEnableSandCollector = !this.autoEnableSandCollector;
        return;
    }

    if(this.getActivateableStatus(this.ActivateableSandCollector)) {
        this.info("Turning off Sand Collectors");
        this.toggleActivated(this.ActivateableSandCollector);
    } else {
        this.info("Turning on Sand Collectors");
        this.toggleActivated(this.ActivateableSandCollector, true);
    }
};

DHUtils.prototype.getActivateableStatus = function(key) {
    if(this.window[key + "AreOn"] === "1") {
        return true;
    }

    return false;
};

DHUtils.prototype.toggleActivated = function(key, turnOn) {
    if(turnOn === true) {
        send('TURNON='+key);
    } else {
        send('TURNOFF='+key);
    }
};

DHUtils.prototype.getCollectableMarketCoins = function() {
    if(tradeData[5] === undefined) {
        return 0;
    }

    var value = parseInt(tradeData[5]);
    return value;
};

DHUtils.prototype.collectMarketCoins = function(shiftState) {
    if(shiftState) {
        this.autoCollectMarket = !this.autoCollectMarket;
        return;
    }

    if(this.getCollectableMarketCoins() > 0) {
        send('COLLECT_COINS=1');
    }
};

DHUtils.prototype.getAutoOilThreshold = function() {
    var capacity = this.getFurnaceCapacity();
    return 2 * (capacity * this.smeltingCosts[this.SmeltingTargetGold]);
};

DHUtils.prototype.getFurnaceCapacity = function() {
    return getFurnaceCapacityAgain(bindedFurnaceLevel);
};

DHUtils.prototype.toggleSmelting = function(shiftState, ctrlState) {
    if(shiftState) {
        this.autoEnableSmelting = !this.autoEnableSmelting;
        return;
    }

    // Todo
    if(ctrlState) {
        // Cycle through the available things
        this.smeltingTargetIndex++;
        if(this.smeltingTargetIndex > this.SmeltingTargets.length - 1) {
            this.smeltingTargetIndex = 0;
        }

        return;
    }

    if(this.getSmeltingStatus() !== true) {
        this.startSmelting();
    }
};

DHUtils.prototype.getSmeltingStatus = function() {
    return furnaceTotalTimer !== "0";
};

DHUtils.prototype.getSmeltingPercentage = function() {
    var total = parseInt(furnaceTotalTimer);
    var current = parseInt(furnaceCurrentTimer);
    if(total <= 0) {
        return 0;
    }

    return Math.floor((current / total) * 100);
};

DHUtils.prototype.startSmelting = function() {
    // Double check to avoid calling this while it's active
    if(this.getSmeltingStatus() !== false) {
        return;
    }

    var capacity = this.getFurnaceCapacity();
    if(capacity <= 0) {
        return;
    }

    var target = this.SmeltingTargets[this.smeltingTargetIndex];
    if(target === undefined) {
        return;
    }

    send("SMELT=" + target + ";" + capacity);
};

DHUtils.prototype.resetChat = function() {
    this.chatDataLookup = {};
    $("#chat-area-div").empty();
};

DHUtils.prototype.refreshChat = function(data) {
    var self = dhUtils;
    var arrayChat = data.split("~");
    var chatbox = $("#chat-area-div");

    //var chatLines = chatbox.children().length;
    while(chatbox.children().length > self.chatHistoryLimit) {
        chatbox.children().first().remove();
    }

    if(Object.keys(self.chatDataLookup).length > self.chatHistoryLimit * 10) {
        // reset the whole chat if we been running too long
        self.resetChat();
    }

    for(var i = 0; i < arrayChat.length; i++) {
        var line = arrayChat[i];
        var key = line.getHashCode();
        if(self.chatDataLookup[key] !== undefined) {
            return;
        }
        self.chatDataLookup[key] = 1;

        var chatData = {
            color: undefined,
            tagString: undefined,
            tagClass: undefined,
            tagImage: undefined,
            message: line
        };

        self.analyzeChatData(chatData);
        self.appendChatData(chatData, chatbox);
    };

    // Chat only scrolls down if it's already at the bottom
    if(chatbox.scrollTop() + chatbox.innerHeight()>= chatbox.scrollHeight){
        chatbox.animate({scrollTop: 5555}, 'slow');
    }
};

DHUtils.prototype.analyzeChatData = function(data) {
    if(data.message.startsWith("!!!")) {
        data.message = data.message.slice(3);
        if (data.message === 'yell') {
            data.message = data.message.slice(4);
            data.tagString = 'Server Message';
            data.color = 'blue';
            data.tagClass = 'chat-tag-yell';
        } else {
            for (var i = 0; i < this.devList.length; i++) {
                if (data.message.startsWith(devList[i])) {
                    data.color = '#666600';
                    data.tagString = 'Dev';
                    data.tagClass = 'chat-tag-dev';
                    break;
                }
            }
        }
    } else if(data.message.startsWith('|') || data.message.startsWith('*')) {
        if(data.message.startsWith('|')) {
            data.color = 'green';
            data.tagClass = 'chat-tag-contributor';
            data.tagString = 'Contributor';
        } else {
            data.tagImage = "<img src='images/icons/donor-icon.gif' style='vertical-align: text-top;' width='20' height='20' alt='Donor'/>";
        }

        for(var i = 0; i < this.modList; i++) {
            if(data.message.startsWith(this.modList[i])) {
                data.color = '#669999';
                data.tagClass = 'chat-tag-mod';
                data.tagString = 'Mod';
            }
        }

        data.message = data.message.slice(1);
    }

    if (data.message.startsWith(username)) {
        data.color = 'FF0000';
    }
};

DHUtils.prototype.appendChatData = function(data, target) {
    var lineContent = $('<div></div>');
    lineContent.append('<span>[' + this.getCurrentTimeFormat() + '] </span>');
    var parent = lineContent;
    if(data.color !== undefined) {
        var colorControl = $("<span style='color:" + data.color + ";'></span>");
        parent.append(colorControl);
        parent = colorControl;
    }
    if(data.tagImage !== undefined) {
        parent.append($(data.tagImage));
    }
    if(data.tagClass !== undefined) {
        var classControl = $("<span class='" + data.tagClass + "'>" + data.tagString + "</span>");
        parent.append(classControl);
    }

    parent.append($('<span>' + data.message + '</span>'));
    target.append(lineContent);
};

DHUtils.prototype.getCurrentTimeFormat = function() {
    var date = new Date();
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

dhUtils = new DHUtils();
setTimeout(function ()
{
    dhUtils.init();

    // Set update loop
    setTimeout(function() { dhUtils.onUpdate(); }, dhUtils.updateInterval);
}, 2000);
