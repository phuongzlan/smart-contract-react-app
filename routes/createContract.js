const solc = require('solc');
const fs = require('fs');

require.extensions['.sol'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};


const input = {
	StatesHeader: `
contract States{
    string[] public states = [`,
    
    StatesEnd: `];
}
    `,
    
    MainContractHeader: `
contract MainContract is `,

    MainContractEnd: `
{
    constructor(
        address _seller, 
        address _buyer, 
        address _oracle, 
        uint256 _price,
        uint256 _penaltyRate
        ) public {
        initData(
            _seller, 
            _buyer, 
            _oracle,
            _price,
            _penaltyRate
        );
    }
}
    `
};
input.Constructor = require("../contracts/Constructor.sol");
input.Purchase = require("../contracts/Purchase.sol");
input.ConfirmPurchase = require("../contracts/ConfirmPurchase.sol");
input.ConfirmReceive = require("../contracts/ConfirmReceive.sol");

console.log(input);

function createContract(states, cb){
	let inputState = input.StatesHeader;
	let inputContract, inputModels = '';
	let	inputMainContract = input.MainContractHeader;

	states.map((item, index) => {
		if (index){
			inputState = inputState + ', ';
			inputMainContract = inputMainContract + ', ';
		}
		inputState = inputState + `'${item.name}'`;
		inputModels = inputModels + input[item.name];
		inputMainContract = inputMainContract + `${item.name}`;
	});
	inputState = inputState + input.StatesEnd;
	inputMainContract = inputMainContract + input.MainContractEnd;
	//console.log(inputMainContract);
	inputContract = inputState + input.Constructor + inputModels + inputMainContract;
	
	console.log(inputContract);
	// Setting 1 as second paramateractivates the optimiser
	var output = solc.compile(inputContract, 1);
	//console.log(output.contracts);
	if (!output.contracts) return cb('Compile Err');
	return cb(null, {
		contract: inputContract,
		contractJson: output.contracts[':MainContract']
	});
}
/*
createContract([{name: "ConfirmPurchase"}, {name: 'ConfirmReceive'}], (err, result) => {
	console.log(result);
})
*/
module.exports = createContract;