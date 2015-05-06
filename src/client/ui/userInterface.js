declare('UserInterface', function() {
    include('Debug');
    include('Component');
    include('Game');
    include('Network');
    include('TemplateProvider');

    UserInterface.prototype = component.prototype();
    UserInterface.prototype.$super = parent;
    UserInterface.prototype.constructor = UserInterface;

    function UserInterface() {
        component.construct();

        this.id = "UserInterface";

        this.defaultNotifyOptions = {
            newest_on_top: true,
            placement: {from: "bottom", align: "right"},
            delay: 1000//,
            //timer: 1000
        }
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.componentInit = UserInterface.prototype.init;
    UserInterface.prototype.init = function() {
        this.componentInit();

        this.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css");
        this.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css");
        this.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js");

        // Mute functions of the old ui
        this.muteLegacyFunction("loadGraphics");
        this.muteLegacyFunction("refreshChat");
        this.muteLegacyFunction("loadTradeTable");
        this.muteLegacyFunction("loadNpcShop");
        this.muteLegacyFunction("firstLoad");
        this.muteLegacyFunction("loadPlayersOnline");


        var oldBody = $('#body-tag')
        var newBody = $('<body></body>');
        newBody.append($(templateProvider.GetTemplate("main")), {id: 'main'});
        newBody.css({ 'background-image': 'none'});

        oldBody.remove();
        $("html").append(newBody);

        this.notifyInfo("DHO Initialized!");
    };

    UserInterface.prototype.componentUpdate = UserInterface.prototype.update;
    UserInterface.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        if(network.isConnected === true) {
            $('#navBarLogin').hide();
            $('#loginPage').hide();
            $('#contentPage').show();
        } else {
            $('#navBarLogin').show();
            $('#loginPage').show();
            $('#contentPage').hide();
        }
        return true;
    };

    // ---------------------------------------------------------------------------
    // interface functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.getWindow = function() {
        try {
            if (unsafeWindow !== undefined) {
                return unsafeWindow;
            }
        } catch(e) {
            // Ignore and just fallback to normal window variable
        }

        return window;
    };

    UserInterface.prototype.muteLegacyFunction = function(name) {
        var target = this.getWindow();
        if(this.getWindow()[name] !== undefined) {
            target[name + "_MUTE"] = target[name];
            target[name] = function(args) {};
        }
    };

    UserInterface.prototype.loadCss = function(path) {
        $('<link rel="stylesheet" type="text/css" href="'+path+'" />').appendTo("head");
    };

    UserInterface.prototype.loadScript = function(path) {
        $.getScript( path )
            .done(function( script, textStatus ) {
                console.log("Loaded script " + path);
            })
            .fail(function( jqxhr, settings, exception ) {
                console.error("Failed to laod " + script);
            });
    };

    UserInterface.prototype.notifyWarning = function (message) {
        var args = $.extend({type: 'warning'}, this.defaultNotifyOptions);
        $.notify({message: message}, args);
    };

    UserInterface.prototype.notifyInfo = function (message) {
        var args = $.extend({type: 'info'}, this.defaultNotifyOptions);
        $.notify({message: message}, args);
    };

    UserInterface.prototype.notifyError = function (message) {
        var args = $.extend({type: 'danger'}, this.defaultNotifyOptions);
        $.notify({message: message}, args);
    };

    return new UserInterface();
});