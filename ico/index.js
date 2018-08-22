
/*
    ico module
    methods to interact with eth network
*/

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('Web3');
const mnemonic = "tube physical dad like link resource tortoise sight fury future front type";
var fs = require('fs');
var path = require('path');

const provider = new HDWalletProvider(
    mnemonic,
    'https://rinkeby.infura.io/v3/4471e8bad6f44aafa4f4d0dbabba9def',
    address_index=0, 
    num_addresses=5
);
const web3 = new Web3(provider);

module.exports = {

    getAccounts: async () => {
        //get a list of accounts for this wallet provider
        var accounts;
        await web3.eth.getAccounts(function(err,res) { accounts = res; });
        return accounts;
    },

    getCrowdsaleInstance: async (contractAddress) => {
        var filePath = path.join(__dirname, '../build/contracts/RocketTokenCrowdsale.json');      
        var contents = fs.readFileSync(filePath, 'utf8');
        var json = JSON.parse(contents);
        var abi = json.abi;

        var contractInstance = new web3.eth.Contract(abi, contractAddress);
        return contractInstance;
    },

    getTokenInstance: async (tokenAddress) => {

        var filePath = path.join(__dirname, '../build/contracts/RocketToken.json');      
        var contents = fs.readFileSync(filePath, 'utf8');
        var json = JSON.parse(contents);
        var abi = json.abi;

        var tokenInstance = new web3.eth.Contract(abi, tokenAddress);
        return tokenInstance;
    },



}