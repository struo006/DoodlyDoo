import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Content, Text, Body, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H1, H2, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';


class InvitedItem extends Component {

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
    this.handleUninvite = this.handleUninvite.bind(this);
    this.capitalize = this.capitalize.bind(this);
    this.emailToKey = this.emailToKey.bind(this);
  }

  componentDidMount() {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (user) {
      FirebaseRef.child('/addUserByEmail/' + this.emailToKey(this.props.invite.invitedBy)).once('value').then(function(snapshot) {
        that.setState({
          ownerFirst: snapshot.val().firstName,
          ownerLast: snapshot.val().lastName,
        });
      });
    }
  }

  handleUninvite() {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (user) {
      FirebaseRef.child('requestInvite').child(that.props.appointment.id).child(that.emailToKey(that.props.invite.email)).remove();
      FirebaseRef.child('invitedAppointments').child(that.emailToKey(that.props.invite.email)).child(that.props.appointment.id).remove();
      FirebaseRef.child('appointments').child(user.uid).child(this.props.appointment.id).child('invitedUsers').child(this.props.invite.firstName + ' ' + this.props.invite.lastName).remove();
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
          {this.capitalize(this.props.invite.firstName) + ' ' + this.capitalize(this.props.invite.lastName)}
          </Text>
          <Body style={{paddingBottom: 5,width: '100%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
            <Button rounded danger style={{height: 35, width:95}} onPress={() => this.handleUninvite()}>
              <Text style={{textAlign:'center'}}>Uninvite</Text>
            </Button>
          </Body>
        </Body>
      </ListItem>
    );
  }
}

export default InvitedItem;
