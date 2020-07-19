// Globals
let pumpGPIO = 23;
let waterTime = 60;        // TIME TO WATER THE PLANTS IN SECCONDS
let waterBreakTime = 3600;  // TIME TO WAIT IN BETWEEN WATER CYCLES in seconds

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

var pump = new Gpio(pumpGPIO, 'out'); //use GPIO pin 4, and specify that it is output
var pumpRunning = false;


// IMPORTS
const cliProgress = require('cli-progress');
const { exec } = require("child_process");
var sleep = require('sleep');
var CronJob = require('cron').CronJob;



// INITIALIZATION 
if (pump.readSync() === 0) {
} else {
    pump.writeSync(0);
}


// initialize cron job: pump the water every 10 minutes. 
var pumpWater = new CronJob('* */20 * * * *', function() {
        //const d = new Date();
        runPump();
    }, null, true, 'America/Los_Angeles');    
// start the cron job
pumpWater.start();



// MAIN  NOT NEEDED 
// while (pumpRunning = true) {

//     // get the humidity
//     //exec("./hum.c", (error, stdout, stderr) => console.log(stdout));

//     // run the pump and display progress bar
//     runPump();
//     console.log('sleeping...');
//     progBar(waterBreakTime)
//     //sleep.sleep(waterBreakTime * 60)
// }


// FUNCTIONS 
function runPump() {
    console.log('Running Water Pump');
    pump.writeSync(1);
    progBar(waterTime);
    pump.writeSync(0);
    console.log('Stopping Water Pump');
}


// TODO: WEB INTERFACE, graphs of soil humidity, air temp & humidity, night and day, camera
// Terminal progress bar


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


// NOT ACTUALLY WORKING
function endPump() { 
    console.log('Stoping Pump');
    pump.writeSync(0); // Turn off the pump   
    pump.unexport(); //   Free GPIO resources
}


// Make an exit
process.on('exit', function (err) {
    endPump();
});


// When Shit hits the fan
process.on('uncaughtException', function (err) {
    console.log('Shit! bug->' + err);
    endPump();
});
