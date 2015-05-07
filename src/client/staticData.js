declare('StaticData', function () {
    include('Component');

    StaticData.prototype = component.prototype();
    StaticData.prototype.$super = parent;
    StaticData.prototype.constructor = StaticData;

    function StaticData() {
        component.construct(this);

        this.id = "StaticData";

        this.versionFile = "version.txt";

        this.maxChatHistory = 200;

        this.EventNetworkError = "networkError";
        this.EventNetworkMessage = "networkMessage";
        this.EventNetworkClose = "networkClose";

        this.ItemTypeAll = "All";
        this.ItemTypeKey = "Key";
        this.ItemTypeResource = "Resource";
        this.ItemTypeCrafting = "Crafting";
        this.ItemTypeFarming = "Farming";

        this.ItemTypes = [this.ItemTypeAll, this.ItemTypeKey, this.ItemTypeResource, this.ItemTypeCrafting, this.ItemTypeFarming];

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

        this.ItemStarDustPotion = 'starDustPotion';
        this.ItemSeedPotion = 'seedPotion';
        this.ItemSmeltingPotion = 'smeltingPotion';

        this.Items = [this.ItemOil, this.ItemWood, this.ItemPlanks, this.ItemSand, this.ItemStone, this.ItemCopper,
            this.ItemTin, this.ItemIron, this.ItemSilver, this.ItemGold, this.ItemQuartz, this.ItemFlint,
            this.ItemSapphire, this.ItemEmerald, this.ItemRuby, this.ItemDiamond, this.ItemBloodDiamond,
            this.ItemGlass, this.ItemBronzeBar, this.ItemIronBar, this.ItemSilverBar, this.ItemGoldBar,
            this.ItemVial, this.ItemDottedGreenLeaf, this.ItemGreenLeaf, this.ItemLimeLeaf, this.ItemGoldLeaf,
            this.ItemCrystalLeaf, this.ItemRedMushroom, this.ItemStarDustPotion, this.ItemSeedPotion, this.ItemSmeltingPotion];

        this.CategoryMining = "Mining";
        this.CategoryCrafting = "Crafting";
        this.CategoryFarming = "Farming";
        this.CategoryTrade = "Trade";

        this.Categories = [this.CategoryMining, this.CategoryCrafting, this.CategoryFarming, this.CategoryTrade];
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
