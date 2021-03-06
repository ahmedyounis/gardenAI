// IMPORTS
var config = require('./config');
const cliProgress = require('cli-progress');
const { exec } = require("child_process");
var sleep = require('sleep');
const CronJob = require('cron').CronJob;

// rpie GPIO setup
let pumpGPIO = config.pumpGPIO;
//include onoff to interact with the GPIO
var Gpio = require('onoff').Gpio; 
var pump = new Gpio(pumpGPIO, 'out'); //use GPIO pin pumpGPIO, and specify that it is output


const waterTime = config.waterTime;       
const interval = config.interval;


// INITIALIZATION 
if (pump.readSync() === 0) {
} else {
    pump.writeSync(0);
}

//const myArgs = process.argv.slice(2);
//console.log('Passing parrameters: ', myArgs);


// initialize cron job: pump the water every 10 minutes. 
/*
CRON SYNTAX
Seconds: 0-59
Minutes: 0-59
Hours: 0-23
Day of Month: 1-31
Months: 0-11 (Jan-Dec)
Day of Week: 0-6 (Sun-Sat)
*/
var pumpWater = new CronJob('0 */' + interval + ' * * * *', function() {
        //const d = new Date();
        runPump(); 
        const d = new Date();
        console.log('Every : ', interval, d);
    }, null, true, 'America/New_York');    
// start the cron job
console.log('cron initilized.');
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
    const d = new Date();
    console.log('Running Water Pump ', d);
    pump.writeSync(1);
    progBar(waterTime);
    pump.writeSync(0);
    const e = new Date();
    console.log('Stopping Water Pump', e);
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
process.on('SIGINT', function (err) {
    endPump();
    process.stdout.write('\n end \n');
    process.exit();
});


// When Shit hits the fan
process.on('uncaughtException', function (err) {
    console.log('Shit! bug->' + err);
    endPump();
});
