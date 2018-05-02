const Web3 = require('web3');

let web3 = new Web3();

const API = require('../api');

let accounts = [];
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

web3.eth.getAccounts((err, result) => {
	console.log(err || result);
	accounts = result;
});
//accounts[0], accounts[1], accounts[2], 100, 15
function createContract(states, cb){
	API.createContract(states, (err, result) => {
		if (err) return console.log(err);
		console.log(result);

		let myContract = new web3.eth.Contract(JSON.parse(result.contractJson.interface), null, 
			{ 
    			data: '0x' + result.contractJson.bytecode 
			});
		myContract.options.address = '0x8cdaf0cd259887258bc13a92c0a6da92698644c0';
		console.log(myContract._jsonInterface);
		cb({
			contractCode: result.contract,
			contract: myContract
		})
		/*
		myContract.deploy({
			arguments: ["a"]
		})
		.send({
		    from: accounts[0],
		    gas: 1500000,
		    gasPrice: '30000000000000'
		})
		.then(function(newContractInstance){
		    console.log(newContractInstance.methods) // instance with the new contract address
		    for(let func in newContractInstance.methods){
				newContractInstance.methods[func]().call({
			    }, (err, results) => {
			    	console.log(results);
			    });
		    };
		    /*
		    newContractInstance.methods.f().call({
		    }, (err, results) => {
		    	console.log(results);
		    });
		    
		});
		*/
	});
}

module.exports = createContract;