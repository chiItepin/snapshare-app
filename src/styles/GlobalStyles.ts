import {
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 12,
  },
  containerNoPadding: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  loginCard: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    padding: 14,
  },
  card: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 5,
    width: '100%',
  },
  cardChild: {
    marginBottom: 5,
    overflow: 'hidden',
  },
});

export default styles;
