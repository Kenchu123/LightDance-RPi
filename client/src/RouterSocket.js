const http = require('http');
const express = require('express');
const Websocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new Websocket.Server({server});

class RouterSocket {
    constructor(ws){
        this.ws = null;
        this.init(ws);
    }
    init = (ws) => {
        this.ws = ws;
    }
    handleMessage = () => {
        this.ws.onmessage = (message) => {
            const [task, payload] = JSON.parse(message.data);
            console.log('Task: ' + task + ', payload: ' + payload);
        }
    }
    sendDataToRpiSocket = (data) => {
        if (this.ws !== null) this.ws.send(JSON.stringify(data));
    }
    start = () => {
        this.sendDataToRpiSocket(["start"]);
    }
    play = (startTime = 0, whenToPlay = 0) => {
        this.sendDataToRpiSocket([
            "play",
            {
                startTime: startTime,
                whenToPlay: whenToPlay
            }
        ]);
    }
    pause = () => {
        this.sendDataToRpiSocket(["pause"]);
    }
    stop = () => {
        this.sendDataToRpiSocket(["stop"]);
    }
    load = () => {
        this.sendDataToRpiSocket(["load"]);
    }
    terminate = () => {
        this.sendDataToRpiSocket(["terminate"]);
    }
    kick = () => {
        this.sendDataToRpiSocket(["kick"]);
    }
    uploadControl = (timelineFile) => {  //needs to be json file
        this.sendDataToRpiSocket([
            "uploadControl",
            timelineFile
        ]);
    }
    uploadLED = (LEDPic = []) => {
        this.sendDataToRpiSocket([
            "uploadLED",
            LEDPic
        ]);
    }
    shutDown = () => {
        this.sendDataToRpiSocket(["shutDown"]);
    }
    reboot = () => {
        this.sendDataToRpiSocket(["reboot"]);
    }
}

//below are for testing
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output:  process.stdout
})
//above are for testing

wss.on('connection', (ws) => {
    const routerSocket = new RouterSocket(ws);
    routerSocket.handleMessage();
    //below are for testing
    rl.on("line", (input) => {
        console.log(`Your input: ${input}`);
        switch(input){
            case "start":
                routerSocket.start();
                break;
            case "play":
                routerSocket.play();
                break;
            case "pause":
                routerSocket.pause();
                break;
            case "stop":
                routerSocket.stop();
                break;
            case "load":
                routerSocket.load();
                break;
            case "terminate":
                routerSocket.terminate();
                break;
            case "kick": 
                routerSocket.kick();
                break;
            case "uploadControl":
                routerSocket.uploadControl({  //testing json file
                    testing: 1,
                    filename: "test",
                    currenttime: 1111111,
                    data: "asdfasdfasdfa"
                });
                break;
            case "uploadLed":
                routerSocket.uploadLED();
                break;
            case "shutDown":
                routerSocket.shutDown();
                break;
            case "reboot":
                routerSocket.reboot();
                break;
        }
    });
    //above are for testing
});

const PORT = 4000;

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
});