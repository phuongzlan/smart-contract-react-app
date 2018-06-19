const Web3 = require('web3');
//const ganache = require("ganache-cli");

let web3 = new Web3(Web3.givenProvider || new Web3.providers.HttpProvider("http://chattkn.com:8545"));
//let web3 = new Web3();
//web3.setProvider(ganache.provider());

const API = require('../api');

module.exports = {
	createContract,
	getAccounts,
	getBalance,
	deploy,
	getContractByAddress
};


//accounts[0], accounts[1], accounts[2], 100, 15
function createContract(states, cb){
	API.createContract(states, (err, result) => {
		if (err) return cb(err.message);
		if (!result.contractJson) return cb('Create Contract error. Please try again!');
		console.log(result);

		let myContract = new web3.eth.Contract(JSON.parse(result.contractJson.interface), null, 
			{ 
    			data: '0x' + result.contractJson.bytecode 
			});
		//myContract.options.address = '0x8cdaf0cd259887258bc13a92c0a6da92698644c0';
		//console.log(myContract._jsonInterface);
		cb(null, {
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

function deploy({contract, params, fromAccount} , cb){
	contract.deploy({
			arguments: params
		})
		.send({
		    from: fromAccount,
		    gas: 1500000,
		    gasPrice: '300000000000'
		})
		.then(function(newContractInstance){
			console.log(newContractInstance);
			cb(null, newContractInstance);
			/*
		    console.log(newContractInstance.methods) // instance with the new contract address
		    for(let func in newContractInstance.methods){
				newContractInstance.methods[func]().call({
			    }, (err, results) => {
			    	console.log(results);
			    });
		    };
		    newContractInstance.methods.f().call({
		    }, (err, results) => {
		    	console.log(results);
		    });
		    */
		});
}

function getContractByAddress({contract, address}, cb){
	contract.options.address = address;
	cb(contract);
}

function getAccounts(cb){
	web3.eth.getAccounts(cb);
}

function getBalance(address, cb){
	web3.eth.getBalance(address)
		.then(res => cb(null, res),
			err => cb(err));
}
