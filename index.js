'use strict';
const execa = require('execa');
const plist = require('simple-plist');
const prettyjson = require('prettyjson');

/**
 * Check if running on OS X
 * (list of returned platforms)
    - aix
    - darwin
    - freebsd
    - linux
    - openbsd
    - sunos
    - win32
 */
if (process.platform !== 'darwin') {
    throw new Error('Not supported');
}

(async () => {

    // system_profiler SPHardwareDataType
    // sysctl hw.cpufrequency
    // sysctl -a | grep machdep.cpu
    const cmdResCpu = await execa('sysctl', ['machdep.cpu']);

    console.log(cmdResCpu.stdout);
    return;

    /**
     * Battery information
     */

    // execute console command and get the output
    const cmdResBatteries = await execa('ioreg', ['-n', 'AppleSmartBattery', '-r', '-a']);

    // parse the property list (plist) output to JSON
    const batteriesInformation = plist.parse(cmdResBatteries.stdout);

    // check if there are batteries listed
    if (!batteriesInformation || (batteriesInformation && batteriesInformation.length < 1)) {
        console.log('No batteries found!');
    }

    // get the first battery (not sure if there are devides with multiple batteries?)
    const batteryInformation = batteriesInformation[0];

    console.log(prettyjson.render(batteryInformation, {
        // keysColor: 'green',
        // dashColor: 'magenta',
        // stringColor: 'white'
    }));

    // do stuffs here..

    // iterate all the keys
    // Object.keys(batteryInformation).forEach((key) => {
    //     console.log(key);
    // })

})();