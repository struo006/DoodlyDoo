import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Body, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H1, H2, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';


class InviteContactItem extends Component {

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      isChecked: this.props.contact.checked,
    };
    this.handlePress = this.handlePress.bind(this);
    this.capitalize = this.capitalize.bind(this);
    this.emailToKey = this.emailToKey.bind(this);
  }

  componentDidMount() {
  }

  handlePress() {
    var tempContact = this.props.contact;
    tempContact.checked = !tempContact.checked;
    this.setState({
      isChecked: tempContact.checked
    });
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
      <ListItem style={{backgroundColor: 'white'}}>
        <CheckBox onPress={this.handlePress} checked={this.state.isChecked}/>
        <Body>
          <Text ref="myRef" style={{paddingLeft: 10, fontWeight: 'bold'}}>{this.capitalize(this.props.contact.firstName) + ' ' + this.capitalize(this.props.contact.lastName)}</Text>
        </Body>
      </ListItem>
    );
  }
}

export default InviteContactItem;
