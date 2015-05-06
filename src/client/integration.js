declare('Integration', function() {
    include('Log');

    function Integration() {
    }

    Integration.prototype.getWindow = function() {
        try {
            if (unsafeWindow !== undefined) {
                return unsafeWindow;
            }
        } catch(e) {
            // Ignore and just fallback to normal window variable
        }

        return window;
    };

    Integration.prototype.muteLegacyFunction = function(name) {
        var target = this.getWindow();
        if(target[name] === undefined) {
            log.error("Could not mute: " + name);
            return;
        }

        target[name + "_MUTE"] = target[name];
        target[name] = function(args) {};
    };

    Integration.prototype.redirectLegacyFunction = function(name, newFunction) {
        var target = this.getWindow();
        if(target[name] === undefined) {
            log.error("Could not redirect: " + name);
        }

        target[name + "_REDIR"] = target[name];
        target[name] = newFunction;
    };

    Integration.prototype.getUserName = function() {
        return this.getWindow().username;
    };

    Integration.prototype.getSocket = function() {
        return this.getWindow().webSocket;
    };

    return new Integration();
});