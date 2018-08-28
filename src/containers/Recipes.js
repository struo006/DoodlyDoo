import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getRecipes, getMeals, setError, setCurrentRecipe } from '../actions/recipes';
import { logout, getMemberData } from '../actions/member';
import { Firebase, FirebaseRef } from '../lib/firebase';


class RecipeListing extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    recipes: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
      recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({}),
    }),
    getRecipes: PropTypes.func.isRequired,
    getMeals: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
  }

  static defaultProps = {
    match: null,
  }

  componentDidMount = () => {
    Firebase.auth().onAuthStateChanged((loggedIn) => {
      this.fetchRecipes()
    });
  };

  /**
    * Fetch Data from API, saving to Redux
    */
  fetchRecipes = () => {
    const uid = this.props.member.uid;
    return this.props.getRecipes(uid)
      .then(() => this.props.getMeals())
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  setRecipeRedux = (recipe) => {
    return this.props.setCurrentRecipe(recipe)
      .catch((err) => {
        console.log(`Error: ${err}`);
        return this.props.setError(err);
      });
  }

  render = () => {
    const { Layout, recipes, match, member } = this.props;
    const id = (match && match.params && match.params.id) ? match.params.id : null;
    let tempArray = recipes.recipes;
    tempArray = tempArray.filter(x => x != null);

    // not reloading issue may be here.

    return (
      <Layout
        recipeId={id}
        error={recipes.error}
        loading={recipes.loading}
        recipes={tempArray}
        member={member}
        reFetch={() => this.fetchRecipes()}
        setCurrentRecipe={this.setRecipeRedux}
      />
    );
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes || {},
  member: state.member || {},
});

const mapDispatchToProps = {
  setCurrentRecipe,
  getRecipes,
  getMeals,
  setError,
  getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecipeListing);
