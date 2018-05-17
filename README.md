# crypto-cli
CLI interface for all your cryptos

## Start
```
npm install 
npm start
```

## Binaries for Mac, Windows and Linux
coming soon.. 

## Supported commands (to date)

```
accounts list
// to show exchange linked accounts

accounts add <account_name> <exchange_name> <api_key> <api_secret>
// to add an exchange account

accounts use <account_name>
// to use <account_name> as current account for all operations

accounts info
// show current account and other infos. 

get-balance
// show current wallet balances

limit [buy/sell] <symbol> <amount> <price> 
market [buy/sell] <symbol> <amount>  

open-orders <symbol> 

fetch-price <symbol> 

cancel-order <order_id> <symbol>

```
More coming soon...
