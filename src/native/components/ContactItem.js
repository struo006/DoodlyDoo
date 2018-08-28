import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Body, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H1, H2, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';


class ContactItem extends Component {

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      contact: this.props.contact,
      hasAccepted: false,
    };
    this.handlePress = this.handlePress.bind(this);
    this.capitalize = this.capitalize.bind(this);
    this.emailToKey = this.emailToKey.bind(this);
  }

  componentDidMount() {
    let user = Firebase.auth().currentUser;
    var that = this;

    if (user && this.refs.myRef) {
        var theyAccepted = FirebaseRef.child("friends/").child(this.emailToKey(this.props.contact.email) + '/').child(this.emailToKey(user.email)).child("hasAccepted");
        theyAccepted.on('value',function(snapshot) {
            that.setState({
              hasAccepted: snapshot.val(),
            });
        });
    }
  }

  handlePress(){
    Actions.contact({firstName:this.state.contact.firstName, lastName:this.state.contact.lastName, email:this.state.contact.email});
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
      <ListItem onPress={this.handlePress} style={{backgroundColor: 'white'}}>
        <Body>
          <Text ref="myRef" style={{paddingLeft: 10, fontWeight: 'bold'}}>{this.capitalize(this.state.contact.firstName) + ' ' + this.capitalize(this.state.contact.lastName)}</Text>
          {
            !this.state.hasAccepted ?
            <Text ref="myRef" style={{paddingLeft: 10, color:'green'}}>Request Pending...</Text>
            : null
          }
        </Body>
      </ListItem>
    );
  }
}

export default ContactItem;
