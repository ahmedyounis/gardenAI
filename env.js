var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var pump = new Gpio(pumpGPIO, 'out'); //use GPIO pin 4, and specify that it is output
var pumpRunning = false;
var sleep = require('sleep');

let pumpGPIO = 23;
let waterTime = 120;    // TIME TO WATER THE PLANTS IN SECCONDS


// Initializations
if (pump.readSync() === 0) {
} else {
    pump.writeSync(0);
}


// Main program 
while (pumpRunning = true) {
    runPump();
    console.log('sleeping for 1 hour');
    sleep.sleep(3600)
}



// Functions 

function runPump() {
    console.log('Running Water Pump');
    pump.writeSync(1); 
    sleep.sleep(waterTime);  
    pump.writeSync(0); 
    console.log('Stopping Water Pump');
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
