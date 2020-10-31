import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, Alert } from 'react-native'
import { WebView } from 'react-native-webview'
import { HTMLString } from './index.js'

const API_KEY = 'AIzaSyBjqJsnirCA0gmfTSjFPLPiGp_8sU2u2vc'

// Web view can inject js into the view as string
const injectJS = `
 function initPano() {
  const initialLocation ={ lat: 42.345573, lng: -71.098326 }  

 const map = new window.google.maps.Map(document.getElementById("map"), {
   center: initialLocation,
   zoom: 14,
 });
 const panorama = new window.google.maps.StreetViewPanorama(
   document.getElementById("pano"),
   {
     position: initialLocation,
     pov: {
       heading: 34,
       pitch: 10,
     },
     motionTracking: true,
     visible: true
   }
 );
 map.setStreetView(panorama);
 panorama.addListener("pov_changed", function(){
  const heading  = panorama.getPov().heading;
  const pitch =  panorama.getPov().pitch;
  window.ReactNativeWebView.postMessage(''+heading+','+pitch+'');
 });
}
initPano()
 true;
`

export default function App() {
  const [povs, setPovs] = useState([])
  const [currentPov, setCurrentPov] = useState({
    heading: 34,
    pitch: 10
  })
  const precise = x => {
    return Number.parseFloat(x).toPrecision(6)
  }
  const handleMessage = e => {
    const messageString = e.nativeEvent.data
    const [heading, pitch] = messageString.split(',')
    setCurrentPov(() => ({ heading, pitch }))
  }
  const savePointOfView = () => {
    const containsExistingPov = povs.find(
      p => p.heading === currentPov.heading && p.pitch === currentPov.pitch
    )
    if (!containsExistingPov) {
      setPovs(p => [...p, currentPov])
      return
    }
    Alert.alert('This Point Of View has already been captured')
  }
  const clearPointOfView = () => {
    setPovs(p => [])
  }
  const { heading, pitch } = currentPov
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.row}></View>
        <View style={styles.row}>
          <Text style={styles.BoldTypography}>
            POV:{' '}
            <Text style={styles.typography}>Heading: {precise(heading)}</Text>
            &nbsp;<Text style={styles.typography}>
              Pitch: {precise(pitch)}
            </Text>{' '}
          </Text>
          <Button
            disabled={!povs.length}
            title='Clear POV'
            onPress={clearPointOfView}
          />
          <Button title='Save POV' onPress={savePointOfView} />
        </View>
        <View style={styles.row}>
          <Text style={styles.info}>Saved POVS: {povs.length}</Text>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <WebView
          onMessage={handleMessage}
          originWhitelist={['*']}
          javaScriptEnabledAndroid={true}
          javaScriptEnabled={true}
          source={{ html: HTMLString(API_KEY) }}
          injectedJavaScript={injectJS}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  textContainer: {
    flex: 1,
    width: '100%'
  },
  mapContainer: {
    flex: 3,
    width: '100%'
  },
  row: {
    flex: 1,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  typography: {
    fontSize: 14,
    color: '#222',
    fontWeight: 'bold'
  },
  BoldTypography: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold'
  },
  info: {
    fontSize: 22,
    color: '#222',
    fontWeight: 'bold'
  }
})
