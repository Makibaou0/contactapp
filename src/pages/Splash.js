import {Box, StatusBar, Text, VStack} from 'native-base';
import React, {useEffect} from 'react';
import Lottie from 'lottie-react-native';
import {GETALL, storage} from '../utils/statis';
import axios from 'axios';
const Splash = route => {
  const Navigation = route.route.navigation;
  useEffect(() => {
    GETALL();
  });
  const GETALL = async () => {
    axios
      .get('https://contact.herokuapp.com/contact')
      .then(res => {
        storage.set('CONTACT', JSON.stringify(res.data.data));
        Navigation.reset({
          index: 0,
          routes: [{name: 'Home', params: res.data.data}],
        });
      })
      .catch(err => {
        console.error(err);
      });
  };
  return (
    <VStack
      alignItems={'center'}
      justifyContent={'center'}
      bg="blue.600"
      flex={1}>
      <StatusBar backgroundColor={'#2563eb'} />

      <Text fontWeight={'800'} color="white" fontSize="3xl">
        Contact App
      </Text>
      <Lottie
        style={{
          width: '100%',
        }}
        source={require('../assets/lotties/contact.json')}
        autoPlay
      />
    </VStack>
  );
};

export default Splash;
