import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider, extendTheme, StatusBar} from 'native-base';
import Home from './src/pages/Home';
import Splash from './src/pages/Splash';
import Detail from './src/pages/Detail';
import {LogBox} from 'react-native';
import ActionResult from './src/pages/ActionResult';

LogBox.ignoreAllLogs();

const theme = extendTheme({
  fontConfig: {
    Poppins: {
      100: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      200: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      300: {
        normal: 'Poppins-Light',
        italic: 'Poppins-LightItalic',
      },
      400: {
        normal: 'Poppins-Regular',
        italic: 'Poppins-Italic',
      },
      500: {
        normal: 'Poppins-Medium',
      },
      600: {
        normal: 'Poppins-Medium',
        italic: 'Poppins-MediumItalic',
      },

      700: {
        normal: 'Poppins-Bold',
      },
      800: {
        normal: 'Poppins-Bold',
        italic: 'Poppins-BoldItalic',
      },
      900: {
        normal: 'Poppins-Bold',
        italic: 'Poppins-BoldItalic',
      },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  },
});
const Stack = createNativeStackNavigator();
const HomeScreen = route => {
  return <Home route={route} />;
};
const SplashScreen = route => {
  return <Splash route={route} />;
};
const DetailScreen = route => {
  return <Detail route={route} />;
};
const ActionScreen = route => {
  return <ActionResult route={route} />;
};

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Action" component={ActionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
