
const {ipcRenderer} = require('electron');
require('devtron').install();
const config = require('./lib/config.js');
const terminal = require('./lib/terminal.js');
const dispatch = require('./lib/dispatch.js');


terminal.init();
var is_setup = config.is_setup();
terminal.ask_password(is_setup, function(password) {
    // terminal.echo(password);
    terminal.history(true);

    if(config.init(is_setup, password)) {
        if(config.accounts.load()) {
            dispatch.init();
            if(is_setup)
                terminal.echo("Loaded with your settings!");
            else
                terminal.echo("Welcome to Crypto Cli, your account is setup now!");
        }
    } else {
        terminal.echo("Invalid password!");
        // process.exit(0);
    }
    
});

module.exports = $;

