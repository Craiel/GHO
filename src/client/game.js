declare('Game', function() {
    include('Log');
    include('Component');
    include('Network');
    include('Save');
    include('SaveKeys');
    include('StaticData');
    include('Integration');
    include('EventAggregate');

    pendingMessageEvents = [];
    eventAggregate.subscribe(staticData.EventNetworkMessage, function(args) { pendingMessageEvents.push(args); });

    Game.prototype = component.prototype();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;

    function Game() {
        this.id = "Game";

        save.register(this, saveKeys.idnUserName).withDefault("").withCallback(false, true, false);

        this.commandMap = {};
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Game.prototype.componentInit = Game.prototype.init;
    Game.prototype.init = function () {
        this.componentInit();

        this.commandMap["MESSAGE="] = this.onReceiveMessage;
        this.commandMap["TRADE_REFRESH="] = this.onReceiveTradeInfo;
        this.commandMap["REFRESH_CHAT="] = this.onReceiveChat;
        this.commandMap["ITEMS_DATA="] = this.onReceiveItemData;
        this.commandMap["PLAYERS_ONLINE="] = this.onReceivePlayerOnline;

        this[saveKeys.idnUserName] = integration.getUserName();

        this.load();
    };

    Game.prototype.componentUpdate = Game.prototype.update;
    Game.prototype.update = function (gameTime) {
        if (this.componentUpdate(gameTime) !== true) {
            return false;
        }

        var messageCount = pendingMessageEvents.length;
        for(var i = 0; i < messageCount; i++) {
            var data = pendingMessageEvents.shift();
            this.onNetworkMessage(data);
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // network functions
    // ---------------------------------------------------------------------------
    Game.prototype.onNetworkMessage = function(args) {
        if(args === undefined || args.data === undefined) {
            log.error("Unknown network message: ");
            console.log(args);
            return;
        }

        for(var command in this.commandMap) {
            log.info("CheckCMD: " + command);
            if(args.data.startsWith(command)) {
                this.commandMap[command](args.data);
                return;
            }
        }

        log.warning("Unhandled network message: ");
        console.log(args.data);
    };

    Game.prototype.onReceiveMessage = function(args) {
        log.info("RCV_Message: ");
        console.log(args);
    };

    Game.prototype.onReceiveTradeInfo = function(args) {
        log.info("RCV_Trade: ");
        console.log(args);
    };

    Game.prototype.onReceiveChat = function(args) {
        log.info("RCV_Chat: ");
        console.log(args);
    };

    Game.prototype.onReceiveItemData = function(args) {
        log.info("RCV_ItemData: ");
        console.log(args);
        var segments = args.split(":");
        for(var i = 0; i < segments.length; i++) {

        };
    };

    Game.prototype.onReceivePlayerOnline = function(args) {
        log.info("RCV_Players: ");
        console.log(args);
    };

    // ---------------------------------------------------------------------------
    // game functions
    // ---------------------------------------------------------------------------
    Game.prototype.getUserName = function() {
        return this[saveKeys.idnUserName];
    };

    // ---------------------------------------------------------------------------
    // save / load functions
    // ---------------------------------------------------------------------------
    Game.prototype.save = function() {
        save.save();
    };

    Game.prototype.load = function() {
        save.load();
    };

    Game.prototype.reset = function() {
        save.reset();
    };

    Game.prototype.onLoad = function() {
        // Perform some initial operation after being loaded
    };

    return new Game();
});