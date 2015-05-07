declare('ItemData', function() {

    function ItemData(id) {
        this.id = id;
        this.name = "<ERR>";
        this.desc = "";
        this.craftingCost = {};
        this.canBuy = false;
        this.buyCost = 0;
        this.sellValue = 0;
        this.icon = undefined;
        this.canStack = false;
        this.stackSize = 0;
        this.category = undefined;
    }

    return {
        create: function(id) { return new ItemData(key); }
    }
});