
const {ipcRenderer} = require('electron');
require('devtron').install();

var $ = require('jquery');

require('jquery.terminal')($);

const ccxt = require ('ccxt');
const config = require('config');
// var Table = require('cli-table');
var program = require('commander');

var nodeConsole = require('console');
var con = new nodeConsole.Console(process.stdout, process.stderr);
// con.log('Hello World!');
const spawn = require('threads').spawn;
	