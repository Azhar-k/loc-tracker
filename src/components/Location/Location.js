import React, { Component } from 'react'
import { Plugins } from '@capacitor/core';
import { db } from '../../firebase-config'
import { IonButton, IonCard, IonCardTitle, IonCardContent, IonItem, IonLoading, IonRow, IonGrid, IonCol, IonItemDivider } from '@ionic/react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { relative } from 'path';
// import { BgLocationEvent, BgGeolocationAccuracy } from "capacitor-background-geolocation";

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
  // .catch(erroe => {

  // })
  

BackgroundGeolocation.addListener("onLocation", (location) => {

  const loc = new Location();
  //loc.printToLog("new location detected : " + "lat = " + location.latitude + ", long = " + location.longitude + ", time stamp = " + location.time);

  //loc.setLocation(location.latitude, location.longitude, location.locationAccuracy + " m", location.speed, location.time);
  loc.pushLocation('testing',location.latitude,location.longitude);
  
  // loc.setState({
  //   initialLoading: false
  // })
  // Put your logic here.
});
  // .
  // catch(error => {
  //   this.setLocation(11.2345, 75.12323, 'Showing fake location', 'NIL', 'NIL');
  //   console.log('No web and IOS implementation for background location')
  //   this.printToLog('No web and IOS implementation for background location')
  //   this.setState({
  //     initialLoading: false
  //   })
  // })

class Location extends Component {


  state = {
    latitude: 'loading...',
    longitude: 'loading...',
    speed: 'loading',
    accuracy: 'loading',
    locationUpdatedTime: 'loading',
    initialLoading: false,
    log: [],
    pushingLocation: false,
    manualpushing: false,

  }

  componentDidMount = () => {
    console.log('component mounted')
    //this.startGeoLocation();
  }
  // startGeoLocation = () => {

  //   BackgroundGeolocation.initialize({
  //     notificationText: "Location Tracker is running, tap to open.",
  //     notificationTitle: "Location Tracker",
  //     updateInteval: 10000,
  //     //requestedAccuracy: BgGeolocationAccuracy.HIGH_ACCURACY,
  //     // Small icon has to be in 'drawable' resources of your app
  //     // if you does not provide it or it is not found a fallback icon will be used.
  //     smallIcon: "ic_small_icon",
  //   });
  //     // .catch(erroe => {

  //     // })
      

  //   BackgroundGeolocation.addListener("onLocation", (location) => {
  //     this.printToLog("new location detected : " + "lat = " + location.latitude + ", long = " + location.longitude + ", time stamp = " + location.time);

  //     this.setLocation(location.latitude, location.longitude, location.locationAccuracy + " m", location.speed, location.time);
  //     this.pushLocation('continues location monitoring');
      
  //     this.setState({
  //       initialLoading: false
  //     })
  //     // Put your logic here.
  //   });
  //   //   //.
  //   //   // catch(error => {
  //   //   //   this.setLocation(11.2345, 75.12323, 'Showing fake location', 'NIL', 'NIL');
  //   //   //   console.log('No web and IOS implementation for background location')
  //   //   //   this.printToLog('No web and IOS implementation for background location')
  //   //   //   this.setState({
  //   //   //     initialLoading: false
  //   //   //   })
  //   //   // })
      

  // }

  setLocation = (latitude, longitude, accuracy, speed, time) => {
    this.setState({
      latitude: latitude,
      longitude: longitude,
      accuracy: accuracy,
      speed: speed,
      locationUpdatedTime: time,
    })

  }

  printToLog = (data) => {

    // if (this.state.log.length > 30) {
    //   this.setState({
    //     log: ['log cleared after 30 entries']
    //   })
    // }
    // const formattedData = new Date().toLocaleString() + ' : ' + data
    // this.state.log.push(formattedData);
  }

  pushLocation = (source,lat,long) => {
    const date = new Date();
    const updation_time = date.toLocaleString();
    const rootRef = db.ref('locations');
    rootRef.push({
      latitude : lat,
      longitude: long
      // latitude: this.state.latitude,
      // longitude: this.state.longitude,
      // accuracy: this.state.accuracy,
      // speed: this.state.speed,
      // source: source,
      // locationUpdatedTime: this.state.locationUpdatedTime,
      // time: updation_time,

    }).then((response) => {
      console.log('pushing successfull')
     // this.printToLog("pushed to database, Source : " + source);
    }).catch(error => {
      //this.printToLog(error);

    });
  }


  goForegroundBtnHandler = () => {
    BackgroundGeolocation.goForeground();
  }
  stopForegroundBtnHandler = () => {
    BackgroundGeolocation.stopForeground();
  }

  manualPushBtnHandler = () => {

    this.pushLocation('manual push')
  }


  getApplicationLog = () => {

    let logContent = (
      this.state.log.map((data, index) => {
        return <IonItem key={index}>{data}</IonItem>
      })
    );
    return (
      <IonCard>
        <IonCardTitle>
          <IonCardTitle>Application Log</IonCardTitle>
        </IonCardTitle>
        {logContent}
        <IonCardContent>

        </IonCardContent>
      </IonCard>);
  }

  getLocationDetails = () => {
    return (<IonCard>
      <IonCardTitle>
        <IonCardTitle>Location Details</IonCardTitle>
      </IonCardTitle>

      <IonCardContent>
        <p>Latitude : {this.state.latitude}</p>
        <p>Longitude : {this.state.longitude}</p>
        <p>Accuracy : {this.state.accuracy}</p>
        <p>Speed : {this.state.speed}</p>
      </IonCardContent>
    </IonCard>);
  }

  getMapView = () => {
    const mapStyles = {
      width: '100%',
      height: '200px',

    };
    if (this.state.initialLoading) {
      return null
    }
    return (
      <div style={mapStyles}>
        <Map
          google={this.props.google}
          zoom={10}
          initialCenter={{ lat: this.state.latitude, lng: this.state.longitude }}
        >
          <Marker lat={this.state.latitude} log={this.state.longitude} />
        </Map>
      </div>


    )
  }

  render() {


    // let applicationLog = this.getApplicationLog();
    // let locationDetails = this.getLocationDetails();
    // let mapView = this.getMapView();

    return (
      <IonGrid>

        <IonRow>
          <IonCol size={12}>
            <IonLoading isOpen={this.state.initialLoading} />
            {/* <IonButton onClick={this.goForegroundBtnHandler}>Go Foreground</IonButton>
            <IonButton onClick={this.stopForegroundBtnHandler}>Stop Foreground</IonButton> */}
            <IonButton onClick={this.manualPushBtnHandler}>Manual Push</IonButton>
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size={12}>
            {/* {locationDetails} */}
          </IonCol>
        </IonRow>

        <IonRow>
          <IonCol size={12}>
            {/* {mapView} */}
          </IonCol>
        </IonRow>
        <IonItemDivider />
        <IonRow>
          <IonCol size={12}>
            {/* {applicationLog} */}
          </IonCol>
        </IonRow>

      </IonGrid>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCdvIE86J76z5rS_Dj8gko - kJDCN7pgsMI'
})(Location);
