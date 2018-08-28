import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Body, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H1, H2, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import Colors from '../../../native-base-theme/variables/commonColor';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';



class RequestItem extends Component {

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      request: this.props.request,
      hasAccepted: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
    this.emailToKey = this.emailToKey.bind(this);
  }

  componentDidMount() {
    var that = this;
  }

  handleChange = (name, val) => {
  }

  handleSubmit = () => {
  }

  handleAccept(e) {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (this.refs.myRef) {
      if (user) {
        const acceptedFriend = FirebaseRef.child('friends/').child(that.emailToKey(user.email) + '/').child(that.emailToKey(e.email));
        const theirData = FirebaseRef.child('friends/').child(that.emailToKey(e.email) + '/').child(that.emailToKey(user.email));
        acceptedFriend.update({
          hasAccepted: true,
          bothAccepted: true
        });
        theirData.update({
          bothAccepted: true
        })
      }
    }
  }

  handleDecline(e) {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (this.refs.myRef) {
      if (user) {
        const removeFriend = FirebaseRef.child('friends/').child(that.emailToKey(user.email) + '/').child(that.emailToKey(e.email)).remove();
        const removeMe = FirebaseRef.child('friends/').child(that.emailToKey(e.email) + '/').child(that.emailToKey(user.email)).remove();
      }
    }
  }

  emailToKey(emailAddress) {
     return emailAddress.replace(/[.]/g, ',');
  }

  render() {
    const { loading, error, success } = this.props;
    // Loading
    if (loading) return <Loading />;
    return (
      <ListItem ref="myRef" style={{backgroundColor: Colors.brandPrimary}}>
        <Body style={{height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
          <Text style={{paddingBottom: 10, color: 'white', alignSelf: 'center'}}>{'Friend request from ' + this.props.request.firstName + ' ' + this.props.request.lastName}</Text>
          <Body style={{paddingBottom: 5,width: '100%', height: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <Button block style={{marginRight: 10,height: 35, width:90, backgroundColor: '#8ace88'}}
            onPress={() => this.handleAccept(this.props.request)}>
            <Text style={{textAlign: 'center'}}>Accept</Text></Button>

            <Button block style={{marginLeft: 10,height: 35, width:90,backgroundColor: '#eca386'}}
            onPress={() => this.handleDecline(this.props.request)}>
            <Text style={{ textAlign: 'center'}}>Decline</Text></Button>
          </Body>
        </Body>
      </ListItem>
    );
  }
}

export default RequestItem;
