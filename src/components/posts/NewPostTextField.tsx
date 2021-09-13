import React, { FunctionComponent } from 'react';
import {
  View,
} from 'react-native';
import {
  Modal,
  Button,
  TextField,
} from 'react-native-ui-lib';
import styles from '../../styles/GlobalStyles';
import HelperStyles from '../../styles/HelperStyles';

interface IProps {
  isVisible: boolean;
  setIsNewPostTextFieldVisible: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}

const NewPostTextField: FunctionComponent<IProps> = ({
  isVisible,
  setIsNewPostTextFieldVisible,
  value,
  onChange,
  onSubmit,
}: IProps) => (
  <Modal visible={isVisible} animationType="slide">
    <View style={[styles.container, HelperStyles.row]}>
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

      <View style={[HelperStyles['w-100'], HelperStyles.marginBottomBig]}>
        <TextField
          multiline
          placeholder="Enter content"
          value={value}
          onChangeText={onChange}
          showCharacterCounter
          maxLength={300}
        />
      </View>
    </View>
  </Modal>
);

export default NewPostTextField;
