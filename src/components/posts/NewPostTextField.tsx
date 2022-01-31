import React, { FunctionComponent } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Modal,
  Button,
  Incubator,
  Image,
} from 'react-native-ui-lib';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles/GlobalStyles';
import HelperStyles from '../../styles/HelperStyles';
import ImageGallery from '../../../assets/image-gallery.png';

const { TextField } = Incubator;

interface IImage {
  index: number;
  url: string;
}

interface IProps {
  isVisible: boolean;
  setIsNewPostTextFieldVisible: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  setNotificationMessage: React.Dispatch<React.SetStateAction<string>>;
  setImages: React.Dispatch<React.SetStateAction<IImage[]>>;
  images: IImage[];
}

const NewPostTextField: FunctionComponent<IProps> = ({
  isVisible,
  setIsNewPostTextFieldVisible,
  value,
  onChange,
  onSubmit,
  setNotificationMessage,
  setImages,
  images,
}: IProps) => {
  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.3,
      base64: true,
    });

    if (!result.cancelled && result.base64) {
      setNotificationMessage('Uploading...');
      const newImage: IImage = {
        index: images.length,
        url: result.base64,
      };
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const handleDeleteImage = (index: number): void => {
    setImages((prevState) => [...prevState.filter((image) => image.index !== index)]);
  };

  return (
    <Modal visible={isVisible} animationType="slide">
      <SafeAreaView style={[styles.container, HelperStyles.marginHorizontalMed]}>
        <View style={[styles.newPostTextFieldContainer, { flex: 1 }]}>
          <View style={[HelperStyles['w-50'], HelperStyles.paddingRightMed]}>
            <Button
              onPress={() => setIsNewPostTextFieldVisible(false)}
              label="Close"
              outline
              borderRadius={6}
            />
          </View>

          <View style={[HelperStyles['w-50'], HelperStyles.paddingLeftMed]}>
            <Button
              onPress={onSubmit}
              label="Submit"
              enableShadow
              borderRadius={6}
              disabled={value.length === 0}
            />
          </View>

          <View style={[
            HelperStyles['w-100'],
            HelperStyles.marginBottomBig,
            HelperStyles.marginTopMed,
            styles.genericField,
          ]}
          >
            <TextField
              multiline
              placeholder="Enter content"
              value={value}
              onChangeText={onChange}
              showCharCounter
              maxLength={300}
            />
          </View>
        </View>

        <View style={[styles.newPostTextFieldGalleryContainer]}>
          <ScrollView horizontal style={HelperStyles.paddingBottomSmall}>
            <View style={images.length === 0
              ? [styles.newPostTextFieldGalleryPickImageWrapper]
              : [styles.newPostTextFieldGalleryPickImageWrapper, { backgroundColor: 'rgb(240, 240, 240)' }]}
            >
              <TouchableOpacity
                disabled={images.length === 1}
                onPress={handlePickImage}
                style={[HelperStyles.marginHorizontalSmall]}
              >
                <Image
                  style={[styles.newPostTextFieldGalleryPickImage]}
                  source={ImageGallery}
                />
              </TouchableOpacity>
            </View>

            {React.Children.toArray(images.map((image) => (
              <View style={[
                styles.newPostTextFieldGalleryImageWrapper,
                HelperStyles.marginHorizontalSmall,
              ]}
              >
                <TouchableOpacity
                  onLongPress={() => handleDeleteImage(image.index)}
                >
                  <Image
                    style={[styles.newPostTextFieldGalleryImage]}
                    source={image?.url ? { uri: `data:image/jpeg;base64,${image.url}` } : undefined}
                  />
                </TouchableOpacity>
              </View>
            )))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default NewPostTextField;
