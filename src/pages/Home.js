import {SafeAreaView} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {
  AddIcon,
  Button,
  HStack,
  Image,
  Input,
  SearchIcon,
  StatusBar,
  Text,
  ScrollView,
  Box,
  FlatList,
  VStack,
  Pressable,
  useDisclose,
  Actionsheet,
  Spinner,
} from 'native-base';
import {DEFAULTIMAGE, WH, WW, storage} from '../utils/statis';
import {launchImageLibrary} from 'react-native-image-picker';

import axios from 'axios';

const Home = route => {
  const Navigation = route.route.navigation;
  const dataParams = route.route.route.params;
  const [DATACONTACT, setDATACONTACT] = useState(dataParams);
  const [filteredData, setFilteredData] = useState(dataParams);

  const {isOpen, onOpen, onClose} = useDisclose();
  const [loading, setloading] = useState(false);
  const [PHOTO, setPHOTO] = useState(DEFAULTIMAGE);
  const [FIRSTNAME, setFIRSTNAME] = useState('');
  const [LASTNAME, setLASTNAME] = useState('');
  const [AGE, setAGE] = useState('');

  useEffect(() => {
    GETALL();
    const interval = setInterval(GETALL, 50000);

    return () => clearInterval(interval);
  }, []);

  const GETALL = async () => {
    axios
      .get('https://contact.herokuapp.com/contact')
      .then(res => {
        setDATACONTACT(res.data.data);
        setFilteredData(res.data.data);
        storage.set('CONTACT', JSON.stringify(res.data.data));
        setloading(false);
      })
      .catch(err => {
        console.error(err);
      });
  };
  const generateSections = data => {
    const sections = [];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < alphabet.length; i++) {
      const letter = alphabet[i];
      const filteredContacts = data.filter(contact => {
        return contact.firstName.charAt(0).toUpperCase() === letter;
      });

      if (filteredContacts.length > 0) {
        sections.push({
          title: letter,
          data: filteredContacts,
        });
      }
    }
    return sections;
  };

  const sections = generateSections(filteredData);
  const handleSearch = text => {
    const filtered = DATACONTACT.filter(
      item =>
        item.firstName.toLowerCase().includes(text.toLowerCase()) ||
        item.lastName.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };
  const handleOpen = item => {
    onOpen();
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.3,
      includeBase64: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Image picker canceled');
      } else if (response.error) {
        console.log('Image picker error:', response.error);
      } else {
        const mime = response.assets[0].type;
        const base64 = response.assets[0].base64;
        const result = `data:${mime};base64,${base64}`;

        setPHOTO(result);
      }
    });
  };

  const handleSubmit = async () => {
    onClose();
    setloading(true);
    const formData = new FormData();
    formData.append('file', PHOTO);
    formData.append('upload_preset', 'igbns4pu'); // Ganti dengan nama unsigned upload preset Anda

    fetch('https://api.cloudinary.com/v1_1/dhmp3ixa4/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        setPHOTO(data.secure_url);
        const params = {
          firstName: FIRSTNAME,
          lastName: LASTNAME,
          age: new Number(AGE),
          photo: data.secure_url,
        };

        axios
          .post('https://contact.herokuapp.com/contact', params)
          .then(res => {
            Navigation.navigate('Action', 'Success');
          })
          .catch(err => {
            Navigation.navigate('Action', 'Error');
            console.log(err);
          });
        // Alert.alert('Image Uploaded', 'Image uploaded successfully!');
      })
      .catch(error => {
        console.log('Image upload error:', error);
      });
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
      }}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      {loading && (
        <Box justifyContent={'center'} alignItems={'center'} w={WW} h={WH}>
          <Spinner animating={true} size="lg" color="blue" />
        </Box>
      )}
      <HStack p={4} justifyContent={'space-between'} alignItems={'center'}>
        <Image
          source={{
            uri: 'https://wallpaperaccess.com/full/317501.jpg',
          }}
          alt="Alternate Text"
          size="xs"
          rounded={'full'}
        />
        <Text fontWeight={'600'} fontSize="lg">
          Contacts
        </Text>
        <Button
          rounded={'xl'}
          bg="blue.600"
          colorScheme="blue"
          onPress={() => handleOpen()}>
          <AddIcon color="white" />
        </Button>
      </HStack>
      <Input
        onChangeText={TEXT => handleSearch(TEXT)}
        mx={4}
        rounded={'md'}
        borderWidth={0}
        bg="blueGray.200"
        fontSize={'md'}
        my={5}
        placeholder="Search"
        leftElement={<SearchIcon size={'md'} ml={4} color="gray.400" />}
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 200,
        }}>
        <FlatList
          pl={4}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={DATACONTACT.slice(2, 10)}
          renderItem={({item, index}) => {
            let a = item.photo;
            if (a.length < 20) {
              a = 'https://img.freepik.com/free-icon/user_318-563642.jpg?w=360';
            }
            return (
              <Pressable
                my={5}
                w={WW * 0.3}
                rounded="lg"
                onPress={() => Navigation.navigate('Detail', item)}>
                <VStack space={3} rounded="lg">
                  <Box shadow={3}>
                    <Image
                      rounded={'xl'}
                      source={{
                        uri: a,
                      }}
                      alt="img contact"
                      size="lg"
                    />
                  </Box>
                  <Text
                    fontWeight={600}
                    w={WW * 0.25}
                    fontSize="md"
                    numberOfLines={1}>
                    {item.firstName + ' ' + item.lastName}
                  </Text>
                </VStack>
              </Pressable>
            );
          }}
        />
        {sections.map((item, index) => {
          return (
            <Box key={index} bg="white" rounded="lg">
              <Box py={2} px={4} bg="blueGray.100">
                <Text fontWeight={800} fontSize="lg">
                  {item.title}
                </Text>
              </Box>
              {[...item.data]
                .sort((a, b) => a.firstName.localeCompare(b.firstName))
                .map((item, index) => {
                  let a = item.photo;
                  if (a.length < 20) {
                    a =
                      'https://img.freepik.com/free-icon/user_318-563642.jpg?w=360';
                  }
                  return (
                    <Pressable
                      key={index}
                      onPress={() => Navigation.navigate('Detail', item)}>
                      <HStack p={4} space={4}>
                        <Image
                          source={{
                            uri: a,
                          }}
                          alt="images "
                          size="sm"
                          rounded={'lg'}
                        />
                        <VStack
                          borderColor={'blueGray.300'}
                          flex={1}
                          borderBottomWidth={1}>
                          <Text fontSize="md">
                            {item.firstName + ' ' + item.lastName}
                          </Text>
                          <Text color={'gray.500'} fontSize="sm">
                            {item.age}
                          </Text>
                        </VStack>
                      </HStack>
                    </Pressable>
                  );
                })}
            </Box>
          );
        })}
      </ScrollView>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <VStack
            px={2}
            space={4}
            justifyContent={'center'}
            alignItems={'center'}>
            <Box justifyContent={'center'} alignItems={'center'}>
              <Image
                source={{
                  uri: PHOTO,
                }}
                alt="Alternate Text"
                size="2xl"
              />
              <Button
                onPress={() => handleImagePicker()}
                rounded="full"
                colorScheme={'blue'}
                position={'absolute'}>
                <AddIcon color="white" size="3xl" />
              </Button>
            </Box>
            <HStack space={2} alignItems={'center'}>
              <Text w={WW * 0.2} fontSize="sm">
                First Name
              </Text>

              <Input
                onChangeText={TEXT => setFIRSTNAME(TEXT)}
                fontSize={'sm'}
                bgColor={'white'}
                flex={1}
                placeholder=""
              />
            </HStack>
            <HStack space={2} alignItems={'center'}>
              <Text w={WW * 0.2} fontSize="sm">
                Last Name
              </Text>

              <Input
                onChangeText={TEXT => setLASTNAME(TEXT)}
                fontSize={'sm'}
                bgColor={'white'}
                flex={1}
                placeholder=""
              />
            </HStack>
            <HStack space={2} alignItems={'center'}>
              <Text w={WW * 0.2} fontSize="sm">
                Age
              </Text>

              <Input
                onChangeText={TEXT => setAGE(TEXT)}
                fontSize={'sm'}
                bgColor={'white'}
                flex={1}
                placeholder=""
              />
            </HStack>
            <Button
              w={WW * 0.6}
              colorScheme="blue"
              onPress={() => handleSubmit()}>
              <Text fontWeight={'800'} fontSize="md" color="white">
                Save
              </Text>
            </Button>
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </SafeAreaView>
  );
};

export default Home;
