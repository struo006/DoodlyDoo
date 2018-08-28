import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Image, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { Container, Content, Card, CardItem, Body, H3, List, ListItem, Text, View, Icon, Button } from 'native-base';
import Colors from '../../../native-base-theme/variables/commonColor';
import { Actions } from 'react-native-router-flux';
import ErrorMessages from '../../constants/errors';
import Error from './Error';
import Spacer from './Spacer';
import { Firebase, FirebaseRef } from '../../lib/firebase';



class RecipeActivityTracker extends React.Component {
  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      canAttend: true,
      hasInputted: false,
    };
  }

  componentWillMount = () => {
    let name = `${this.props.member.firstName} ${this.props.member.lastName}`
    let tempHasInputted = false;
    let inputtedDates = FirebaseRef.child('appointments').child(this.props.recipe.masteruid).child(this.props.recipe.id).child('userDates').child(this.props.member.email.replace(/[.]/g, ','))
    inputtedDates.on('value', (snapshot) => {
      if (snapshot.val() && Object.keys(snapshot.val()).length > 1) {
         tempHasInputted = true;
         FirebaseRef.child('appointments').child(this.props.recipe.masteruid).child(this.props.recipe.id).child('invitedUsers').child(name).update({canAttend: true});
       } else {
         tempHasInputted = false;
       }
      this.setState({hasInputted: tempHasInputted});
    });
    if(this.props.member.email && this.props.member.email != this.props.recipe.masterEmail) {
      let invitedInfo = FirebaseRef.child('appointments').child(this.props.recipe.masteruid).child(this.props.recipe.id).child('invitedUsers').child(name);
      invitedInfo.on('value', (snapshot) => {
        snapshot.val() ? this.setState({canAttend: snapshot.val().canAttend}) : null;
      });
    }
      this.setState({hasInputted: tempHasInputted});
  }

  // Build Method listing
  noResponses = (object) => object ? Object.entries(object).map(([key, value]) => {
    if (value.canAttend && !value.inputted)
    return (
      <ListItem key={key} rightIcon={{ style: { opacity: 0 } }}>
        <Text>{key}</Text>
      </ListItem>
    )
  }) : null

  noShows = (object) => object ? Object.entries(object).map(([key, value]) => {
    if (!value.canAttend)
    return (
      <ListItem key={key} rightIcon={{ style: { opacity: 0 } }}>
        <Text>{key}</Text>
      </ListItem>
    )
  }) : null

  attendees = (object) => object ? Object.entries(object).map(([key, value]) => {
    if (value.canAttend && value.inputted)
    return (
      <ListItem key={key} rightIcon={{ style: { opacity: 0 } }}>
        <Text>{key}</Text>
      </ListItem>
    )
  }) : null

  onCantAttend = () => {
    let uid = Firebase.auth().currentUser.uid;
    let email = this.props.member.email.replace(/[.]/g, ',')
    let userName = `${this.props.member.firstName} ${this.props.member.lastName}`;
    FirebaseRef.child('appointments').child(this.props.recipe.masteruid).child(this.props.recipe.id).child('invitedUsers').child(userName).update({canAttend: false});
    FirebaseRef.child('invitedAppointments').child(email).child(this.props.recipe.id).child('invitedUsers').child(userName).update({canAttend: false});
    this.setState({canAttend: false});
  }

  onCanAttend = () => {
    let uid = Firebase.auth().currentUser.uid;
    let email = this.props.member.email.replace(/[.]/g, ',')
    let userName = `${this.props.member.firstName} ${this.props.member.lastName}`;

    FirebaseRef.child('appointments').child(this.props.recipe.masteruid).child(this.props.recipe.id).child('invitedUsers').child(userName).update({canAttend: true});
    FirebaseRef.child('invitedAppointments').child(email).child(this.props.recipe.id).child('invitedUsers').child(userName).update({canAttend: true});
    this.setState({canAttend: true});
  }

  render() {
    const { loading, error, success, recipe } = this.props;
    // Loading
    if (loading) return <Loading />;

    console.log(recipe.invitedUsers);

    return (
      <View>
      <View style={{alignItems: 'center', paddingTop: 15, paddingBottom: 15}}>
        <H3>Invited People</H3>
      </View>
      <Card style={{width: '95%', alignSelf: 'center'}}>
        <CardItem header bordered>
          <Icon active name="ios-person" style={{color: Colors.brandPrimary}}/>
          <Text>Attendees</Text>
        </CardItem>
        <CardItem>
          <Content>
            <List>
              {this.attendees(recipe.invitedUsers)}
            </List>
          </Content>
        </CardItem>
      </Card>
      <Card style={{width: '95%', alignSelf: 'center'}}>
        <CardItem header bordered>
          <Icon active name="ios-person" style={{color: '#a32323'}}/>
          <Text style={{color: '#a32323'}}>Can Not Attend</Text>
        </CardItem>
        <CardItem>
          <Content>
            <List>
              {this.noShows(recipe.invitedUsers)}
            </List>
          </Content>
        </CardItem>
      </Card>
      <Card style={{width: '95%', alignSelf: 'center'}}>
        <CardItem header bordered>
          <Icon active name="ios-remove-circle-outline" style={{color: '#a32323'}}/>
          <Text style={{color: '#a32323'}}>Has Not Responded</Text>
        </CardItem>
        <CardItem>
          <Content>
            <List>
              {this.noResponses(recipe.invitedUsers)}
            </List>
          </Content>
        </CardItem>
      </Card>
      <Spacer size={30} />
      {
        this.props.member.email != recipe.masterEmail ?
          this.state.canAttend ?
            <View>
              <Button disabled={this.state.hasInputted ? true : false} bordered
                      style={{width: '95%', alignSelf: 'center', borderColor: this.state.hasInputted ? 'grey' : '#a32323'}}
                      onPress={this.onCantAttend}>
                <Text style={{width: '100%', textAlign: 'center', color: this.state.hasInputted ? 'grey' : '#a32323'}}>Can Not Attend</Text>
              </Button>
              <Spacer size={60} />
            </View> :
            <View>
              <Button bordered
                      style={{width: '95%', alignSelf: 'center', borderColor: Colors.brandPrimary}}
                      onPress={this.onCanAttend}>
                <Text style={{width: '100%', textAlign: 'center', color: Colors.brandPrimary}}>Undo Can Not Attend</Text>
              </Button>
              <Spacer size={60} />
            </View> : null
      }
      </View>
    );
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes || {},
  member: state.member || {},
});

export default connect(mapStateToProps)(RecipeActivityTracker);
