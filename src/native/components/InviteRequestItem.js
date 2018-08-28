import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Content, Text, Body, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H1, H2, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';


class InviteRequestItem extends Component {

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      ownerFirst: '',
      ownerLast: '',
    };
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.capitalize = this.capitalize.bind(this);
    this.emailToKey = this.emailToKey.bind(this);
  }

  componentDidMount() {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (user) {
      FirebaseRef.child('/addUserByEmail/' + this.emailToKey(this.props.request.invitedBy)).once('value').then(function(snapshot) {
        that.setState({
          ownerFirst: snapshot.val().firstName,
          ownerLast: snapshot.val().lastName,
        });
      });
    }
  }

  handleAccept() {
    let user = Firebase.auth().currentUser;
    let that = this;
    if (user) {
      let invitedUser = FirebaseRef.child('appointments').child(user.uid).child(this.props.appointment.id).child('invitedUsers').child(this.props.request.firstName + ' ' + this.props.request.lastName);
      let invitedApp = FirebaseRef.child('invitedAppointments').child(this.emailToKey(this.props.request.email)).child(that.props.appointment.id);
      let requestInvite = FirebaseRef.child('requestInvite').child(this.props.appointment.id).child(this.emailToKey(this.props.request.email));
      invitedUser.set({
        canAttend: true,
        email: this.props.request.email,
        inputted: false
      });
      invitedApp.set(that.props.appointment);
      requestInvite.update({
        ownerAccepted: true
      });
    }
  }

  handleDecline() {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (user) {
      FirebaseRef.child('requestInvite').child(that.props.appointment.id).child(that.emailToKey(that.props.request.email)).remove();
    }
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  emailToKey(emailAddress) {
     return emailAddress.replace(/[.]/g, ',');
  }

  render() {
    const { loading, error, success } = this.props;
    // Loading
    if (loading) return <Loading />;
    return (
      <ListItem style={{backgroundColor: 'white', height: 100}}>
        <Body style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
          <Text ref="myRef" style={{width: '90%', paddingBottom: 5, fontWeight: 'bold', textAlign: 'center'}}>
          {this.capitalize(this.state.ownerFirst) + ' ' + this.capitalize(this.state.ownerLast) + ' would like to invite ' + this.capitalize(this.props.request.firstName) + ' ' + this.capitalize(this.props.request.lastName) + ' to the appointment'}
          </Text>
          <Body style={{paddingBottom: 5,width: '100%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <Button rounded success style={{height: 35, width:90}} onPress={() => this.handleAccept()}>
              <Text style={{textAlign:'center'}}>Accept</Text>
            </Button>
            <Button rounded danger style={{height: 35, width:90}} onPress={() => this.handleDecline()}>
              <Text style={{textAlign:'center'}}>Decline</Text>
            </Button>
          </Body>
        </Body>
      </ListItem>
    );
  }
}

export default InviteRequestItem;
