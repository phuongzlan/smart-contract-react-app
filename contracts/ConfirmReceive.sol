
// Third Contract code generate from Icon. 
// Represent for third period
// It is ConfirmReceive model
contract ConfirmReceive is Constructor{

    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    function confirmReceived()
        public
        onlyBuyer
        inState('ConfirmReceive')
    {
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        nextState();

        // NOTE: This actually allows both the buyer and the seller to
        // block the refund - the withdraw pattern should be used.
        seller.transfer(price);
        seller.transfer(sellerPenalty);
        buyer.transfer(buyerPenalty);
    }
}