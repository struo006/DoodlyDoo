import Colors from '../../../native-base-theme/variables/commonColor';

export default {
  navbarProps: {
    navigationBarStyle: { backgroundColor: 'white' },
    titleStyle: {
      color: Colors.textColor,
      alignSelf: 'center',
      letterSpacing: 2,
      fontSize: Colors.fontSizeBase,
    },
    backButtonTintColor: Colors.textColor,
  },

  tabProps: {
    swipeEnabled: false,
    activeBackgroundColor: Colors.brandLight,
    inactiveBackgroundColor: 'ghostwhite',
    tabBarStyle: { backgroundColor: 'ghostwhite' },
  },

  icons: {
    style: { color: Colors.brandPrimary, },
  },

};
