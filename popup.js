var refreshDisplayTimeout;
var timer;
var timeoutID;
var bgpage = chrome.extension.getBackgroundPage();
var previousValues = [3, 5, 10, 30];
var editing = false;

document.addEventListener('DOMContentLoaded', function () {
    load();
    document.querySelector('#start').addEventListener('click', setTotalTimer);
    document.querySelector('#cancel').addEventListener('click', reset);
    // document.querySelector('#wrench').addEventListener('click', swap);
    document.querySelector('#pause').addEventListener('click', pauseTimer);
    document.querySelector('#resume').addEventListener('click', resumeTimer);
    document.querySelector('#restart').addEventListener('click', restartTimer);
});

function show(section)
{
    document.getElementById(section).style.display = "block";
}

function showInline(section)
{
    document.getElementById(section).style.display = "inline";
}

function hide(section)
{
    document.getElementById(section).style.display = "none";
}

function load()
{
    hide("settings");
    hide("modify");
    hide("resume");
    editing = false;

    // if timer is paused, show resume button and hide pause button
    if(bgpage.pauseDate)
    {
        showInline("resume");
        hide("pause");
    }

    // loads custom times if they exist
    // for(var i = 0; i < document.choices.radio.length; i++)
    //     if(localStorage[i] != null)
    //         document.getElementById("s"+i).textContent = localStorage[i];

    // if timer is off, show settings
    if(!bgpage.alarmDate)
    {
        show("settings");
        hide("display");
    }

    // else, show countdown
    else
    {
        show("display");
        refreshDisplay();
        show("modify");
    }
}

function setFocusTimer (focusmillis)
{
    console.log ("Entered set focus timer");
    bgpage.setAlarm (focusmillis);
    hide("settings");
    show("modify");
    show("display");
    refreshDisplay();
}

function setTotalTimer()
{
    var total = document.getElementById("totaltime").value;
    var focus = document.getElementById("focustime").value;
    var totalmillis = total * 60000;
    var focusmillis = focus * 60000;

    // run timer once before setInterval can start running timer
    setFocusTimer (focusmillis);

    timer = setInterval (function () {
        setFocusTimer(focusmillis);
        console.log ("Inside setInterval");
    }, focusmillis);

    setTimeout (function () {
        clearInterval (timer);
    }, totalmillis);

    console.log (total);
    console.log (focus);
}

function refreshDisplay()
{
    percent = bgpage.getTimeLeftPercent();

    if(percent < 15)
        document.getElementById("bar").style.color = "grey";
    document.getElementById("bar").textContent = bgpage.getTimeLeftString();
    document.getElementById("bar").style.width = percent + "%";

    refreshDisplayTimeout = setTimeout(refreshDisplay, 100);
}

function pauseTimer()
{
    hide("pause");
    showInline("resume");
    bgpage.pause();
    clearTimeout(refreshDisplayTimeout);
}

function resumeTimer()
{
    hide("resume");
    showInline("pause");
    refreshDisplay();
    bgpage.resume();
}

function restartTimer()
{
    hide("resume");
    showInline("pause");
    refreshDisplay();
    bgpage.restart();
}

function reset()
{
    clearTimeout(refreshDisplayTimeout);
    clearInterval(timer);
    bgpage.turnOff();
    hide("display");
    show("settings");
    hide("modify");
}