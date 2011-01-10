var runner = require('./index'),
        fs = require('fs');

var printUsage = function() {
    console.log("USAGE : ?suite=SUITE_NAME ?tests=TEST_NAMES ?configuration=CONFIGURATION_FILE");
    console.log("node index.js suite=supplier tests=test1,test2,test3");
    console.log("node index.js configuration=configuration.json");
    console.log("DEFAULTS :\n\tsuite=all\n\ttests=all")
}

var createArray = function(testStr) {
    if (testStr.indexOf(',') > 0) return testStr.replace(/\s+/g, "").split(",").map(function(str){return str.replace('.', '/');});
    else return [testStr.replace('.', '/')]
}

var loadConfiguration = function(fileName) {
    return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
}

var processArguments = function(args) {
    var argObject = {suite : "all", tests : "all"};
    if (args.length) {
        for (var i in args) {
            var curr = args[i].split("=");
            if (curr.length == 2) {
                if (curr[0] == 'tests' || curr[0] == 'suite') {
                    curr[1] = createArray(curr[1]);
                } else if (curr[0] == 'configuration') {
                    argObject = loadConfiguration[curr[1]]
                    break;
                }
                argObject[curr[0]] = curr[1];
            }
        }
    }
    return argObject;
};


var runSuites = function(args) {
    if (args.suite)
    {
       var runner = new Runner({url : args.url || "http://localhost", browserType : args.browser || 'firefox', testDir : args.testDir || __dirname + "/test"});
        runner.run(args.suite, args.tests)
    }
    else printUsage();
}

var args = runSuites(processArguments(process.argv.slice(2)));





