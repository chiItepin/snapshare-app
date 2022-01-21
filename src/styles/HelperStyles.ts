import {
  StyleSheet,
} from 'react-native';

const HelperStyles = StyleSheet.create({
  row: {
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
  'w-10': {
    width: '10%',
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
  'w-90': {
    width: '90%',
  },
  'w-100': {
    width: '100%',
  },
  'h-100': {
    height: '100%',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
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
  marginTopMed: {
    marginTop: 12,
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
  marginHorizontalMed: {
    marginHorizontal: 12,
  },
  bgWhite: {
    backgroundColor: 'white',
  },
});

export default HelperStyles;
