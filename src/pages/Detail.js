import {SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {
  Actionsheet,
  AddIcon,
  Box,
  Button,
  Center,
  ChevronLeftIcon,
  HStack,
  Image,
  Input,
  Pressable,
  Spinner,
  Text,
  ThreeDotsIcon,
  VStack,
  useDisclose,
} from 'native-base';
import PencilIcon from '../assets/icons/PencilIcon';
import {DEFAULTIMAGE, WH, WW} from '../utils/statis';
import ChatIcon from '../assets/icons/ChatIcon';
import PhoneIcon from '../assets/icons/PhoneIcon';
import VideoIcon from '../assets/icons/VideoIcon';
import EmailIcon from '../assets/icons/EmailIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import QRIcon from '../assets/icons/QRIcon';
import PlaneIcon from '../assets/icons/PlaneIcon';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
const Detail = route => {
  const Navigation = route.route.navigation;
  const params = route.route.route.params;
  const id = params.id;
  const {isOpen, onOpen, onClose} = useDisclose();
  const [loading, setloading] = useState(false);
  const [PHOTO, setPHOTO] = useState(params.photo);
  const [FIRSTNAME, setFIRSTNAME] = useState(params.firstName);
  const [LASTNAME, setLASTNAME] = useState(params.lastName);
  const [AGE, setAGE] = useState(params.age);
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
    console.log(params.photo);
    if (PHOTO !== params.photo) {
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
            .put(`https://contact.herokuapp.com/contact/${id}`, params)
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
    } else {
      const data = {
        firstName: FIRSTNAME,
        lastName: LASTNAME,
        age: new Number(AGE),
        photo: params.photo,
      };

      axios
        .put(`https://contact.herokuapp.com/contact/${id}`, data)
        .then(res => {
          Navigation.navigate('Action', 'Success');
        })
        .catch(err => {
          Navigation.navigate('Action', 'Error');
          console.log(err);
        });
    }
  };
  const handleOpen = item => {
    onOpen();
  };
  return (
    <Box bg="white" flex={1}>
      <SafeAreaView>
        {loading && (
          <Box justifyContent={'center'} alignItems={'center'} w={WW} h={WH}>
            <Spinner animating={true} size="lg" color="blue" />
          </Box>
        )}
        <HStack p={4} justifyContent={'space-between'}>
          <Button
            rounded={'2xl'}
            bg="white"
            colorScheme="blue"
            onPress={() => Navigation.goBack()}>
            <ChevronLeftIcon size={22} color="blue.500" />
          </Button>
          <Button
            rounded={'2xl'}
            colorScheme="blue"
            onPress={() => handleOpen()}>
            <PencilIcon size={22} color="white" />
          </Button>
        </HStack>

        <VStack p={4} space={3} justifyContent={'center'} alignItems={'center'}>
          <Box shadow="3">
            <Image
              source={{
                uri: params.photo.length > 20 ? params.photo : DEFAULTIMAGE,
              }}
              alt="Alternate Text"
              size="xl"
              rounded={'3xl'}
            />
          </Box>
          <VStack alignItems={'center'}>
            <Text fontSize="xl">
              {params.firstName + ' ' + params.lastName}
            </Text>
            <Text color="gray.400" fontSize="lg">
              {params.age} Tahun
            </Text>
          </VStack>
          <HStack w="100%" justifyContent={'space-evenly'}>
            <Button
              shadow={3}
              colorScheme={'success'}
              size={49}
              rounded="lg"
              bg="success.500">
              <ChatIcon size={28} color="white" />
            </Button>
            <Button
              shadow={3}
              colorScheme={'blue'}
              size={49}
              rounded="lg"
              bg="blue.500">
              <PhoneIcon size={26} color="white" />
            </Button>
            <Button
              sahadow={3}
              colorScheme={'danger'}
              size={49}
              rounded="lg"
              bg="danger.500">
              <VideoIcon size={28} color="white" />
            </Button>
            <Button
              shadow={3}
              colorScheme="blueGray"
              size={49}
              rounded="lg"
              bg="blueGray.200">
              <EmailIcon width={34} height={40} color="black" />
            </Button>
          </HStack>
        </VStack>
        <Box p={3} bg="blueGray.100" />
        <VStack p={4} space={4}>
          <VStack space={1}>
            <Text color="gray.500" fontSize="lg">
              Mobile
            </Text>
            <HStack alignItems={'center'} justifyContent={'space-between'}>
              <Text fontWeight={'600'} fontSize="md">
                (087) 2743-2934
              </Text>
              <HStack space={6} alignItems={'center'}>
                <Pressable
                  _pressed={{
                    opacity: 0,
                  }}
                  onPress={() => {
                    console.log('hello');
                  }}>
                  <ChatIcon size={30} color="gray" />
                </Pressable>
                <Pressable
                  _pressed={{
                    opacity: 0,
                  }}
                  onPress={() => {
                    console.log('hello');
                  }}>
                  <PhoneIcon size={24} color="gray" />
                </Pressable>
              </HStack>
            </HStack>
          </VStack>
          <VStack space={1}>
            <Text color="gray.500" fontSize="lg">
              Home
            </Text>
            <HStack alignItems={'center'} justifyContent={'space-between'}>
              <Text fontWeight={'600'} fontSize="md">
                (021) 2743-2934
              </Text>
              <HStack space={6} alignItems={'center'}>
                <Pressable
                  _pressed={{
                    opacity: 0,
                  }}
                  onPress={() => {
                    console.log('hello');
                  }}>
                  <ChatIcon size={30} color="gray" />
                </Pressable>
                <Pressable
                  _pressed={{
                    opacity: 0,
                  }}
                  onPress={() => {
                    console.log('hello');
                  }}>
                  <PhoneIcon size={24} color="gray" />
                </Pressable>
              </HStack>
            </HStack>
          </VStack>
          <VStack space={1}>
            <Text color="gray.500" fontSize="lg">
              Home
            </Text>
            <HStack alignItems={'center'} justifyContent={'space-between'}>
              <Text fontWeight={'600'} fontSize="md">
                (021) 2743-2934
              </Text>

              <Pressable
                _pressed={{
                  opacity: 0,
                }}
                onPress={() => {
                  console.log('hello');
                }}>
                <VideoIcon size={26} color="gray" />
              </Pressable>
            </HStack>
          </VStack>
        </VStack>
        <HStack px={4} alignItems={'center'} justifyContent={'space-evenly'}>
          <VStack
            space={2}
            p={4}
            alignItems={'center'}
            justifyContent={'center'}>
            <Button
              size={50}
              rounded={'lg'}
              colorScheme="indigo"
              onPress={() => {
                console.log('hello');
              }}>
              <LocationIcon color="white" size={32} />
            </Button>
            <Text fontWeight="600" fontSize="xs" color="gray.500">
              Share location
            </Text>
          </VStack>
          <VStack
            space={2}
            p={4}
            alignItems={'center'}
            justifyContent={'center'}>
            <Button
              bg="blueGray.300"
              size={50}
              rounded={'lg'}
              colorScheme="coolGray"
              onPress={() => {
                console.log('hello');
              }}>
              <QRIcon color="black" size={32} />
            </Button>
            <Text fontWeight="600" fontSize="xs" color="gray.500">
              QR Code
            </Text>
          </VStack>
          <VStack
            space={2}
            p={4}
            alignItems={'center'}
            justifyContent={'center'}>
            <Button
              size={50}
              rounded={'lg'}
              colorScheme="success"
              onPress={() => {
                console.log('hello');
              }}>
              <PlaneIcon color="white" size={32} />
            </Button>
            <Text fontWeight="600" fontSize="xs" color="gray.500">
              Share Contact
            </Text>
          </VStack>
        </HStack>
      </SafeAreaView>
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
                value={FIRSTNAME}
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
                value={LASTNAME}
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
                value={AGE.toString()}
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
    </Box>
  );
};

export default Detail;
