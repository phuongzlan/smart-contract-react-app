contract Purchase is Constructor {
    function purchase()
        public
        payable
        onlySeller()
        inState('Purchase')
        condition(msg.value == penaltyRate*price/100)
    {
    	sellerPenalty = msg.value;
        state++;
    }
}