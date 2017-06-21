var Q = require('q'),
    crossSpawn = require('cross-spawn');

function execCordovaCommand(optionList) {
    var deferred = Q.defer();
    var cordovaProcess = crossSpawn.spawn('cordova', optionList);
    cordovaProcess.stdout.on('data', function(data) {
        console.log('data out: ' + data.toString());
    });
    cordovaProcess.stderr.on('data', function(data) {
        if (data instanceof Error) {
            //console.log(chalk.bold(data.toString()));
            console.log('data error: ' + data.toString());
        }
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

    var ionicProcess = crossSpawn.spawn('ionic', optionList);

    ionicProcess.stdout.on('data', function(data) {
        console.log('data out: ' + data.toString());
    });

    ionicProcess.stderr.on('data', function(data) {
        if (data) {
            //console.log(chalk.bold(data.toString()));
            console.log('data error: ' + data.toString());
        }
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

    var chmodCommand = crossSpawn.spawn('chmod', ListArgs);

    chmodCommand.stdout.on('data', function(data) {
        console.log('data out: ' + data.toString());
    });

    chmodCommand.stderr.on('data', function(data) {
        if (data) {
            //console.log(chalk.bold(data.toString()));
            console.log('data error: ' + data.toString());
        }
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