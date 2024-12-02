import { Pressable, StyleSheet, Text, View, Appearance } from 'react-native';
import { useEffect, useState } from 'react';
import {
  getBrightness,
  resetBrightness,
  setBrightness,
} from '@jiroscripts/react-native-device-brightness';

export default function App() {
  const [currentBrightness, setCurrentBrightness] = useState<number>();

  useEffect(() => {
    getBrightness().then(setCurrentBrightness);
  }, []);

  function _setFullBrightness() {
    return setBrightness(1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => _setFullBrightness().then(setCurrentBrightness)}
        >
          <Text>Set full brightness</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => resetBrightness().then(setCurrentBrightness)}
        >
          <Text>Reset brightness</Text>
        </Pressable>
      </View>

      <Text style={styles.text}>Current brightness: {currentBrightness}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 32,
  },
  buttons: {
    rowGap: 16,
  },
  button: {
    padding: 8,
    backgroundColor: 'grey',
    alignItems: 'center',
  },
  text: {
    color: Appearance.getColorScheme() === 'light' ? 'black' : 'white',
  },
});
