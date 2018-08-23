const exec = require('child_process').exec;


// 파일 복사
let copyCommand = 'copy C:\\Users\\Mars\\brackets_ubiaccess\\ubiaccess_server\\controller\\..\\sboard\\template\\test_002_page0.xml C:\\Users\\Mars\\brackets_ubiaccess\\ubiaccess_server\\controller\\..\\json2view\\test_002_page0.xml';
console.log('copy command -> ' + copyCommand);

execCommand(copyCommand, {cwd: '..'}, (code, output) => {

    if (code == 0) {
        console.log('copy success');
    } else if (code > 0) {
        console.log('copy failed.');
    }
    
});


var syncExec = require('sync-exec');
var result = syncExec('dir');
console.log('RESULT: ', result.stdout);


function execCommand(command, options, callback) {
    var output = '';
    let child = exec(command, options);
    
    child.stdout.on('data', (data) => {
        console.log('stdout: ' + data);
        output += 'stdout: ' + data;
    });

    child.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
        output += 'stderr: ' + data;
    });

    child.on('close', (code) => {
        console.log('process done.');
        output += 'process done.';

        callback(code, output);
    });
}
