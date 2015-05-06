declare('Network', function() {
    include('Component');
    include('EventAggregate');
    include('StaticData');

    Network.prototype = component.prototype();
    Network.prototype.$super = parent;
    Network.prototype.constructor = Network;

    function Network() {
        this.id = "Network";

        this.socket = undefined;

        this.isConnected = false;

        this.lastSendTime = undefined;
        this.lastReceiveTime = undefined;

        this.pendingSendData = [];
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    Network.prototype.componentInit = Network.prototype.init;
    Network.prototype.init = function() {
        this.componentInit();

        $('#submitBtn').click({self: this}, function (arg) {
            arg.data.self.onLogin();
        });
    };

    Network.prototype.componentUpdate = Network.prototype.update;
    Network.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        var sendCount = this.pendingSendData.length;
        for(var i = 0; i < sendCount; i++) {
            this.sendData(gameTime, sendCount);
        }

        return true;
    };

    // ---------------------------------------------------------------------------
    // network functions
    // ---------------------------------------------------------------------------
    Network.prototype.connect = function (address) {
        try {
            console.log("Network connecting to " + address);
            this.socket = new WebSocket(address);
            this.socket.onerror = this.onSocketError;
            this.socket.onopen = this.OnSocketOpen;
        } catch (e) {
            this.socket = undefined;
            console.log("Network error: " + e);
        }
    };

    Network.prototype.onSocketError = function (args) {
        this.isConnected = false;
        this.socket = undefined;

        console.log("Network error: ");
        console.log(args);
        eventAggregate.publish(staticData.EventNetworkError, args);
    };

    Network.prototype.onSocketOpen = function (args) {
        this.isConnected = true;

        console.log("Network open");
        console.log(args);
        eventAggregate.publish(staticData.EventNetworkOpen, args);
    };

    Network.prototype.onSocketMessage = function (args) {
        this.lastReceiveTime = DHO.gameTime.current;

        console.log("Network MSG: ");
        console.log(args);
        eventAggregate.publish(staticData.EventNetworkMessage, args);
    };

    Network.prototype.onSocketClose = function (args) {
        this.isConnected = false;
        this.socket = undefined;

        console.log("Network closed");
        console.log(args);
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
        //console.assert(this.isConnected);

        this.queueSend("HANDSHAKE=" + name);
        //this.socket.
    };

    return new Network();

});