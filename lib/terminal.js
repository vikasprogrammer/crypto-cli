var $ = require('jquery');
require('jquery.terminal')($);
const {ipcRenderer} = require('electron');
const params = require('./params.js');
const dispatch = require('./dispatch.js');
var parser = require('minimist');
var ul;
var terminal;

exports.handleErrors = function(error) {
    console.log(error);
    terminal.error(error);
}

exports.history = function(history_enabled) {
    var history = terminal.history();
    if(history_enabled)
        history.enable();
    else
        history.disable();
}

exports.error = function(str, params = {}) {
    terminal.error(str, params);
}

exports.echo = function(str, params = {}) {
    terminal.echo(str, params);
}

function show_help(txt) {
    terminal.echo("showing help");
    terminal.echo(txt);
    return txt;
}

exports.ask_password = function(is_setup, cb) {
    terminal.set_mask("*");
    var history = terminal.history();
    // history.disable();
    // this.toggle_history();

    if(is_setup) 
        var prompt = "Enter your password ";
    else 
        var prompt = "Create a password ";

    terminal.push(function(password) {
        // console.log(this);
        // var history = this.history();
        // console.log(history);
        this.pop();
        // this.toggle_history();
        history.enable();
        this.set_mask(false);
        cb(password);

    }, {
        prompt: prompt
    });
}

exports.parse_commands = function(terminal_args) {
    var parsed_args = parser(terminal_args);
    
    return parsed_args;
}

exports.init = function() {
    terminal = $('body').terminal(function(command) {
        var terminal = this;
        // exports.console = terminal;
        var cmd = $.terminal.parse_command(command); //command.split(" ");
        var terminal_args = cmd.args;
        // terminal_args.unshift(cmd.name);
        terminal_args.unshift(cmd.name);

        if(terminal_args.indexOf('--help') != -1 || terminal_args.indexOf('-h') != -1) {

            terminal.echo(params.help_text(cmd.name));
            return;
        }
        // params.parse_commands(cmd.name, program_args);

        var parsed_args = exports.parse_commands(terminal_args);

        // console.log(args);
        // return;

        dispatch.run(cmd.name, parsed_args);

        //run commands. 

        if (command.match(/^\s*exit\*$/)) {
            ipcRenderer.send('terminal', {
                method: 'exit',
                args: []
            });
        } 
        //else if (command !== '') {
        //     try {
        //         var result = window.eval(command);
        //         if (result !== undefined) {
        //             this.echo(new String(result));
        //         }
        //     } catch(e) {
        //         this.error(new String(e));
        //     }
        // }
    }, {
    
        exit: false,
        greetings: function(set) {
            set(function() {
                // var ascii_art = [
                //     '   ______        __',
                //     '  / __/ /__ ____/ /________  ___',
                //     ' / _// / -_) __/ __/ __/ _ \\/ _ \\',
                //     '/___/_/\\__/\\__/\\__/_/  \\___/_//_/'
                // ].join('\n');

                var ascii_art = [
                    
                    '_________                        __           _________ .__  .__ ',
                    '\_   ___ \_______ ___.__._______/  |_  ____   \_   ___ \|  | |__|',
                    '/    \  \/\_  __ <   |  |\____ \   __\/  _ \  /    \  \/|  | |  |',
                    '\     \____|  | \/\___  ||  |_> >  | (  <_> ) \     \___|  |_|  |',
                    ' \______  /|__|   / ____||   __/|__|  \____/   \______  /____/__|',
                    '        \/        \/     |__|                         \/         ',

                                                                          
                ].join('\n');
                var cols = this.cols();
                var signature = [];
                if (cols >= 33) {
                    signature.push(ascii_art);
                    signature.push('');
                } else {
                    signature.push('Crypto Cli');
                }
                if (cols >= 57) {
                    signature.push('Copyright (C) 2018 Vikas Singhal <https://crypto-cli.com>');
                } else if (cols >= 47) {
                    // signature.push('(C) 2018 Jakub Jankiewicz <http://jcubic.pl/me>');
                } else if (cols >= 25) {
                    // signature.push('(C) 2018 Jakub Jankiewicz');
                } else if (cols >= 15) {
                    // signature.push('(C) 2018 jcubic');
                }

                // signature.push("Loaded all accounts with default account as " + current_account);

                return signature.join('\n') + '\n';
            });
        },
        name: 'cryptocli',
        prompt: '[[;#D72424;]crypto-cli]> ',
        onInit: function(term) {
            var wrapper = term.cmd().find('.cursor').wrap('<span/>').parent()
                .addClass('cmd-wrapper');
            ul = $('<ul></ul>').appendTo(wrapper);
            
            // ul.on('click', 'li', function() {
            //     term.insert($(this).text());
            //     ul.empty();
            // });
            // term.echo("test");
            // const balance_thread = spawn(function(input, done) {
            //     // term.echo("test");

            //     // alert(1);
            //     // console.log(1);
            //   // done();
            //     const {ipcRenderer} = require('electron');
            //     let myNotification = new Notification('Received coins', {
            //         body: 'Total '
            //       });
            // });

            // balance_thread.send({ term : term });



        },
        keydown: function(e) {
            // console.log(e);
            var term = this;
            
            if(e.keyCode == 37) {
                // var wrapper = term.cmd().find('.cursor').wrap('<span/>').parent()
                // .addClass('cmd-wrapper');
                // ul = $('<ul></ul>').appendTo(wrapper);
                return;
            }
            
            // setTimeout because terminal is adding characters in keypress
            // we use keydown because we need to prevent default action for
            // tab and still execute custom code
            setTimeout(function() {
                ul.empty();
                var command = term.get_command();
                var name = command.match(/^([^\s]*)/)[0];
                if (name) {

                    var word = term.before_cursor(true);
                    var regex = new RegExp('^' + $.terminal.escape_regex(word));
                    var list;
                    if (name == word) {
                        list = Object.keys(params.commands);
                    } else if (command.match(/\s/)) {
                        // term.echo()
                        if (params.commands[name]) {
                            if (word.match(/^--/)) {
                                // term.echo(commands[name].options.keys());
                                list = Object.keys(params.commands[name].options).map(function(option) {
                                    // term.echo(option);
                                    var option_details = params.commands[name].options[option];
                                    return '--' + option_details[0] + "&emsp;&emsp;" + option_details[1];
                                });
                            } else {
                                if(params.commands[name].args)
                                    list = Object.keys(params.commands[name].args);
                                else
                                    list = [];
                            }
                        }
                    }
                    if (word.length >= 2 && list) {
                        var matched = [];
                        for (var i=list.length; i--;) {
                            if (regex.test(list[i])) {
                                matched.push(list[i]);
                            }
                        }
                        var insert = false;
                        if (e.which == 9) {
                            insert = term.complete(matched);
                        }
                        if (matched.length && !insert) {
                            ul.hide();
                            for (var i=0; i<matched.length; ++i) {
                                var str = matched[i].replace(regex, '');
                                if(str != "")
                                    $('<li>' + str + '</li>').appendTo(ul);
                            }
                            ul.show();
                        }
                    }
                }
            }, 0);
            if (e.which == 9) {
                return false;
            }
        }
    });

     // = t;

    
};

// module.exports = $;
