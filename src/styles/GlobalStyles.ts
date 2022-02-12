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
    backgroundColor: 'rgb(240, 241, 244)',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    marginTop: 5,
    width: '100%',
  },
  cardChild: {
    overflow: 'hidden',
    borderRadius: 25,
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
    maxHeight: 200,
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
    height: 300,
    backgroundColor: 'rgb(255, 223, 108)',
    width: '100%',
  },
  profileHeaderBack: {
    height: 40,
  },
  newPostTextFieldContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    height: '100%',
  },
  newPostTextFieldGalleryContainer: {
    width: '100%',
    marginBottom: 20,
    height: 65,
  },
  newPostTextFieldGalleryPickImageWrapper: {
    height: '100%',
    width: 65,
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'rgb(183, 173, 255)',
    borderStyle: 'dashed',
  },
  newPostTextFieldGalleryImageWrapper: {
    height: '100%',
    width: 65,
    borderRadius: 5,
    overflow: 'hidden',
  },
  newPostTextFieldGalleryPickImage: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  newPostTextFieldGalleryImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  followBtn: {
    width: 120,
    alignSelf: 'flex-start',
  },
  barcodeCameraBody: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeCameraFill: {
    height: '90%',
    width: '100%',
  },
  barcodeCameraFooter: {
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: 'rgb(240, 240, 240)',
    paddingBottom: 5,
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
  },
});

export default styles;
