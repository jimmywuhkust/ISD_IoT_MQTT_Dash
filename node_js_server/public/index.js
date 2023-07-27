// Import MQTT service
import { MQTTService } from "./mqttService.js";

// Target specific HTML items
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");

// Holds the background color of all chart
var chartBGColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-background"
);
var chartFontColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-font-color"
);
var chartAxisColor = getComputedStyle(document.body).getPropertyValue(
  "--chart-axis-color"
);

/*
  Event listeners for any HTML click
*/
menuBtn.addEventListener("click", () => {
  sideMenu.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  sideMenu.style.display = "none";
});

themeToggler.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme-variables");
  themeToggler.querySelector("span:nth-child(1)").classList.toggle("active");
  themeToggler.querySelector("span:nth-child(2)").classList.toggle("active");

  // Update Chart background
  chartBGColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-background"
  );
  chartFontColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-font-color"
  );
  chartAxisColor = getComputedStyle(document.body).getPropertyValue(
    "--chart-axis-color"
  );
  updateChartsBackground();
});

/*
  Plotly.js graph and chart setup code
*/
var OnlineHistoryDiv = document.getElementById("Online-history");
var AvailableHistoryDiv = document.getElementById("Available-history");
var FullHistoryDiv = document.getElementById("Full-history");
var MaintainceHistoryDiv = document.getElementById("Maintaince-history");

var OnlineGaugeDiv = document.getElementById("Online-gauge");
var AvailableGaugeDiv = document.getElementById("Available-gauge");
var FullGaugeDiv = document.getElementById("Full-gauge");
var MaintainceGaugeDiv = document.getElementById("Maintaince-gauge");

const historyCharts = [
  OnlineHistoryDiv,
  AvailableHistoryDiv,
  FullHistoryDiv,
  MaintainceHistoryDiv,
];

const gaugeCharts = [
  OnlineGaugeDiv,
  AvailableGaugeDiv,
  FullGaugeDiv,
  MaintainceGaugeDiv,
];

// History Data
var OnlineTrace = {
  x: [],
  y: [],
  name: "Online",
  mode: "lines+markers",
  type: "line",
};
var AvailableTrace = {
  x: [],
  y: [],
  name: "Available",
  mode: "lines+markers",
  type: "line",
};
var FullTrace = {
  x: [],
  y: [],
  name: "Full",
  mode: "lines+markers",
  type: "line",
};
var MaintainceTrace = {
  x: [],
  y: [],
  name: "Maintaince",
  mode: "lines+markers",
  type: "line",
};

var OnlineLayout = {
  autosize: true,
  title: {
    text: "Online",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 10 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
    autorange: true,
  },
};
var AvailableLayout = {
  autosize: true,
  title: {
    text: "Available",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var FullLayout = {
  autosize: true,
  title: {
    text: "Full",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};
var MaintainceLayout = {
  autosize: true,
  title: {
    text: "Maintaince",
  },
  font: {
    size: 12,
    color: chartFontColor,
    family: "poppins, san-serif",
  },
  colorway: ["#05AD86"],
  margin: { t: 40, b: 40, l: 30, r: 30, pad: 0 },
  plot_bgcolor: chartBGColor,
  paper_bgcolor: chartBGColor,
  xaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
    gridwidth: "2",
  },
  yaxis: {
    color: chartAxisColor,
    linecolor: chartAxisColor,
  },
};

var config = { responsive: true, displayModeBar: false };

// Event listener when page is loaded
window.addEventListener("load", (event) => {
  Plotly.newPlot(
    OnlineHistoryDiv,
    [OnlineTrace],
    OnlineLayout,
    config
  );
  Plotly.newPlot(AvailableHistoryDiv, [AvailableTrace], AvailableLayout, config);
  Plotly.newPlot(FullHistoryDiv, [FullTrace], FullLayout, config);
  Plotly.newPlot(MaintainceHistoryDiv, [MaintainceTrace], MaintainceLayout, config);

  // Get MQTT Connection
  fetchMQTTConnection();

  // Run it initially
  handleDeviceChange(mediaQuery);
});

// Gauge Data
var OnlineData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Online" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 30] },
      steps: [
        { range: [0, 10], color: "lightpink" },
        { range: [10, 20], color: "lightyellow" },
        { range: [20, 30], color: "lightgreen" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var AvailableData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Available" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 100 },
    gauge: {
      axis: { range: [null, 100] },
      steps: [
        { range: [0, 60], color: "lightpink" },
        { range: [60, 80], color: "lightyellow" },
        { range: [80, 100], color: "lightgreen" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var FullData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Full" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 30] },
      steps: [
        { range: [0, 10], color: "lightpink" },
        { range: [10, 20], color: "lightyellow" },
        { range: [20, 30], color: "lightgreen" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var MaintainceData = [
  {
    domain: { x: [0, 1], y: [0, 1] },
    value: 0,
    title: { text: "Maintaince" },
    type: "indicator",
    mode: "gauge+number+delta",
    delta: { reference: 30 },
    gauge: {
      axis: { range: [null, 30] },
      steps: [
        { range: [0, 10], color: "lightpink" },
        { range: [10, 20], color: "lightyellow" },
        { range: [20, 30], color: "lightgreen" },
      ],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 30,
      },
    },
  },
];

var layout = { width: 300, height: 250, margin: { t: 0, b: 0, l: 0, r: 0 } };

Plotly.newPlot(OnlineGaugeDiv, OnlineData, layout);
Plotly.newPlot(AvailableGaugeDiv, AvailableData, layout);
Plotly.newPlot(FullGaugeDiv, FullData, layout);
Plotly.newPlot(MaintainceGaugeDiv, MaintainceData, layout);

// Will hold the arrays we receive from our BME280 sensor
// Online
let newTempXArray = [];
let newTempYArray = [];
// Available
let newAvailableXArray = [];
let newAvailableYArray = [];
// Full
let newFullXArray = [];
let newFullYArray = [];
// Maintaince
let newMaintainceXArray = [];
let newMaintainceYArray = [];

// Array of all the device id
let Device_Array = [];

// Array of all the device id only
let Device_Array_id = [];

// The maximum number of data points displayed on our scatter/line graph
let MAX_GRAPH_POINTS = 12;
let ctr = 0;

// Callback function that will retrieve our latest sensor readings and redraw our Gauge with the latest readings
function updateSensorReadings(jsonResponse) {
  console.log(typeof jsonResponse);
  console.log(jsonResponse);

// Rubbish Bin Class
class Bin {
  constructor(deviceId) {
    this.deviceId = deviceId;
    this.user = "Newuser";
    this.Full = false;
    this.Maintenance = false;
  }

  updateStatus(user, isFull, isMaintenance) {
    let myValue = true;
    this.user = user;
    this.Full = JSON.parse(isFull.toLowerCase());;
    this.Maintenance = JSON.parse(isMaintenance.toLowerCase());;
  }
}

class Bins {
  constructor() {
    this.allbins = []; // Corrected the property name from "players" to "allbins"
  }

  // create a new bin and save it in the collection
  newbin(name) {
    let b = new Bin(name);
    this.allbins.push(b);
    return b;
  }

  get numberOfBins() {
    return this.allbins.length;
  }
}

let instance = new Bins();

let deviceId = jsonResponse.Device;
let Device = jsonResponse.Device;

// Device Array
let Online;
if (Device_Array_id.includes(deviceId)) {
  Online = Device_Array.length;
  const existingBin = Device_Array.find((bin) => bin.deviceId === deviceId);
  existingBin.updateStatus(jsonResponse.User, jsonResponse.Full, jsonResponse.Status);
  console.log(`${deviceId} is still online.`);
} else {
  Device_Array.push(new Bin(deviceId));
  Device_Array_id.push(Device);
  instance.newbin(deviceId);
  const newBin = Device_Array[Device_Array.length - 1];
  newBin.updateStatus(jsonResponse.User, jsonResponse.Full, jsonResponse.Status);
  console.log(`${deviceId} is online.`);
}

// Output all items in Device_Array
console.log("Device_Array:", Device_Array);

Online = Device_Array.length;

let Available_count = 0;
let Full_count = 0;
let Maintaince_count = 0;
for (let i = 0; i < Device_Array.length; i++) {
  if (Device_Array[i].Full == false) {
    Available_count++;
  }
  if (Device_Array[i].Full == true) {
    Full_count++;
  }
  if (Device_Array[i].Maintenance == true) {
    Maintaince_count++;
  }
}

let Available = ((Available_count / Device_Array.length) * 100).toFixed(2);
let Full = Full_count;
let Maintaince = Maintaince_count;

  updateBoxes(Online, Available, Full, Maintaince);

  updateGauge(Online, Available, Full, Maintaince);

  // Update Online Line Chart
  updateCharts(
    OnlineHistoryDiv,
    newTempXArray,
    newTempYArray,
    Online
  );
  // Update Available Line Chart
  updateCharts(
    AvailableHistoryDiv,
    newAvailableXArray,
    newAvailableYArray,
    Available
  );
  // Update Full Line Chart
  updateCharts(
    FullHistoryDiv,
    newFullXArray,
    newFullYArray,
    Full
  );

  // Update Maintaince Line Chart
  updateCharts(
    MaintainceHistoryDiv,
    newMaintainceXArray,
    newMaintainceYArray,
    Maintaince
  );
}

function updateBoxes(Online, Available, Full, Maintaince) {
  let OnlineDiv = document.getElementById("Online");
  let AvailableDiv = document.getElementById("Available");
  let FullDiv = document.getElementById("Full");
  let MaintainceDiv = document.getElementById("Maintaince");

  OnlineDiv.innerHTML = Online;
  AvailableDiv.innerHTML = Available + " %";
  FullDiv.innerHTML = Full;
  MaintainceDiv.innerHTML = Maintaince + " down";
}

function updateGauge(Online, Available, Full, Maintaince) {
  var Online_update = {
    value: Online,
  };
  var Available_update = {
    value: Available,
  };
  var Full_update = {
    value: Full,
  };
  var Maintaince_update = {
    value: Maintaince,
  };
  Plotly.update(OnlineGaugeDiv, Online_update);
  Plotly.update(AvailableGaugeDiv, Available_update);
  Plotly.update(FullGaugeDiv, Full_update);
  Plotly.update(MaintainceGaugeDiv, Maintaince_update);
}

function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
  if (xArray.length >= MAX_GRAPH_POINTS) {
    xArray.shift();
  }
  if (yArray.length >= MAX_GRAPH_POINTS) {
    yArray.shift();
  }
  xArray.push(ctr++);
  yArray.push(sensorRead);

  var data_update = {
    x: [xArray],
    y: [yArray],
  };

  Plotly.update(lineChartDiv, data_update);
}

function updateChartsBackground() {
  // updates the background color of historical charts
  var updateHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));

  // updates the background color of gauge charts
  var gaugeHistory = {
    plot_bgcolor: chartBGColor,
    paper_bgcolor: chartBGColor,
    font: {
      color: chartFontColor,
    },
    xaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
    yaxis: {
      color: chartAxisColor,
      linecolor: chartAxisColor,
    },
  };
  gaugeCharts.forEach((chart) => Plotly.relayout(chart, gaugeHistory));
}

const mediaQuery = window.matchMedia("(max-width: 600px)");

mediaQuery.addEventListener("change", function (e) {
  handleDeviceChange(e);
});

function handleDeviceChange(e) {
  if (e.matches) {
    console.log("Inside Mobile");
    var updateHistory = {
      width: 323,
      height: 250,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  } else {
    var updateHistory = {
      width: 550,
      height: 260,
      "xaxis.autorange": true,
      "yaxis.autorange": true,
    };
    historyCharts.forEach((chart) => Plotly.relayout(chart, updateHistory));
  }
}

/*
  MQTT Message Handling Code
*/
const mqttStatus = document.querySelector(".status");

function onConnect(message) {
  mqttStatus.textContent = "Connected";
}
function onMessage(topic, message) {
  var stringResponse = message.toString();
  var messageResponse = JSON.parse(stringResponse);
  updateSensorReadings(messageResponse);
}

function onError(error) {
  console.log(`Error encountered :: ${error}`);
  mqttStatus.textContent = "Error";
}

function onClose() {
  console.log(`MQTT connection closed!`);
  mqttStatus.textContent = "Closed";
}

function fetchMQTTConnection() {
  fetch("/mqttConnDetails", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      initializeMQTTConnection(data.mqttServer, data.mqttTopic);
    })
    .catch((error) => console.error("Error getting MQTT Connection :", error));
}
function initializeMQTTConnection(mqttServer, mqttTopic) {
  console.log(
    `Initializing connection to :: ${mqttServer}, topic :: ${mqttTopic}`
  );
  var fnCallbacks = { onConnect, onMessage, onError, onClose };

  var mqttService = new MQTTService(mqttServer, fnCallbacks);
  mqttService.connect();

  mqttService.subscribe(mqttTopic);
}
