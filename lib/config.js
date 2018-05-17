const config = require('config');
const ccxt = require ('ccxt');
const Store = require('electron-store');
const bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

var common_store = false;

exports.store = false;

exports.current_account = false;

exports.exchange = false;

exports.accounts = {

    add : function(account_name, exchange_name, api_key, api_secret) {
        var accounts = exports.store.get("accounts");
        
        accounts[account_name] =  { "exchange_name" : exchange_name, "api_key" : api_key, "api_secret" : api_secret };

        console.log(accounts);

        exports.store.set("accounts", accounts);

    }, 

    list : function() {
        // var currnt = exports.store.get("accounts").find(function() {

        // });

        return exports.store.get("accounts");
    }, 

    use : function(selected_account) {
        exports.current_account = selected_account;
        exports.store.set("default_account", selected_account);
        return this.load();
    }, 

    init : function() {
        var accounts = exports.store.get("accounts");
        // console.log(accounts);
        if(Object.keys(accounts).length > 0) {
            var default_account;
            if((default_account = exports.store.get("default_account", false))) {
                if(accounts[default_account]) {
                    exports.current_account = default_account;
                    return;
                }
            } 
            
            exports.current_account = Object.keys(accounts)[0];
            
        }

    }, 

    info : function() {
        return "Current account in use : " + exports.current_account;
    },

    load : function() {

        var accounts = exports.store.get('accounts');
        if(exports.current_account && accounts[exports.current_account]) {
            var account_config = accounts[exports.current_account];
            var exchange_name = account_config.exchange_name;
            exports.exchange = new ccxt[exchange_name] ({
                apiKey: account_config.api_key,
                secret: account_config.api_secret,
            });

            exports.exchange.loadMarkets();
            
            return true;
        } else {
            return false;
        }
        
    }
};


exports.is_setup = function() {
    common_store = new Store({
        name : 'common4',
    });

    if(common_store.get("is_setup", false) == false) {
        return false;
    } else {
        return true;
    }
}

exports.init = function(is_setup, encryptionKey) {
    if(is_setup) {
        if(bcrypt.compareSync(encryptionKey, common_store.get("encryptionKeyHash", false))) {
            var store = new Store({
                name : 'encrypted_config',
                encryptionKey : encryptionKey,
            });

            exports.store = store;

            exports.accounts.init();

            return true;
        } else {
            return false;
        }
    } else {
        var encryptionKeyHash = bcrypt.hashSync(encryptionKey, salt);
        var store = new Store({
            name : 'encrypted_config',
            encryptionKey : encryptionKey,
        });

        exports.store = store;

        common_store.set("is_setup", true);
        common_store.set("encryptionKeyHash", encryptionKeyHash);

        //initalize new account's settings here.
        exports.store.set("accounts", {});
        return true;
    }
    
    
}



// exports.load = function(cb) {

//     var accounts_config = exports.store.get('accounts');
    
    
//     for(var account in accounts_config){

//         var account_config = accounts_config[account];
        
//         // alert(account);
//         if(exports.current_account == account) { //account_config.api_key != "" && account_config.api_secret != "") {
//             // console.log('Loading ... ' + exchange_name);
            
            

//             break;

//             // console.log (account);
//             // exports.current_account = account;
//         }
        
//     }

//     if(cb)
//         cb();

    
// }
