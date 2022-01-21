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
  },
  accountAvatarContainer: {
    marginTop: 5,
    alignItems: 'center',
  },
  genericField: {
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    paddingBottom: 10,
  },
  postHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  postHeaderAuthor: {
    paddingLeft: 10,
    fontWeight: 'bold',
    color: 'grey',
    width: '100%',
  },
  profileHeader: {
    position: 'absolute',
    height: 200,
    backgroundColor: 'rgb(255, 223, 108)',
    width: '100%',
  },
  profileHeaderBack: {
    height: 90,
  },
});

export default styles;
