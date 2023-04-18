"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var kafkajs_1 = require("kafkajs");
// Create a Kafka client instance
var kafka = new kafkajs_1.Kafka({
    brokers: ['localhost:9092'],
    logLevel: kafkajs_1.logLevel.ERROR, // Specify the log level (optional)
});
// Create a Kafka producer instance
var producer = kafka.producer();
var partition = 100;
var topic = 'my-topic';
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var messages, i, message, partition_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, producer.connect()];
                case 1:
                    _a.sent();
                    messages = [
                        { value: 'Hello, Kafka! 1' },
                        { value: 'Hello, Kafka! 2' },
                        { value: 'Hello, Kafka! 3' },
                    ];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < messages.length)) return [3 /*break*/, 5];
                    message = messages[i];
                    partition_1 = i % 3;
                    return [4 /*yield*/, producer.send({
                            topic: topic,
                            messages: [message],
                            acks: -1,
                            timeout: 3000,
                            compression: 0,
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, producer.disconnect()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// run().catch(console.error);
function hashCode(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
function sendMessage(topic, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var index, element, partition_2, kafkaMessages, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, producer.connect()];
                case 1:
                    _a.sent();
                    index = 0;
                    _a.label = 2;
                case 2:
                    if (!(index < payload.length)) return [3 /*break*/, 7];
                    element = payload[index];
                    partition_2 = Math.abs(hashCode(element.key)) % 10;
                    console.log("partition is: ", partition_2);
                    kafkaMessages = [{
                            key: element.key,
                            value: element.value,
                            partition: partition_2, // assuming 3 partitions
                        }];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, producer.send({
                            topic: topic,
                            messages: kafkaMessages,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 6];
                case 6:
                    index++;
                    return [3 /*break*/, 2];
                case 7: return [4 /*yield*/, producer.disconnect()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Call the sendMessage function to send messages to Kafka with different partitions
var counter = 0;
var intervalId = setInterval(function () {
    counter++;
    if (counter > 100) {
        clearInterval(intervalId);
        return;
    }
    sendMessage('my-topic', [
        { key: Date.now().toString(), value: 'Hello, Kafka! 1' },
        { key: Date.now().toString(), value: 'Hello, Kafka! 2' },
        { key: Date.now().toString(), value: 'Hello, Kafka! 3' },
        { key: Date.now().toString(), value: 'Hello, Kafka! 4' },
        { key: Date.now().toString(), value: 'Hello, Kafka! 5' },
        { key: Date.now().toString(), value: 'Hello, Kafka! 6' },
        { key: Date.now().toString(), value: 'Hello, Kafka! 7' }
    ]);
    console.log("Sending");
}, 2000);
// sendMessage('my-topic', [
//   { key: Date.now().toString(), value: 'Hello, Kafka! 1' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 2' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 3' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 4' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 5' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 6' },
//   { key: Date.now().toString(), value: 'Hello, Kafka! 7' }
// ]);
// sendMessage('my-topic', ['Hello Kafka! 2', 'How are you? 2', 'Goodbye Kafka! 2'], 1); 
// sendMessage('my-topic', ['Hello Kafka! 3', 'How are you? 3', 'Goodbye Kafka! 3'], 2);
// Define an async function to send messages to Kafka
// async function sendMessage(topic: string, messages: string[]) {
//   await producer.connect();
//   await producer.send({
//     topic,
//     messages: messages.map((message) => ({ value: message })),
//   });
//   await producer.disconnect();
// }
// Call the sendMessage function to send messages to Kafka
// sendMessage('my-topic', ['Hello Kafka!', 'How are you?', 'Goodbye Kafka!']);
