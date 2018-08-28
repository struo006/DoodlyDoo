import React from 'react';
import { connect } from 'react-redux';
import { Scene, Tabs, Stack, Actions } from 'react-native-router-flux';
import { Icon, Text, View } from 'native-base';

import Colors from './../../../native-base-theme/variables/commonColor';

import DefaultProps from '../constants/navigation';
import AppConfig from '../../constants/config';

import RecipesContainer from '../../containers/Recipes';
import RecipesComponent from '../components/Recipes';
import RecipeViewComponent from '../components/Recipe';

import SignUpContainer from '../../containers/SignUp';
import SignUpComponent from '../components/SignUp';

import LoginContainer from '../../containers/Login';
import LoginComponent from '../components/Login';

import ForgotPasswordContainer from '../../containers/ForgotPassword';
import ForgotPasswordComponent from '../components/ForgotPassword';

import UpdateProfileContainer from '../../containers/UpdateProfile';
import UpdateProfileComponent from '../components/UpdateProfile';

import MemberContainer from '../../containers/Member';
import ProfileComponent from '../components/Profile';

import AboutComponent from '../components/About';
import AboutContainer from '../../containers/About';

import ManageContacts from '../components/ManageContacts';
import AddContact from '../components/AddContact';

import Contact from '../components/Contact';

import TimeInput from '../components/TimeInput';
import Chat from '../components/Chat';
import DateInputs from '../components/DateInputs';

import Recipes from '../components/Recipes';
import AddAppointment1 from '../components/AddAppointment1';
import AddAppointment2 from '../components/AddAppointment2';
import AddAppointment3 from '../components/AddAppointment3';

import recipeStore from '../../store/recipes';

const Index = (
  <Stack>
    <Scene hideNavBar>
      <Tabs
        key="tabbar"
        swipeEnabled
        type="replace"
        showLabel={false}
        {...DefaultProps.tabProps}
      >
        <Stack
          key="home"
          title="Home"
          icon={() => <Icon name="home" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="home" Layout={AboutComponent} component={AboutContainer} />
          <Scene
            back
            key="manageContactsFromLanding"
            title="CONTACTS"
            right={() => <Icon style={{paddingRight: 15}} onPress={Actions.addContact} name='add' />}
            {...DefaultProps.navbarProps}
            component={ManageContacts}
          />
        </Stack>

        <Stack
          key="recipes"
          title="YOUR APPOINTMENTS"
          icon={() => <Icon name="book" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >

          <Scene renderBackButton={() => (null)} key="recipes" component={RecipesContainer} Layout={RecipesComponent} />
          <Scene back key="addAppointment1" title="Whats the Occasion?" component={AddAppointment1} />
          <Scene back key="addAppointment2" title="Pick Some Options" component={AddAppointment2} />
          <Scene back key="addAppointment3" title="Invite Friends" component={AddAppointment3} />
        </Stack>

        <Stack
          key="profile"
          title="PROFILE"
          icon={() => <Icon name="contact" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="profileHome" component={MemberContainer} Layout={ProfileComponent} />
          <Scene
            back
            key="signUp"
            title="SIGN UP"
            {...DefaultProps.navbarProps}
            component={SignUpContainer}
            Layout={SignUpComponent}
          />
          <Scene
            back
            key="login"
            title="LOGIN"
            {...DefaultProps.navbarProps}
            component={LoginContainer}
            Layout={LoginComponent}
          />
          <Scene
            back
            key="forgotPassword"
            title="FORGOT PASSWORD"
            {...DefaultProps.navbarProps}
            component={ForgotPasswordContainer}
            Layout={ForgotPasswordComponent}
          />
          <Scene
            back
            key="updateProfile"
            title="UPDATE PROFILE"
            {...DefaultProps.navbarProps}
            component={UpdateProfileContainer}
            Layout={UpdateProfileComponent}
          />
          <Scene
            back
            key="manageContacts"
            title="CONTACTS"
            right={() => <Icon style={{paddingRight: 15}} onPress={Actions.addContact} name='add' />}
            {...DefaultProps.navbarProps}
            component={ManageContacts}
          />

          <Scene
            back
            key="addContact"
            title="Add Contact"
            {...DefaultProps.navbarProps}
            component={AddContact}
          />

          <Scene
            back
            key="contact"
            title="CONTACT"
            component={Contact}
          />

        </Stack>
      </Tabs>
    </Scene>

    <Scene
      back
      clone
      key="recipe"
      right={() => <Icon style={{paddingRight: 15, color: Colors.brandPrimary}} onPress={Actions.chat} name='ios-chatbubbles' />}
      title="APPOINTMENT"
      {...DefaultProps.navbarProps}
      component={RecipesContainer}
      Layout={RecipeViewComponent}
    />

    <Scene
      back
      clone
      key="DateInputs"
      title="Available Times"
      component={DateInputs}
    />

    <Scene
      back
      clone
      key="chat"
      title="Appointment Chat"
      component={Chat}
    />

    <Scene
      back
      clone
      key="loginFromLanding"
      title="LOGIN"
      {...DefaultProps.navbarProps}
      component={LoginContainer}
      Layout={LoginComponent}
    />

    <Scene
      back
      clone
      key="signFromLanding"
      title="SIGN UP"
      {...DefaultProps.navbarProps}
      component={SignUpContainer}
      Layout={SignUpComponent}
    />
  </Stack>
);

export default Index;
