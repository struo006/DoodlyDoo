import { Firebase, FirebaseRef } from '../lib/firebase';
import statusMessage from './status';


/**
  * Get this User's Favourite Recipes
  */
export function getFavourites(dispatch) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  const ref = FirebaseRef.child(`favourites/${UID}`);

  return ref.on('value', (snapshot) => {
    const favs = snapshot.val() || [];

    return dispatch({
      type: 'FAVOURITES_REPLACE',
      data: favs,
    });
  });
}

/**
  * Reset a User's Favourite Recipes in Redux (eg for logou)
  */
export function resetFavourites(dispatch) {
  return dispatch({
    type: 'FAVOURITES_REPLACE',
    data: [],
  });
}

/**
  * Update My Favourites Recipes
  */
export function replaceFavourites(newFavourites) {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  const UID = Firebase.auth().currentUser.uid;
  if (!UID) return false;

  return () => FirebaseRef.child(`favourites/${UID}`).set(newFavourites);
}

/**
  * Get Meals
  */
export function getMeals() {
  if (Firebase === null) return () => new Promise(resolve => resolve());

  return dispatch => new Promise((resolve, reject) => FirebaseRef
    .child('meals').once('value')
    .then((snapshot) => {
      const meals = snapshot.val() || {};

      return resolve(dispatch({
        type: 'MEALS_REPLACE',
        data: meals,
      }));
    }).catch(reject)).catch(e => console.log(e));
}

/**
  * Set an Error Message
  */
export function setError(message) {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'RECIPES_ERROR',
    data: message,
  })));
}

export function setCurrentRecipe(recipe) {
  return dispatch => new Promise(resolve => resolve(dispatch({
    type: 'CURRENT_RECIPE',
    data: recipe,
  })));
}

/**
  * Get Recipes
  */
export function getRecipes(uid) {
  if (Firebase === null) return () => new Promise(resolve => resolve());
  return dispatch => new Promise((resolve) => {
    Firebase.auth().onAuthStateChanged((loggedIn) => {
      if(loggedIn) {
        const recipes = {};
        let emailKey = loggedIn.email.replace(/[.]/g, ',');
        let numInvited = FirebaseRef.child('invitedAppointments').child(emailKey);
        numInvited.on('value', (snapshot) => {
          if (snapshot.val()) {
            // Object.entries(snapshot.val()).map(([recipeId, recipeValue]) => {
            //   let masteruid = recipeValue.masteruid;
            //   let master = FirebaseRef.child('appointments').child(masteruid).child(recipeId);
            //   master.on('value', (appointmentSnap) => {
            //     let tempRecipe = {};
            //     tempRecipe[recipeId] = appointmentSnap.val();
            //     recipes = Object.assign(recipes, tempRecipe);
            //     console.log(recipes);
            //   })
            // })
            recipes = snapshot.val();
          } else {
            recipes = {}
          }

          let numAppointments = FirebaseRef.child('users').child(loggedIn.uid);
          numAppointments.on('value', (snapshot) => {
            if (snapshot.val().numofAppointments > 0) {
              let ref = FirebaseRef.child('appointments').child(loggedIn.uid);
              ref.on('value', (snapshot) => {
                recipes = Object.assign(recipes, snapshot.val()) || Object.assign({}, recipes);
                return resolve(dispatch({
                  type: 'RECIPES_REPLACE',
                  data: recipes,
                }));
              })
            } else {
              return resolve(dispatch({
                type: 'RECIPES_REPLACE',
                data: recipes,
              }));
            }
          });
          // await statusMessage(dispatch, 'loading', false);
        });
      }
    })}).catch((e) => console.log(e));
}
