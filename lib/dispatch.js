// con.log(program.coin);
    // return;
const ccxt = require ('ccxt');
const config = require ('./config.js');
const ui = require ('./ui.js');
const terminal = require ('./terminal.js');


var accounts = config.accounts;
var current_account = config.current_account;

exports.init = function() {
    accounts = config.accounts;
    current_account = config.current_account;
}

exports.run = function(command, params) { 

    var exchange = config.exchange;
  
    switch(command) {
        case 'accounts':
            if(params._[1] == 'list') {
                ui.list(Object.keys(config.accounts.list()));
            }

            if(params._[1] == 'add') {
            
                if(params._.length < 6) {
                    terminal.error("Incorrect arguments specified");
                    return;
                }

                var account_name = params._[2];
                var exchange_name = params._[3];
                var api_key = params._[4];
                var api_secret = params._[5];

                config.accounts.add(account_name, exchange_name, api_key, api_secret);

            }

            if(params._[1] == 'use') {
                var account_name = params._[2];
                if(config.accounts.use(account_name)) {
                    terminal.echo("Loaded " + account_name + " account");
                }
            }

            if(params._[1] == 'info') {
                terminal.echo(config.accounts.info());
            }
            console.log(params);
            // terminal.echo("accounts");
            return;

        case 'market':
            var price = undefined;
        case 'limit':

            var side = params._[1];
            var symbol = params._[2];
            var amount = params._[3];
            var price = params._[4];
            // console.log(price);return;

            if(command == 'limit' && price == undefined) {
                terminal.error("Price not defined");
                return;
            } 

            if(!['buy', 'sell'].includes(side)) {
                terminal.error("Invalid order type");
            }

            try {
                exchange.createOrder(symbol, command, side, amount, price).then(function(order) {
                    console.log(order);
                    if(order.status == "closed") {
                        terminal.echo(command + " order executed");
                    } else {
                        if(order.filled == undefined) {
                            order.filled = 0;
                        }
                        terminal.echo(command + " order placed. " + order.filled + " " + symbol + " filled");
                    }
                    
                }, terminal.handleErrors);
            } catch(e) {
                console.log(e);
            }

            return;
        case 'open-orders':
            
            exchange.fetchOpenOrders(params._[1]).then(function(openOrders) {
                console.log(openOrders);
                // terminal.echo(orders.length + ' orders found');

                var cols = ['ID', 'Date', 'Side', 'Price', 'Amount', 'Filled', 'Order Type'];
                var rows = [];

                for(let order of openOrders) {
                    console.log(order);
                    rows.push([order.id, order.datetime, order.side, order.price, order.amount, order.filled, order.type]);
                }
                
                ui.table(cols, rows);

            });


          
            return;

        case 'fetch-price':
            var symbol = params._[1];

            exchange.fetchTicker(symbol).then(function(ticker) {
                console.log(ticker);
                terminal.echo(`Last ${ticker.close}, Ask ${ticker.ask}, Bid ${ticker.bid}`);
            });
            return;


        case 'cancel-order': 
            var orderId = params._[1];
            var symbol = params._[2];

            exchange.cancelOrder(orderId, symbol, {type: params._[3]}).then(function(status) {
                console.log(status);
                if(status.orderId == orderId || status.success == true) {
                    terminal.echo("Order cancelled");
                } 
            }, terminal.handleErrors);
            return;


        case 'get-balance': 
          // this.echo("balance");
          // this.echo(ccxt.exchanges);
          
          config.exchange.fetchBalance().then(function(balances) {
            
            var cols = ['Symbol', 'Free', 'In Use', 'Total'];
            var rows = [];
            // var table = "<table><thead><th>Symbol</th><th>Free</th><th>In Use</th><th>Total</th></thead>";

            for(var symbol in balances) {
              var coin = balances[symbol];
              // console.log(coin);return;
              if(coin.hasOwnProperty('free')) {
                if(coin.total > 0)
                    rows.push([symbol, coin.free, coin.used, coin.total])
              }
            }
            ui.table(cols, rows);

          });
          return;
        case 'better-market-sell':

          return;
        case 'notify-deposit':
          

            var symbol = params.coin;
            var qty = params.amount;
            var checkTimer = false;

            var checkBalance = function(symbol, cb) {
                accounts[current_account].fetchBalance().then(function(balances) {
                  // console.log(balances)
                  cb(balances[symbol].free);
                });
            }

            var receivedCoins = function(symbol, final_balance) {
                checkBalance(symbol, function(balance) {
                    terminal.echo('Current balance is ' + balance);
                    if(balance >= final_balance) {
                        terminal.echo('Received coins');
                        let myNotification = new Notification('Received coins', {
                            body: 'Total ' + symbol + ' in wallet is ' + final_balance
                        });
                        clearTimeout(checkTimer);
                    } else {
                        checkTimer = setTimeout(function() { receivedCoins(symbol, final_balance) }, 2000);
                    }
                });
              }

              checkBalance(symbol, function(balance) {
                var initial_balance = balance;
                
                var final_balance = initial_balance + qty;
                terminal.echo('Initital balance is ' + initial_balance + ' waiting for ' + final_balance);
                receivedCoins(symbol, final_balance);
              });
        return;

    default:
        terminal.error("Command not found");
    

  }
}
    