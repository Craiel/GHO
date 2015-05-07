declare('TradeEntry', function() {

    function TradeEntry(key) {
        this.key = key;
        this.id = -1;
        this.user = "unknown";

        this.tradeSlots = {};
    }

    TradeEntry.prototype.updateSlotInfo = function(slotIndex, item, amount, price, collect) {
        if(this.tradeSlots[slotIndex] === undefined) {
            this.tradeSlots[slotIndex] = {};
        }

        this.tradeSlots[slotIndex].item = item;
        this.tradeSlots[slotIndex].amount = amount;
        this.tradeSlots[slotIndex].price = price;
        this.tradeSlots[slotIndex].collect = collect;
    };

    return {
        create: function(key) { return new TradeEntry(key); }
    }

});