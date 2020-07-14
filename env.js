// Globals
let pumpGPIO = 23;
let waterTime = 100;        // TIME TO WATER THE PLANTS IN SECCONDS
let waterBreakTime = 100;  // TIME TO WAIT IN BETWEEN WATER CYCLES in seconds

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var pump = new Gpio(pumpGPIO, 'out'); //use GPIO pin 4, and specify that it is output
var pumpRunning = false;

// IMPORTS
const cliProgress = require('cli-progress');
const { exec } = require("child_process");
var sleep = require('sleep');


// INIT
if (pump.readSync() === 0) {
} else {
    pump.writeSync(0);
}

// MAIN  
while (pumpRunning = true) {

    // get the humidity
    //exec("./hum.c", (error, stdout, stderr) => console.log(stdout));

    // run the pump and display progress bar
    runPump();
    console.log('sleeping...');
    progBar(waterBreakTime)
    //sleep.sleep(waterBreakTime * 60)
}


// FUNCTIONS 
function runPump() {
    console.log('Running Water Pump');
    pump.writeSync(1);
    progBar(waterTime);
    pump.writeSync(0);
    console.log('Stopping Water Pump');
}


function progBar(totalTime) {
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(100, 0);
    var i;
    for (i=0;i<totalTime;i=i+10) {
        bar1.update(i);
        sleep.sleep(totalTime/10);
    }
    bar1.stop();
}

function endPump() { //function to stop blinking
    console.log('Stoping Pump');
    pump.writeSync(0); // Turn LED off
    pump.unexport(); // Unexport GPIO to free resources
}

process.on('exit', function (err) {
    endPump();
});

process.on('uncaughtException', function (err) {
    console.log('Shit! bug->' + err);
    endPump();
});
