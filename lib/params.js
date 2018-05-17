
var empty = {
    options: [],
    args: []
};

exports.program = false;

exports.commands = {
    'accounts' :  {
        args: {
            'add' : ['add  <account_name> <exchange_name> <api_key> <api_secret>', 'create an exchange account'], 
            'list': ['list' , 'list all exchange accounts'],
            'use' : ['use <account_name>', 'use and load <account_name>'],
            'info': ['info', 'show current account and other information']
        }
    },
    'open-orders' : {
        usage : '<symbol>'
    },
    'better-market-sell': {
        args : {
            'coin' : ['-c, --coin [coin]', 'Coin short code'], 
            'amount' : ['-a, --amount [amount]', 'Amount to sell']
        }
    },
    'market': {
        args: {
            'sell' : ['[coin] [amount]', 'place a market sell order'], 
            'buy': ['[coin] [amount]', 'place a market buy order']
        }
        
    },
    'notify-deposit': {
        args : 
            //['coin', 'amount']
        {   
            'coin' : ['-c, --coin [coin]', 'Coin short code'], 
            'amount' : ['-a, --amount [amount]', 'Amount of coin to look for']
        }
        
    },
    'get-balance' : empty
};

exports.getHelpText = function(command) {
    var helpText;
    for(var cmd in exports.command) {

    }
    return "help on the way, coming soon...";
}

exports.parse_commands = function(command, args) {
    // alert(commands[command].options);

    // var program = new commander();

    // if(typeof exports.commands[command].options === "object") {
    //     var command_options = Object.keys(exports.commands[command].options);
    //     for (var i = 0; i < command_options.length; i++) {
    //         var option = command_options[i];
    //         var option_details = exports.commands[command].options[option];
    //         program
    //           .option(option_details[0], option_details[1])
              
    //     }
    // }
        

    
    // if(typeof exports.commands[command].args === "object") {
    //     var command_args = Object.keys(exports.commands[command].args);
    //     console.log(command_args);
    //     for (var i = 0; i < command_args.length; i++) {

    //         var arg = command_args[i];

    //         var arg_details = exports.commands[command].args[arg];
    //         program
    //           .option(arg_details[0], arg_details[1])
    //     }
    // }

    // program.on('--help', function(){ 
    //     //do nothing
    // });


    // program
    //     .parse(args);

    // exports.program = program;
    
}
