let pumpGPIO = 23;
let waterTime = 120;        // TIME TO WATER THE PLANTS IN SECCONDS
let waterBreakTime = 3600;  // TIME TO WAIT IN BETWEEN WATER CYCLES

// IMPORTS
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var pump = new Gpio(pumpGPIO, 'out'); //use GPIO pin 4, and specify that it is output
var pumpRunning = false;
var sleep = require('sleep');
const cliProgress = require('cli-progress');
const { exec } = require("child_process");



// INIT
if (pump.readSync() === 0) {
} else {
    pump.writeSync(0);
}


// MAIN  
while (pumpRunning = true) {

    exec("./hum.c", (error, stdout, stderr) => console.log(stdout));

    runPump();
    console.log('sleeping for 1 hour');
    progBar(waterBreakTime)
    sleep.sleep(3600)
}



// FUNCTIONS 

function runPump() {
    console.log('Running Water Pump');
    pump.writeSync(1);
    progBar(waterTime)
    pump.writeSync(0);
    console.log('Stopping Water Pump');
}


function progBar(waterTime) {
    const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar1.start(100, 0);
    var i;
    for (i=0;i<waterTime;i=i+10) {
        bar1.update(i);
        sleep.sleep(waterTime/10);
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
