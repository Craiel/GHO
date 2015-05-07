declare('UserInterface', function() {
    include('Log');
    include('Component');
    include('Game');
    include('Network');
    include('TemplateProvider');
    include('Integration');
    include('EventAggregate');
    include('StaticData');
    include('CoreUtils');

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
        };

        this.categoryNav = {};
        this.categoryContent = {};
        this.activeCategory = staticData.CategoryMining;

        this.activeItemFilter = staticData.ItemTypeAll;
    }

    // ---------------------------------------------------------------------------
    // basic functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.componentInit = UserInterface.prototype.init;
    UserInterface.prototype.init = function() {
        this.componentInit();

        eventAggregate.subscribe(staticData.EventNetworkClose, this.onNetworkClosed);

        this.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css");
        this.loadCss("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css");
        this.loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js");

        // Mute functions of the old ui
        integration.muteLegacyFunction("loadGraphics");
        integration.muteLegacyFunction("refreshChat");
        integration.muteLegacyFunction("loadTradeTable");
        integration.muteLegacyFunction("loadNpcShop");
        integration.muteLegacyFunction("firstLoad");
        integration.muteLegacyFunction("loadPlayersOnline");

        var oldBody = $('#body-tag')
        var newBody = $('<body></body>');
        newBody.append($(templateProvider.GetTemplate("main")), {id: 'main'});
        newBody.css({ 'background-image': 'none'});

        oldBody.remove();
        $("html").append(newBody);

        this.initCategories();
        this.initItemFilters();

        this.notifyInfo("DHO Initialized!");
    };

    UserInterface.prototype.componentUpdate = UserInterface.prototype.update;
    UserInterface.prototype.update = function(gameTime) {
        if(this.componentUpdate(gameTime) !== true) {
            return false;
        }

        $('#navName').text(game.getUserName());
        $('#navPlayersOnline').text(game.getOnlinePlayerCount() + 'Players Online');

        this.updateChat(gameTime);

        return true;
    };

    // ---------------------------------------------------------------------------
    // interface functions
    // ---------------------------------------------------------------------------
    UserInterface.prototype.initCategories = function() {
        for(var i = 0; i < staticData.Categories.length; i++) {
            var category = staticData.Categories[i];

            // Setup the category controls
            this.categoryContent[category] = $('#content' + category);
            if(this.categoryContent[category].length <= 0) {
                log.error('Category Content missing: ' + category);
                continue;
            }

            this.categoryContent[category].hide();

            this.categoryNav[category] = $('#nav' + category);
            if(this.categoryNav[category].length <= 0) {
                log.error('Category nav missing: ' + category);
                continue;
            }

            this.categoryNav[category].removeClass('active');

            var navRef = $('#nav' + category + 'Ref');
            if(navRef.length <= 0) {
                log.error('Nav ref missing: ' + category);
                continue;
            }

            navRef.click({self: this, category: category}, function(args) { args.data.self.activateCategory(args.data.category); })
        }

        // Activate the default category
        this.activateCategory(this.activeCategory);
    };

    UserInterface.prototype.activateCategory = function(newCategory) {
        log.info('Activating ' + this.activeCategory + " -> " + newCategory);
        this.categoryContent[this.activeCategory].hide();
        this.categoryNav[this.activeCategory].removeClass('active');

        this.activeCategory = newCategory;

        this.categoryContent[this.activeCategory].show();
        this.categoryNav[this.activeCategory].addClass('active');
    };

    UserInterface.prototype.initItemFilters = function() {
        // Todo
    };

    UserInterface.prototype.activateItemFilter = function(newFilter) {
        // Todo
    };

    UserInterface.prototype.onNetworkClosed = function(args) {
        log.warning("Connection closed, redirecting to login!");
        window.location = "login.php";
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

    UserInterface.prototype.updateChat = function(gameTime) {
        var entries = game.getNewChatEntries();
        var target = $('#chatWindow');
        var scrollToEnd = false;
        for(var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            var metaData = {
                time: coreUtils.getTimeDisplay(entry.time),
                user: entry.user,
                level: entry.level,
                message: entry.message
            };

            if(entry.isEvent === true) {
                var content = $(templateProvider.GetTemplate("chatEventTemplate", metaData));
            } else {
                var content = $(templateProvider.GetTemplate("chatLineTemplate", metaData));
            }

            target.append(content);
            scrollToEnd = true;
        }

        // Todo: Add setting to disable this
        if(scrollToEnd === true) {
            target.animate({ scrollTop: target.prop("scrollHeight")}, 200);
        }
    };

    return new UserInterface();
});