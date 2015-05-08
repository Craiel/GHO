declare('Network', function() {
    include('Assert');
    include('Component');
    include('EventAggregate');
    include('StaticData');
    include('Integration');

    Network.prototype = component.prototype();
    Network.prototype.$super = parent;
    Network.prototype.constructor = Network;

    function Network() {
        this.id = "Network";

        this.socket = undefined;

        this.lastSendTime = undefined;
        this.lastReceiveTime = undefined;

        this.currentTime = undefined;

        this.pendingSendData = [];
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Network.prototype.componentInit = Network.prototype.init;
    Network.prototype.init = function() {
        this.componentInit();

        this.socket = integration.getSocket();
        assert.isDefined(this.socket);

        integration.muteLegacyFunction("onError", this.onSocketError);
        integration.muteLegacyFunction("onMessage", this.onSocketMessage);

        this.socket.onclose = this.onSocketClose;
        this.socket.onerror = this.onSocketError;
        this.socket.onmessage = this.onSocketMessage;
    };

    Network.prototype.componentUpdate = Network.prototype.update;
    Network.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        this.currentTime = gameTime.current;

        var sendCount = this.pendingSendData.length;
        for(var i = 0; i < sendCount; i++) {
            this.sendData(gameTime, sendCount);
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // network functions
    // ---------------------------------------------------------------------------
    Network.prototype.onSocketError = function (args) {
        this.isConnected = false;
        this.socket = undefined;

        console.log("Network error: ");
        console.log(args);
        eventAggregate.publish(staticData.EventNetworkError, args);
    };

    Network.prototype.onSocketMessage = function (args) {
        this.lastReceiveTime = this.currentTime;
        eventAggregate.publish(staticData.EventNetworkMessage, args);
    };

    Network.prototype.onSocketClose = function (args) {
        this.isConnected = false;
        this.socket = undefined;

        eventAggregate.publish(staticData.EventNetworkClose, args);
    };

    Network.prototype.queueSend = function(data) {
        this.pendingSendData.push(data);
    };

    Network.prototype.sendData = function(currentTime, data) {
        this.socket.send(data);
    };

    /*function send(command)
    {

        //console.log("request refresh");
        if(new Date().getTime() > milliSeconds + 50 || firstLoadFlag)
        {
            webSocket.send(command); //send data

            milliSeconds = new Date().getTime();
            if(firstLoadFlag)
                firstLoadFlag = false;
            return false;
        }
        else
        {
            webSocket.send(command); //send data
            serverRejects++;

            if(serverRejects > 20)
                window.location = "login.php";
        }
    }*/

    Network.prototype.sendHandshake = function (name) {
        this.queueSend("HANDSHAKE={0}".format(name));
    };

    Network.prototype.sendSellItem = function(item, count) {
        this.queueSend("SELL={0};{1}".format(item, count));
    };

    Network.prototype.sendBuyItem = function(item) {
        this.queueSend("BUY={0}".format(item));
    };

    Network.prototype.sendConvertOreToXp = function(item, count) {
        this.queueSend("USE_PICKAXE={0};{1}".format(item, count));
    }

    return new Network();

});