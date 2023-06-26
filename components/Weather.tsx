import React from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInput,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
//@ts-ignore
import thiteey from '../images/30.png';
//@ts-ignore
import below10 from '../images/-10.png';
//@ts-ignore
import location from '../images/location3.png';
//@ts-ignore
import tweenty from '../images/20.png';
//@ts-ignore
import tweentySeven from '../images/27.png';
//@ts-ignore
import nine from '../images/29.png';
//@ts-ignore
import degree from '../images/degree.png';

interface State {
  latitude: number;
  longitude: number;
  error: string;
  city: string;
  temp: string;
  cityName: string;
  input: string;
}

class Weather extends React.Component<State> {
  state = {
    latitude: 0,
    longitude: 0,
    error: '',
    city: '',
    temp: "",
    cityName: '',
    input: '',
  };

  componentDidMount() {
    this.requestLocationPermission();
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            this.setState(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: '',
              },
              () => this.getCity(this.state.latitude, this.state.longitude),
            );
          },
          error => this.setState({error: error.message}),
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
        );
      } else {
        this.setState({error: 'Location permission denied'});
      }
    } catch (err) {
      console.warn(err);
    }
  }
  onText = (text: string) => {
    this.setState({input: text});
  };

  onSubmit = () => {
    const {input} = this.state;
    console.log("input",input);
    
    this.setState({city: input},()=>{
      this.getWeather(this.state.city)
    });
  };
  getCity = async (latitude: number, longitude: number) => {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=65e244d7d5d44a22a7110d086eeb7219`,
    );
    const data = await res.json();
    console.log(data.results[0].components.city);
    this.setState({city: data.results[0].components.city}, () =>
      this.getWeather(this.state.city),
    );
  };
  getWeather = async (city:string) => {
    console.log("city123",city);
    
    const responce = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=dbb705cdfc814910a4d60145232705&q=${city}`,
    );
    const result = await responce.json();
    console.log(result.current.temp_c);
    console.log('city', result.location.name);
    this.setState({
      temp: result.current.temp_c,
      cityName: result.location.name,
    });
  };

 
  render() {
    const {temp, cityName} = this.state;
    console.log('res', temp, cityName);
    let bacckgroundImage = thiteey;
    if (parseInt(temp) < 0) {
      console.log('-10');

      bacckgroundImage = below10;
    } else if ( parseInt(temp) <= 20) {
      console.log("14");
      
      bacckgroundImage = tweenty;
    } else if ( parseInt(temp) <= 27) {
      console.log("27");
      
      bacckgroundImage = tweentySeven;
    } else if ( parseInt(temp) <= 29) {
      bacckgroundImage = tweentySeven;
    } else if ( parseInt(temp) <= 30) {
      bacckgroundImage = tweentySeven;
    }

    return (
      <View>
        <ImageBackground
          source={bacckgroundImage}
          resizeMode="cover"
          style={styles.image}>
          <View style={styles.container}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text style={{fontSize: 45, color: 'white', marginRight: 20}}>
                {this.state.temp}C
              </Text>
              <View style={{marginTop: 15}}>
                <Text style={{color: 'white'}}>H : {temp}</Text>
                <Text style={{color: 'white'}}>L : 12 </Text>
              </View>
            </View>

            <View
              style={{display: 'flex', flexDirection: 'row', marginTop: 25}}>
              <Image style={{width: 14, height: 16}} source={location} />
              <Text style={{color:"white",marginLeft:10}}>{this.state.cityName}</Text>
            </View>
          </View>
          <View style={styles.secondCard}>
            <TextInput
              onChangeText={this.onText}
              style={styles.input}
              placeholder="Enter city name here"
            />
            <TouchableOpacity onPress={this.onSubmit}>
              <Text style={styles.button}>submit</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    height: '100%',
  },
  input: {
    backgroundColor: '#EADEDE',
    borderRadius: 13,
    borderWidth: 0,
    width: 250,

    marginLeft: 80,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#EADEDE',
    width: 100,
    height: 40,
    padding: 10,
    marginTop: 50,
    textAlign: 'center',
    marginLeft: 150,
    borderRadius: 13,
  },
  secondCard: {
    marginTop: 250,
  },
  container: {
    width: 250,
    marginLeft: 230,
    marginTop: 70,
  },
});

export default Weather;
