var timeout;
var interval;

var setDate;
var pauseDate;
var alarmDate;

var arroflinks=["https://www.youtube.com/watch?v=YBozZ7ydV3g",    
    "https://www.youtube.com/watch?v=w7x_lWJNnNg",
    "https://www.youtube.com/watch?v=ug8Dcz3kyOA",
    "https://www.youtube.com/watch?v=9UMW8Q--dDE",
    "https://youtu.be/Yer8Ck-wFVU",
    "https://www.youtube.com/watch?v=C3a6iES_T-8",
    "https://www.youtube.com/watch?v=vanP07y1Xgw",
    "https://www.youtube.com/watch?v=gCWtlMztwWE",
    "https://www.youtube.com/watch?v=OWbtxdq5rvQ",
    "https://www.youtube.com/watch?v=2DwDvKxbJ1M",
    "https://youtu.be/A_m7r5CJI7Y",
    "https://youtu.be/F48_PVjQp4M",
    "https://www.youtube.com/watch?v=MRN21DyBchI&ab_channel=ViralPaws",
    "https://www.youtube.com/watch?v=jXsdKpOWL1U",
    "https://youtu.be/IQxTpMLvlvo",
    "https://youtu.be/xwQZefvw4KE",
    "https://youtu.be/tZ57x7dBjeI",
    "https://youtu.be/FIyG14NCzBM",
    "https://www.youtube.com/watch?v=4t0I10eMoJU",
    "https://www.youtube.com/watch?v=42IO2BoGpOg&ab_channel=KenjiTheShiba",
    "https://youtu.be/kNAsP0JkOjY",
    "https://www.youtube.com/watch?v=2V1fYJntoFA&ab_channel=RapidLiquid",
    "https://youtu.be/uhm8_fhWlNM",
    "https://youtu.be/g5rK8EguOsQ",
    "https://youtu.be/kAsSFzXvicY",
    "https://www.youtube.com/watch?v=fQVhppRP4Wo&ab_channel=SaveAFox",
    "https://youtu.be/IaVpYsXm0BA",
    "https://www.youtube.com/watch?v=WdIfjzreRnM&ab_channel=PlasticIvory",
    "https://www.youtube.com/watch?v=5OWOQF3dWi0&ab_channel=SarahandtheWolves",
    "https://youtu.be/cW37LQ8NRRc",
    "https://youtu.be/9i1d6xLw-0w",
    "https://youtu.be/9QAojowD4v8",
    "https://youtu.be/XehLZLOyVUc",
    "https://youtu.be/_iheBIrh30Q",
    "https://youtu.be/ybNtdLt6kJU",
    "https://youtu.be/BJ3kw3o9Hzs",
    "https://youtu.be/oMV1GMmyK8A",
    "https://youtu.be/1a9-0QNbTD8",
    "https://youtu.be/1H4_9UP2OZI",
    "https://youtu.be/G3tTwHQ9eSY",
    "https://youtu.be/Iw7w8ooAtIE",
    "https://youtu.be/wzoShIOJfNU",
    "https://youtu.be/mpp6-a3ckaM",
    "https://youtu.be/B-eeNvUEGDk",
    "https://youtu.be/4qSQX3PGcXw",
    "https://youtu.be/-CNymheDE3M",
    "https://youtu.be/1kzkfES-Hig",
    "https://youtu.be/KA-DryAZanM",
    "https://youtu.be/oNCsJS_nuT4",
    "https://www.youtube.com/watch?v=2V1fYJntoFA"]

var greenColor = [76, 187, 23, 255];
var yellowColor = [250, 150, 0, 255];
var guiLagAdjustment = 500;

var alarmSound = new Audio("chime.mp3");

function setAlarm(tMillis)
{
    interval = tMillis;
    ringIn(tMillis + guiLagAdjustment);
}

function ringIn(tMillis)
{
    clearTimeout(timeout);
    pauseDate = null;

    var tSecs = parseInt(tMillis / 1000);
    var tMins = parseInt(tSecs / 60);
    var secs = tSecs % 60;
    var tHrs = parseInt(tMins / 60);
    var mins = tMins % 60;
    var millis = tMillis % 1000;

    alarmDate = new Date();
    // alarmDate.setTime(alarmDate.getTime() + millis);
    alarmDate.setHours(alarmDate.getHours() + tHrs);
    alarmDate.setMinutes(alarmDate.getMinutes() + mins);
    alarmDate.setSeconds(alarmDate.getSeconds() + secs);
    alarmDate.setMilliseconds(alarmDate.getMilliseconds() + millis);

    setDate = new Date();
    timeout = setTimeout(ring, alarmDate.getTime() - setDate.getTime());

    chrome.browserAction.setBadgeBackgroundColor({color:greenColor});
    setInterval(function() {
        chrome.browserAction.setBadgeText({text: getTimeLeftString()});
    }, 1000);
}

function pause()
{
    pauseDate = new Date();
    clearTimeout(timeout);
    chrome.browserAction.setBadgeBackgroundColor({color:yellowColor});
}

function resume()
{
    var remainingAfterPause = (alarmDate.getTime() - pauseDate.getTime());
    ringIn(remainingAfterPause);
}

function restart()
{
    ringIn(interval + guiLagAdjustment);
}

function getTimeLeft()
{
    if (pauseDate)
        return (alarmDate.getTime() - pauseDate.getTime());

    var now = new Date();
    return (alarmDate.getTime() - now.getTime());
}

function getTimeLeftPercent()
{
    return parseInt(getTimeLeft() / interval * 100);
}

function getTimeLeftString()
{
    var until = getTimeLeft();
    var tSecs = parseInt(until / 1000);
    var tMins = parseInt(tSecs / 60);
    var secs = tSecs % 60;
    var tHrs = parseInt(tMins / 60);
    var mins = tMins % 60;
    if(secs < 10) secs = "0" + secs;
    if(mins < 10) mins = "0" + mins;
    if(tHrs < 10) tHrs = "0" + tHrs;
    return ((tHrs > 0 ? tHrs + ":" : "") + mins + ":" + secs);
}

function didCreateNotification(notificationId) {}

function ring()
{
    var options = {
        type: "basic",
        title: "Let\'s Relax",
        message: "A cute video awaits you !",
        iconUrl: "focus_buddy_image.png",
        priority: 2
    }
    chrome.notifications.create("", options, didCreateNotification);
    chrome.tabs.create({ url:  arroflinks[Math.floor(Math.random() * 50)]});
    alarmSound.play();
    turnOff();
}

function turnOff()
{
    clearTimeout(timeout);
    interval = 0;
    alarmDate = null;
    pauseDate = null;
    setDate = null;
    chrome.browserAction.setBadgeText({text: ""});
}

function error()
{
    alert("Please enter a number between 1 and 240.");
}
