'use strict';

/**
* @openurl
* @from https://github.com/rauschma/openurl/blob/master/openurl.js
* @example require("./openurl").open(url);
*/
const spawn = require('child_process').spawn;
let command;

switch(process.platform) {
    case 'darwin':
        command = 'open';
        break;
    case 'win32':
        command = 'explorer.exe';
        break;
    case 'linux':
        command = 'xdg-open';
        break;
    default:
        throw new Error('Unsupported platform: ' + process.platform);
}

/**
 * Error handling is deliberately minimal, as this function is to be easy to use for shell scripting
 *
 * @param url The URL to open
 * @param callback A function with a single error argument. Optional.
 */

function open(url, callback) {
    const child = spawn(command, [url]);
    let errorText = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        errorText += data;
    });
    child.stderr.on('end', function () {
        if (errorText.length > 0) {
            let error = new Error(errorText);
            if (callback) {
                callback(error);
            } else {
                throw error;
            }
        } else if (callback) {
            callback(error);
        }
    });
}

module.exports.open = open;
