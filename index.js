
/*
  to use: 
  
  npm start

  then go 

  http://localhost:8080/accounts

*/

const express = require('express');
const app = express();
const ico = require('./ico');

app.get('/', (req, res) =>  {
    res.redirect('/index.html');
});

app.get('/accounts', (req, res) =>  {
    var accounts = ico.getAccounts().then( (accounts) => {
        res.send(accounts);
    });
});



app.get('/balance', (req, res) =>  {
    console.log('get /balance');
    var crowdsaleAddress = req.query.crowdsaleaddress;
    var purchaser = req.query.purchaser;
    //get crowdsale instance
    ico.getCrowdsaleInstance(crowdsaleAddress).then( (crowdsale) => {           
        //get token address
        crowdsale.methods.token().call().then(function(tokenAddress){
            console.log('token address:' + tokenAddress);
            //get token instance
            ico.getTokenInstance(tokenAddress).then( (RocketTokenInstance) => {                    
                //get balanceOf purchaser account
                RocketTokenInstance.methods.balanceOf(purchaser).call()                   
                .then((balance) => {
                    res.send(balance);
                });
            });
        });
    });
});

app.get('/crowdsaleInfo', (req, res) =>  {
    console.log('get /crowdsaleInfo');
    //get crowdsale info
    var crowdsaleAddress = req.query.crowdsaleaddress;
    //get crowdsale instance
    ico.getCrowdsaleInstance(crowdsaleAddress).then( (crowdsale) => {      
        
        //crowdsale methods..
        
        crowdsale.methods.openingTime().call().then(function(openingTime){
            crowdsale.methods.closingTime().call().then(function(closingTime){
                crowdsale.methods.weiRaised().call().then(function(weiRaised){
                    crowdsale.methods.rate().call().then(function(rate){
                        crowdsale.methods.remainingTokens().call().then(function(remainingTokens){
                           // crowdsale.methods.whitelist().call().then(function(whitelist){
                                crowdsale.methods.hasClosed().call().then(function(hasClosed){
                                    
                                        var obj = {
                                            openingTime: openingTime,
                                            closingTime: closingTime,
                                            weiRaised: weiRaised,
                                            rate: rate,
                                            remainingTokens: remainingTokens,
                                            //whitelist: whitelist,
                                            hasClosed: hasClosed
                                        
                                        };
                                        res.send(obj);
                                });
                            //});
                        });
                    });
                });
            });
        });
 

    });
});

app.get('/tokenInfo', (req, res) =>  {
    console.log('get /tokenInfo');
    //get token info (symbol, totalSupply)
    var crowdsaleAddress = req.query.crowdsaleaddress;
    var purchaser = req.query.purchaser;
    //get crowdsale instance
    ico.getCrowdsaleInstance(crowdsaleAddress).then( (crowdsale) => {           
        //get token address
        crowdsale.methods.token().call().then(function(tokenAddress){
            //get token instance
            ico.getTokenInstance(tokenAddress).then( (RocketTokenInstance) => {                    
                //get this purchaser's token balance..
                //console.log('RocketTokenInstance methods..');
                //console.log(RocketTokenInstance.methods);

                //gather token info                
                RocketTokenInstance.methods.symbol().call().then((symbol) => {                    
                    RocketTokenInstance.methods.totalSupply().call().then((totalSupply) => {
                        RocketTokenInstance.methods.owner().call().then((owner) => {
                            RocketTokenInstance.methods.name().call().then((name) => {
                                var obj = {
                                    symbol: symbol, 
                                    totalSupply: totalSupply,
                                    owner: owner,
                                    name: name,
                                    tokenaddress: tokenAddress
                                };
                                res.send(obj);
                            });
                        });
                    });
                });

            });
        });
    });
});

app.get('/whitelist', (req, res) => {
    console.log('get /whitelist');
    var crowdsaleAddress = req.query.crowdsaleaddress;
    var whitelisted = req.query.account;
    console.log('whitelist account = ' + whitelisted);

    //get crowdsale instance
    ico.getCrowdsaleInstance(crowdsaleAddress).then( (crowdsale) => {                           
        try {        
            ico.getAccounts().then( (accounts) => {
                //add whitelist address. use 'send()
                crowdsale.methods.addAddressToWhitelist(whitelisted)
                .send( { from: accounts[0], gas: '1000000' })
                .then(() => {
                        res.sendStatus(200);
                        return true;
                });
            });
        }
        catch (err) {
            //problem with whitelist
            res.sendStatus(500);
        }
    });
});


app.use(express.static('public'));

app.listen(8080, () => {
    console.log('server started');
})


