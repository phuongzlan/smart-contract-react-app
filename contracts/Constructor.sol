// A common pattern in our smart contracts
// Define variable, modifier function,...
contract Constructor is States{
    address public seller;
    address public buyer;
    address public oracle;
    uint256 public price;
    uint256 public penaltyRate;
    uint256 buyerPenalty;
    uint256 sellerPenalty;
    uint256 state;
    uint256 public value;
    function initData(
        address _seller, 
        address _buyer, 
        address _oracle, 
        uint256 _price,
        uint256 _penaltyRate) internal 
    {
        seller = _seller;
        buyer = _buyer;
        oracle = _oracle;
        price = _price;
        penaltyRate = _penaltyRate;
    }
    modifier condition(bool _condition) {
        require(_condition);
        _;
    }

    modifier onlyBuyer() {
        require(
            msg.sender == buyer,
            "Only buyer can call this."
        );
        _;
    }

    modifier onlySeller() {
        require(
            msg.sender == seller,
            "Only seller can call this."
        );
        _;
    }

    modifier inState(string _state) {
        require(
            compareStrings(states[state], _state),
            "Invalid state."
        );
        _;
    }
    
    function compareStrings (string a, string b) internal pure returns (bool){
       return keccak256(a) == keccak256(b);
   }
    function getState() public view returns (string){
        if (state >= states.length) return 'Done';
        return states[state];
    }
    
    function nextState() internal{
        state++;
    }
    function endState() internal{
        state = states.length;
    }
    
    function contractBalance() public view returns(uint){
        return address(this).balance;
    }
}