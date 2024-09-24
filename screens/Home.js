import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weather, setWeather] = useState(null); 
  const [emoji, setEmoji] = useState(null);
  const apiKey = '5b162971d5e26e14dd66ea2de2f42a9c';

  // Função para obter o clima com base na latitude e longitude
  const getWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      if (data.cod !== 200) {
        Alert.alert('Erro', 'Clima não encontrado.');
      } else {
        setWeather(data);
        setEmoji(data.weather[0].icon); // Atualiza o ícone do clima
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar os dados do clima.');
    }
  };

  useEffect(() => {
    (async () => {
      // Solicitar permissão para acessar a localização
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar localização foi negada');
        return;
      }

      // Capturar a localização atual
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Depois de capturar a localização, consultar o clima
      const { latitude, longitude } = location.coords;
      getWeather(latitude, longitude);
    })();
  }, []);

  let text = 'Aguardando...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Localização: Lat ${location.coords.latitude}, Lon ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>{text}</Text>

      {weather && (
        <View>
          <Text>Clima Atual: {weather.weather[0].description}</Text>
          <Text>Temperatura: {weather.main.temp}°C</Text>
          <Text>Ícone: {emoji}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
