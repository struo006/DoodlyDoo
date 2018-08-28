import React from 'react';
import PropTypes from 'prop-types';
import { Image, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Card, CardItem, Body, H3, List, ListItem, Text, View, Icon, Button } from 'native-base';
import Colors from '../../../native-base-theme/variables/commonColor';
import { Actions } from 'react-native-router-flux';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';
import Swiper from 'react-native-swiper'
import Chat from './Chat';
import RecipeActivityTracker from './RecipeActivityTracker';
import AppointmentMasterOptions from './AppointmentMasterOptions';
import AppointmentInvitedOptions from './AppointmentInvitedOptions';
import RecipeLanding from './RecipeLanding';
import TimeInput from './TimeInput';
import { Firebase, FirebaseRef } from '../../lib/firebase';


const RecipeView = ({
  error,
  recipes,
  recipeId,
  member,
  setCurrentRecipe,
}) => {

  // Get this Recipe from all recipes
  let recipe = null;
  if (recipeId && recipes) {
    recipe = recipes.find(item => String(item.id) === recipeId);
  }

  Firebase.auth().onAuthStateChanged((loggedIn) => {
    if (loggedIn) {
      member.uid !== loggedIn.uid ? null : null
    }
  });

  // Recipe not found
  if (!recipe) return <Error content={ErrorMessages.recipe404} />;

  let currentEmail = null;
  if (Firebase.auth().currentUser) {
    let uid = Firebase.auth().currentUser.uid;
    FirebaseRef.child('users').child(uid).on('value', (snapshot) => {
      currentEmail = snapshot.val().email;
    });
  }

  currentEmail ?
  FirebaseRef.child('invitedAppointments').child(currentEmail.replace(/[.]/g, ',')).child(recipe.id).once('value', (snapshot) => {
    if (snapshot.val()) {
      currentEmail ? FirebaseRef.child('invitedAppointments').child(currentEmail.replace(/[.]/g, ',')).child(recipe.id).update({read: true}) : null
    }
  }) : null

  return (
    <Swiper removeClippedSubviews={false} >
          <ScrollView style={{backgroundColor: 'white'}}>
            <RecipeLanding recipe={recipe} />
          </ScrollView>

          <ScrollView style={{backgroundColor: 'white'}}>
            <RecipeActivityTracker recipe={recipe} />
          </ScrollView>

          <ScrollView contentContainerStyle={30} keyboardShouldPersistTaps='always' style={{flex:1, backgroundColor: 'white'}} >
              <TimeInput />
          </ScrollView>

          {
            currentEmail === recipe.masterEmail ?
            <AppointmentMasterOptions recipe={recipe} />
            :
            <AppointmentInvitedOptions key="lol" recipe={recipe} />
          }


    </Swiper>
  );
};

RecipeView.propTypes = {
  error: PropTypes.string,
  recipeId: PropTypes.string.isRequired,
  recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

RecipeView.defaultProps = {
  error: null,
};

export default RecipeView;
