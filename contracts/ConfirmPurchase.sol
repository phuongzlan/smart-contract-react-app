
// Second Contract code generate from Icon. 
// Represent for second period 
// It is ConfirmPurchase model
contract ConfirmPurchase is Constructor {

    /// Abort the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    function abort()
        public
        onlySeller()
        inState("ConfirmPurchase")
    {
        endState();
        seller.transfer(this.balance);
    }

    /// Confirm the purchase as buyer.
    /// Transaction has to include `2 * value` ether.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase()
        public
        payable
        onlyBuyer()
        inState('ConfirmPurchase')
        condition(msg.value == price + price*penaltyRate/100)
    {
        nextState();
    }

}