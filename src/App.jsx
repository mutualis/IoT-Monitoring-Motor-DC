import "./App.css";
import { useState, useEffect } from "react";
import logo from "./assets/logo.png";
import moment from "moment";
const dateTime = new Date();

import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { db } from "./firebaseConfig";
import { Pie, PieChart, Cell } from "recharts";
function map(x, in_min, in_max, out_min, out_max) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function App() {
  const [speed, setSpeed] = useState();
  const [volt, setVolt] = useState();
  const [cw, setCw] = useState();
  const [ccw, setCcw] = useState();

  useEffect(() => {
    const dbRef = getDatabase();
    const query = ref(dbRef, "dataPBL");
    return onValue(query, (snapshot) => {
      const data = snapshot.val();
      var inVolt = map(data.val, 0, 1023, 0, 500);

      if (inVolt >= 0 && inVolt <= 100) {
        setCw(0);
        setCcw(0);
        setSpeed(0);
        var voltOut = 0;
      } else if (inVolt > 100 && inVolt <= 300) {
        setCw(1);
        setCcw(0);
        var inSpeed = map(inVolt, 101, 300, 0, 1800);
        setSpeed(Math.ceil(inSpeed));
        var voltOut = map(inSpeed, 0, 1800, 0, 900);
      } else if (inVolt > 300 && inVolt <= 500) {
        setCw(0);
        setCcw(1);
        var inSpeed = map(inVolt, 301, 500, 0, 1800);
        setSpeed(Math.ceil(inSpeed));
        var voltOut = map(inSpeed, 0, 1800, 0, 900);
      }
      setVolt((voltOut / 100).toFixed(2));
    });
  }, []);

  console.log(cw, ccw, speed, volt);
  var inCw = document.getElementById("idCw");

  var inCcw = document.getElementById("idCcw");
  if (cw == 1) {
    inCw.style.backgroundColor = "#29bf12";
  } else if (cw == 0) {
    inCw.style.backgroundColor = "#ECEFF4";
  }
  if (ccw == 1) {
    inCcw.style.backgroundColor = "#29bf12";
  } else if (ccw == 0) {
    inCcw.style.backgroundColor = "#ECEFF4";
  }

  var months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  var myDays = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jum&#39;at",
    "Sabtu",
  ];

  var date = new Date();

  var day = date.getDate();

  var month = date.getMonth();

  var thisDay = date.getDay(),
    thisDay = myDays[thisDay];

  var yy = date.getYear();

  var year = yy < 1000 ? yy + 1900 : yy;

  if (speed >= 0 && speed <= 2400) {
    var barSpeed = speed;
  } else if (speed > 2400) {
    var barSpeed = 2400;
  }
  const data = [{ value: barSpeed }, { value: 1800 - barSpeed }];

  if (speed >= 0 && speed <= 1500) {
    var color = "#29bf12";
  } else if (speed > 1500 && speed <= 1700) {
    var color = "#ff9914";
  } else if (speed > 1700) {
    var color = "#f21b3f";
  }
  function jam() {
    var time = new Date(),
      hours = time.getHours(),
      minutes = time.getMinutes(),
      seconds = time.getSeconds();
    document.querySelectorAll(".jam")[0].innerHTML =
      ", " + harold(hours) + ":" + harold(minutes) + ":" + harold(seconds);

    function harold(standIn) {
      if (standIn < 10) {
        standIn = "0" + standIn;
      }
      return standIn;
    }
  }
  setInterval(jam, 1000);

  return (
    <>
      <div className="container">
        <div className="header bag">
          <div className="left">
            <h1>Monitoring Panel - PBL</h1>
            <p className="waktu">
              {thisDay + ", " + day + " " + months[month] + " " + year}
              <div className="jam"></div>
            </p>
          </div>
          <div className="right">
            <img src={logo} alt="Logo" />
          </div>
        </div>
        <main>
          <div className="bag bag1">
            <div className="in1">
              <h2>Clockwise</h2>
              <div className="lamp cw" id="idCw"></div>
            </div>
            <div className="in2">
              <h2>Counterclockwise</h2>
              <div className="lamp ccw" id="idCcw"></div>
            </div>
          </div>
          <div className="bag bag2">
            <div className="rpm">
              <div className="chart">
                <PieChart height={260} width={400}>
                  <Pie
                    startAngle={180}
                    endAngle={0}
                    innerRadius="55%"
                    data={data}
                    dataKey="value"
                    nameKey="op"
                    labelLine={true}
                    blendStroke
                    onMouseLeave={false}
                    isAnimationActive={true}
                    cy={"50%"}>
                    <Cell fill={color} />
                    <Cell fill="#ECEFF4" />
                  </Pie>
                </PieChart>
              </div>
              <div className="value">{speed}</div>
              <p>RPM</p>
            </div>
            <div className="volt">
              <h2>Voltage</h2>
              <div className="val">
                <div className="value">{volt}</div>
                <p>Volt</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
