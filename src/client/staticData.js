declare('StaticData', function () {
    include('Component');

    StaticData.prototype = component.prototype();
    StaticData.prototype.$super = parent;
    StaticData.prototype.constructor = StaticData;

    function StaticData() {
        component.construct(this);

        this.id = "StaticData";

        this.versionFile = "version.txt";

        this.EventNetworkError = "networkError";
        this.EventNetworkMessage = "networkMessage";
        this.EventNetworkClose = "networkClose";
    }

    StaticData.prototype.setRoot = function(value) {
        this.imageRoot = value + 'images/';
        this.imageRootInterface = this.imageRoot + "interface/";
        this.imageRootItem = this.imageRoot + 'item/';
        this.imageRootIcon = this.imageRoot + 'icon/';
    };

    StaticData.prototype.getImagePath = function(fileName) {
        return this.imageRoot + fileName;
    };

    return new StaticData();
});
