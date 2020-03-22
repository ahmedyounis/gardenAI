var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var pump = new Gpio(23, 'out'); //use GPIO pin 4, and specify that it is output
var pumpRunning = false;
var sleep = require('sleep');


// make sure the pump is off
if (pump.readSync() === 0) {
} else {
    pump.writeSync(0);
}


function runPump() {
    console.log('Running Pump');
    pump.writeSync(1);
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


while (pumpRunning = true) {
    runPump();
    console.log('sleep for 60 sec');
    sleep.sleep(5);
    endPump();

}