declare('ChatEntry', function() {

    function ChatEntry(key) {
        this.key = key;
        this.time = -1;
        this.level = -1;
        this.user = "unknown";
        this.message = undefined;
        this.isEvent = false;
    }

    return {
        create: function(key) { return new ChatEntry(key); }
    }

});