import {Dimensions} from 'react-native';
import axios from 'axios';
export const WW = Dimensions.get('screen').width;
export const WH = Dimensions.get('screen').height;
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();
export const GETALL = async () => {
  axios
    .get('https://contact.herokuapp.com/contact')
    .then(res => {
      storage.set('CONTACT', JSON.stringify(res.data.data));
    })
    .catch(err => {
      console.error(err);
    });
};
export const DEFAULTIMAGE =
  'https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg';
