import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Surface, Button, Title, Paragraph, Subheading } from 'react-native-paper';
import { Gyroscope } from 'expo-sensors';
import React, { useState, useEffect } from 'react';
import * as Device from 'expo-device';
import * as Cellular from 'expo-cellular';
export default function App() {
  let memory = Math.round((Device.totalMemory)/1073741824)+1;
  let uptime = 0;
  let root = "false";
  let cell ="Null";
  let gen = "unknown"
  async function Periksa(){
    uptime = await Device.getUptimeAsync();
    root = await Device.isRootedExperimentalAsync();
    cell = await Cellular.getCarrierNameAsync();
    gen = await Cellular.getCellularGenerationAsync();
  }
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  const _fast = () => {
    Gyroscope.setUpdateInterval(100);
  };

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;

  Periksa();

  return (
    <View style={styles.container}>
      <Text style={styles.judul}>Hp-mu!</Text>
      <Surface style={styles.mainSurface}>
        <Text style={styles.head}>Info {Device.deviceName}!</Text>
        <Text style={styles.desc}>Model:  {Device.modelName} </Text>
        <Text style={styles.desc}>Memory :  {memory}GB</Text>
        <Text style={styles.desc}>Versi Android:  {Device.osVersion}</Text>
        <Text style={styles.desc}>Vendor:  {Device.manufacturer}</Text>
        <Text style={styles.desc}>Codename:  {Device.productName}</Text>
      </Surface>
      <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent: 'space-evenly'}}>
        <Surface style={styles.surface}>
          <Text Text style={styles.mini}>Rooted </Text>
          <Text style={styles.desc}>{root}</Text>
        </Surface>
        <Surface style={styles.surface}>
          <Text style={styles.mini}>Provider </Text>
          <Text style={styles.desc}>{cell}</Text>
          <Text style={styles.desc}>Tipe : {gen}</Text>
        </Surface>
        <Surface style={styles.surface}>
          <Text style={styles.mini}>Gyroscope</Text>
          <Text style={styles.desc}>
            x:{Math.round(x)} y:{Math.round(y)} z:{Math.round(z)}
          </Text>
        </Surface>
        <Surface style={styles.surface}>
          <Text style={styles.mini}>Uptime </Text>
          <Text style={styles.desc}>{uptime}</Text>
        </Surface>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  mini: {
    fontSize: 15,
    fontWeight: "bold",
  },
  desc: {
    marginLeft:5,
    alignSelf: 'stretch',
    fontSize:15,
    fontWeight: "normal"
  },
  judul: {
    marginBottom:20,
    marginTop: 40,
    fontSize: 35,
  },
  head: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  mainSurface: {
    padding: 8,
    margin:10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
  },
  surface: {
    margin:5,
    padding: 8,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 7,
  }
});
