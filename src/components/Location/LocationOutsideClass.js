import React, { Component } from 'react'
import { Plugins } from '@capacitor/core';
import { db } from '../../firebase-config'
import { BgLocationEvent, BgGeolocationAccuracy } from "capacitor-background-geolocation";

const { BackgroundGeolocation } = Plugins;

BackgroundGeolocation.initialize({
    notificationText: "Location Tracker is running, tap to open.",
    notificationTitle: "Location Tracker",
    updateInteval: 10000,
    //requestedAccuracy: BgGeolocationAccuracy.HIGH_ACCURACY,
    // Small icon has to be in 'drawable' resources of your app
    // if you does not provide it or it is not found a fallback icon will be used.
    smallIcon: "ic_small_icon",
});


BackgroundGeolocation.addListener("onLocation", (location) => {

    console.log(location.latitude)
    // const date = new Date();
    // const updation_time = date.toLocaleString();
    // const rootRef = db.ref('locations');
    // const source ='outside class'
    // rootRef.push({
    //     latitude: location.latitude,
    //     longitude: location.longitude,
    //     accuracy: location.locationAccuracy,
    //     speed: location.speed,
    //     source: source,
    //     locationUpdatedTime: location.time,
    //     time: updation_time,

    // }).then((response) => {
    //     //this.printToLog("pushed to database, Source : " + source);
    //     console.log('success')
    // }).catch(error => {
    //     //this.printToLog(error);

    // });
    // Put your logic here.
});
