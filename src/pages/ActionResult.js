import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Box} from 'native-base';
import AnimatedLottieView from 'lottie-react-native';
import axios from 'axios';
import {storage} from '../utils/statis';
const ActionResult = route => {
  const Navigation = route.route.navigation;
  const params = route.route.route.params;
  useEffect(() => {
    GETALL();
  });
  const GETALL = async () => {
    axios
      .get('https://contact.herokuapp.com/contact')
      .then(res => {
        storage.set('CONTACT', JSON.stringify(res.data.data));
        setTimeout(() => {
          Navigation.reset({
            index: 0,
            routes: [{name: 'Home', params: res.data.data}],
          });
        }, 1000);
      })
      .catch(err => {
        setTimeout(() => {
          Navigation.reset({
            index: 0,
            routes: [{name: 'Home', params: []}],
          });
        }, 1000);
      });
  };
  return (
    <Box flex={1}>
      {params == 'Success' ? (
        <AnimatedLottieView
          source={require('../assets/lotties/success.json')}
          autoPlay
          loop={false}
        />
      ) : (
        <AnimatedLottieView
          source={require('../assets/lotties/error.json')}
          autoPlay
          loop={false}
        />
      )}
    </Box>
  );
};

export default ActionResult;
