import {
  StyleSheet,
} from 'react-native';

const HelperStyles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  justifySpaceBetween: {
    justifyContent: 'space-between',
  },
  justifySpaceAround: {
    justifyContent: 'space-around',
  },
  justifyFlexEnd: {
    justifyContent: 'flex-end',
  },
  'w-25': {
    width: '25%',
  },
  'w-50': {
    width: '50%',
  },
  'w-75': {
    width: '75%',
  },
  'w-100': {
    width: '100%',
  },
  textCenter: {
    textAlign: 'center',
  },
  textField: {
    width: '100%',
  },
  paddingHorizontalBig: {
    paddingHorizontal: 24,
  },
  paddingHorizontalMed: {
    paddingHorizontal: 12,
  },
  paddingLeftMed: {
    paddingLeft: 12,
  },
  paddingRightMed: {
    paddingRight: 12,
  },
  paddingVerticalTopMed: {
    paddingTop: 12,
  },
  paddingBottomMed: {
    paddingBottom: 12,
  },
  marginTopBig: {
    marginTop: 25,
  },
  marginBottomBig: {
    marginBottom: 25,
  },
  marginVerticalBig: {
    marginVertical: 25,
  },
  marginVerticalMed: {
    marginVertical: 12,
  },
  marginBottomMed: {
    marginBottom: 12,
  },
  bgWhite: {
    backgroundColor: 'white',
  },
});

export default HelperStyles;
