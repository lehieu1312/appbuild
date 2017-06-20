var Q = require('q'),
    crossSpawn = require('cross-spawn'),
    spawn = require('child_process').spawn;

function execCordovaCommand(optionList) {
    var deferred = Q.defer();
    const cordovaProcess = spawn('cordova', optionList, { stdio: 'inherit', shell: true, silent: true });
    cordovaProcess.on('data', function(data) {
        console.log('Cordova commandline data: ' + data.toString());
    });
    cordovaProcess.on('error', function(data) {
        console.log('Cordova commandline error: ' + data.toString());
    });
    cordovaProcess.on('close', function(code) {
        if (code > 0) {
            return deferred.reject(code);
        }
        return deferred.resolve();
    });
    return deferred.promise;
}

function execIonicCommand(optionList) {
    var deferred = Q.defer();
    const ionicProcess = spawn('ionic', optionList, { stdio: 'inherit', shell: true, silent: true });
    ionicProcess.on('data', function(data) {
        console.log('Create app ionic data: ' + data.toString());
    });
    ionicProcess.on('error', function(data) {
        console.log('Create app ionic error: ' + data.toString());
    });
    ionicProcess.on('close', function(code) {
        if (code > 0) {
            return deferred.reject(code);
        }
        return deferred.resolve();
    });
    return deferred.promise;

}

function execChmodCommand(ListArgs) {
    var deferred = Q.defer();
    const chmodCommand = spawn('chmod', ListArgs, { stdio: 'inherit', shell: true, silent: true });
    chmodCommand.on('data', function(data) {
        console.log('Access folder data: ' + data.toString());
    });
    chmodCommand.on('error', function(data) {
        console.log('Access folder error: ' + data.toString());
    });
    chmodCommand.on('close', function(code) {
        if (code > 0) {
            return deferred.reject(code);
        }
        return deferred.resolve();
    });
    return deferred.promise;
}
module.exports = {
    execCordovaCommand: execCordovaCommand,
    execChmodCommand: execChmodCommand,
    execIonicCommand: execIonicCommand
};