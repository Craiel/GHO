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
        this.ItemTypeSpecial = "Special";
        this.ItemTypeResource = "Resource";
        this.ItemTypeCrafting = "Crafting";
        this.ItemTypeFarming = "Farming";
        this.ItemTypeUsable = "Usable";
        this.ItemTypeBrewing = "Brewing";

        this.ItemTypes = [this.ItemTypeAll, this.ItemTypeKey, this.ItemTypeSpecial, this.ItemTypeResource, this.ItemTypeFarming, this.ItemTypeCrafting, this.ItemTypeBrewing, this.ItemTypeUsable];

        this.ItemStarDust = 'starDust';
        this.ItemStarDustBox1 = 'starDustBox1';
        this.ItemStarDustBox2 = 'starDustBox2';
        this.ItemStarDustBox3 = 'starDustBox3';
        this.ItemStarDustBox4 = 'starDustBox4';
        this.ItemTreasureMap = 'treasureMap';
        this.ItemTreasureChest = 'treasureChest';
        this.ItemTreasureKey = 'treasureKey';

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
        this.ItemMarble = 'marble';
        this.ItemTitanium = 'titanium';

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
        this.ItemStarDustSeed = 'starDustSeed';
        this.ItemRedMushroom = 'redMushroom';
        this.ItemBlueMushroom = 'blueMushroom';

        this.ItemStarDustPotion = 'starDustPotion';
        this.ItemSeedPotion = 'seedPotion';
        this.ItemSmeltingPotion = 'smeltingPotion';
        this.ItemOilPotion = 'oilPotion';

        this.ItemSawMill = 'sawMill';
        this.ItemFurnaceStone = 'furnaceStone';
        this.ItemFurnaceBronze = 'furnaceBronze';
        this.ItemFurnaceIron = 'furnaceIron';
        this.ItemFurnaceSilver = 'furnaceSilver';
        this.ItemFurnaceGold = 'furnaceGold';
        this.ItemFurnaceAncient = 'furnaceAncient';
        this.ItemMiningDrill = 'miningDrill';
        this.ItemCrusher = 'crusher';
        this.ItemGiantDrill = 'giantDrill';
        this.ItemRoadHeader = 'roadHeader';
        this.ItemOilPipe = 'oilPipe';
        this.ItemPumpjack = 'pumpJack';
        this.ItemSandCollector = 'sandCollector';
        this.ItemEnchantedPickaxe = 'enchantedPickaxe';
        this.ItemEnchantedHammer = 'enchantedHammer';
        this.ItemEnchantedRake = 'enchantedRake';

        this.ItemMiners = 'miners';
        this.ItemLumberjacks = 'lumberjacks';
        this.ItemFarmers = 'farmers';
        this.ItemPirates = 'pirates';
        this.ItemGemFinder = 'gemFinder';

        this.Items = [this.ItemStarDust, this.ItemStarDustBox1, this.ItemStarDustBox2, this.ItemStarDustBox3, this.ItemStarDustBox4,
            this.ItemTreasureMap, this.ItemTreasureChest, this.ItemTreasureKey,
            this.ItemOil, this.ItemWood, this.ItemPlanks, this.ItemSand, this.ItemStone, this.ItemCopper,
            this.ItemTin, this.ItemIron, this.ItemSilver, this.ItemGold, this.ItemQuartz, this.ItemFlint,
            this.ItemMarble, this.ItemTitanium,
            this.ItemSapphire, this.ItemEmerald, this.ItemRuby, this.ItemDiamond, this.ItemBloodDiamond,
            this.ItemGlass, this.ItemBronzeBar, this.ItemIronBar, this.ItemSilverBar, this.ItemGoldBar,
            this.ItemVial, this.ItemDottedGreenLeaf, this.ItemGreenLeaf, this.ItemLimeLeaf, this.ItemGoldLeaf,
            this.ItemCrystalLeaf, this.ItemStarDustSeed, this.ItemRedMushroom, this.ItemBlueMushroom,
            this.ItemStarDustPotion, this.ItemSeedPotion, this.ItemSmeltingPotion, this.ItemOilPotion,
            this.ItemSawMill, this.ItemFurnaceStone, this.ItemFurnaceBronze, this.ItemFurnaceIron, this.ItemFurnaceSilver,
            this.ItemFurnaceGold, this.ItemFurnaceAncient, this.ItemMiningDrill, this.ItemCrusher, this.ItemGiantDrill,
            this.ItemRoadHeader, this.ItemOilPipe, this.ItemPumpjack, this.ItemSandCollector,
            this.ItemEnchantedPickaxe, this.ItemEnchantedHammer, this.ItemEnchantedRake,
            this.ItemMiners, this.ItemLumberjacks, this.ItemFarmers, this.ItemPirates, this.ItemGemFinder];

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
