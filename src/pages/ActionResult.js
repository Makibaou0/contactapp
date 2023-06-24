import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Box} from 'native-base';
import AnimatedLottieView from 'lottie-react-native';
const ActionResult = route => {
  const Navigation = route.route.navigation;
  const params = route.route.route.params;
  useEffect(() => {
    setTimeout(() => {
      Navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }, 1500);
  }, []);
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
