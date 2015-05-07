declare('Game', function() {
    include('Log');
    include('Component');
    include('Network');
    include('Save');
    include('SaveKeys');
    include('StaticData');
    include('Integration');
    include('EventAggregate');
    include('ChatEntry');
    include('TradeEntry');

    pendingMessageEvents = [];
    eventAggregate.subscribe(staticData.EventNetworkMessage, function(args) { pendingMessageEvents.push(args); });

    Game.prototype = component.prototype();
    Game.prototype.$super = parent;
    Game.prototype.constructor = Game;

    function Game() {
        this.id = "Game";

        save.register(this, saveKeys.idnUserName).withDefault("").withCallback(false, true, false);

        this.commandMap = {};

        this.itemData = {};
        this.tradeData = {};

        this.chatDataLookup = {};
        this.chatData = [];

        this.currentTime = -1;

        this.onlinePlayers = -1;
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

        this[saveKeys.idnUserName] = integration.getUserName();

        this.load();
    };

    Game.prototype.componentUpdate = Game.prototype.update;
    Game.prototype.update = function (gameTime) {
        if (this.componentUpdate(gameTime) !== true) {
            return false;
        }

        this.currentTime = gameTime.current;

        var messageCount = pendingMessageEvents.length;
        for(var i = 0; i < messageCount; i++) {
            var data = pendingMessageEvents.shift();
            this.onNetworkMessage(data);
        }

        this.cleanChatKeys();

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
            if(args.data.startsWith(command)) {
                var commandData = args.data.substring(command.length);
                this.commandMap[command](this, commandData);
                return;
            }
        }

        log.warning("Unhandled network message: ");
        console.log(args.data);
    };

    Game.prototype.onReceiveMessage = function(self, args) {
        log.info("RCV_Message: ");
        console.log(args);
    };

    Game.prototype.onReceiveTradeInfo = function(self, args) {
        log.info("RCV_Trade: " + args.length);
        var lines = args.split(';');
        for(var i = 0; i < lines.length; i++) {
            self.updateTradeData(lines[i]);
        }
    };

    Game.prototype.onReceiveChat = function(self, args) {
        var lines = args.split('~');
        for(var i = 0; i < lines.length; i++) {
            self.appendChatLine(lines[i]);
        }
    };

    Game.prototype.onReceiveItemData = function(self, args) {

        // Clear out the player data before updating
        self.resetPlayerData();

        // Check if we are piggy-backing the online player tag
        var match = args.match("(.*):PLAYERS_ONLINE=([0-9]+)");
        if(match !== null) {
            args = match[1];
            self.onlinePlayers = parseInt(match[2]);
        }

        var segments = args.split(";");
        for(var i = 0; i < segments.length; i++) {
            var segmentData = segments[i].split("=");
            if(segmentData.length < 2) {
                // Ignore invalid entries for now
                continue;
            }

            var key = segmentData[0].trim();
            var value = parseInt(segmentData[1].trim());

            self.updateItemData(key, value);
        };
    };

    Game.prototype.resetPlayerData = function() {
        this.itemData = {};
    };

    Game.prototype.updateItemData = function(key, value) {
        this.itemData[key] = value;
    };

    Game.prototype.appendChatLine = function(line) {
        // Todo
        var key = line.getHashCode();
        if(this.chatDataLookup[key] !== undefined) {
            return;
        }

        var entry = this.getChatEntry(key, line);
        this.chatData.push(entry);
        this.chatDataLookup[key] = 1;
    };

    Game.prototype.getChatEntry = function(key, line) {
        var entry = chatEntry.create(key);
        entry.time = this.currentTime;
        var match = line.match("^([\\*\\|\\!]*)(\\w+)\\s*\\[([0-9]+)\\]\\s*:\\s*(.*)");
        if(match !== null) {
            entry.flags = match[1];
            entry.user = match[2];
            entry.level = match[3];
            entry.message = match[4];
            return entry;
        }

        var match = line.match("^([\\!]+)(\\w+)\\s(.*)");
        if(match !== null) {
            entry.flags = match[1];
            entry.user = match[2];
            entry.message = match[3];
            entry.isEvent = true;
            return entry;
        }

        entry.message = "<FORMATERROR> " + line;
        return entry;
    };

    Game.prototype.updateTradeData = function(line) {
        var segments = line.split('~');
        if (segments.length != 14) {
            log.error("Trade Data length mismatch!");
            return;
        }

        var key = parseInt(segments[0]);
        if (this.tradeData[key] === undefined) {
            this.tradeData[key] = tradeEntry.create(key);
        }

        this.tradeData[key].user = segments[1];
        var entry = tradeEntry.create();

        var index = 2;
        for (var i = 0; i < 3; i++) {
            var item = segments[index++];
            if(item === "NONE") {
                item = undefined;
            }

            var amount = parseInt(segments[index++]);
            var price = parseInt(segments[index++]);
            var collect = parseInt(segments[index++]);
            this.tradeData[key].updateSlotInfo(i, item, amount, price, collect);
        }
    };

    // This will keep the chat id index to the max limit
    Game.prototype.cleanChatKeys = function() {
        var keys = Object.keys(this.chatData);
        var overflow = keys.length - staticData.maxChatHistory;
        if(overflow <= 0) {
            return;
        }

        for(var i = 0; i < overflow; i++) {
            this.chatData.delete[keys[i]];
        }
    };

    // ---------------------------------------------------------------------------
    // game functions
    // ---------------------------------------------------------------------------
    Game.prototype.getUserName = function() {
        return this[saveKeys.idnUserName];
    };

    Game.prototype.getOnlinePlayerCount = function() {
        return this.onlinePlayers;
    };

    Game.prototype.getNewChatEntries = function() {
        // Slice the array and return the entries
        var data = this.chatData.slice();
        this.chatData = [];
        return data;
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