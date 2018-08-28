import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Body, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H1, H2, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';

class AddContact extends React.Component {

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      errorMessage: '',
      alreadyAdded: false,
      contact: null,
    };
    this.emailToKey = this.emailToKey.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (name, val) => {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handleSubmit = (e) => {
    if (this.state.email == '') {
      this.setState({errorMessage: "Please fill out all missing fields."});
    }
    else {
      let that = this;
      let user = Firebase.auth().currentUser;
      let userfound = false;
      if (user) {
        that.setState({errorMessage: ''});
        console.log("user is: " + user.email);
        FirebaseRef.child("users/").once("value").then(function(contact){
          contact.forEach(function(contact) {
            if (contact.val().email == that.state.email) {
              FirebaseRef.child("friends").child(that.emailToKey(user.email)).child(that.emailToKey(that.state.email)).once("value").then(function(snapshot){
                if (snapshot.val()) {
                  console.log("User already added! " + snapshot.val());
                  that.setState({errorMessage: 'User already added!'});
                }
                else {
                  const myFriendslist = FirebaseRef.child("friends").child(that.emailToKey(user.email)).child(that.emailToKey(that.state.email));
                  const theirFriendslist = FirebaseRef.child("friends").child(that.emailToKey(that.state.email)).child(that.emailToKey(user.email));
                  var numFriends;
                  var userFirst;
                  var userLast;
                  var theirFirst;
                  var theirLast;
                  var getuserdata = FirebaseRef.child('users/' + user.uid);
                  var theirInfo = FirebaseRef.child("addUserByEmail").child(that.emailToKey(that.state.email));
                  getuserdata.once('value',function(myData){
                    numFriends = myData.val().numFriends;
                    userFirst = myData.val().firstName;
                    userLast = myData.val().lastName;
                  }).then(() => {
                    theirFriendslist.set({
                      firstName: userFirst,
                      lastName: userLast,
                      email: user.email,
                      hasAccepted: false,
                      bothAccepted: false,
                    });
                  });
                  theirInfo.once('value', function(theirData){
                    theirFirst = theirData.val().firstName;
                    theirLast = theirData.val().lastName;
                  }).then(() => {
                    myFriendslist.set({
                      firstName: theirFirst,
                      lastName: theirLast,
                      email: that.state.email,
                      hasAccepted: true,
                      bothAccepted: false,
                    });
                  });
                  FirebaseRef.child("friends").child(that.emailToKey(user.email)).child(that.emailToKey(that.state.email)).once("value").then(function(s2){
                    Actions.pop(); Actions.refresh({addedContact:s2.val()});
                  });
                }
              });
            }
          })
        });
        let checkUserExist = FirebaseRef.child('addUserByEmail');
        checkUserExist.once('value', (userEmails) => {
          let doesUserExist = Object.values(userEmails.val()).indexOf(that.state.email) > -1;
          if (!doesUserExist) {
            that.setState({errorMessage: 'User not found.'});
          }
        })
      }
    }
  }

  emailToKey(emailAddress) {
     return emailAddress.replace(/[.]/g, ',');
  }

  render() {
    const { loading, error, success } = this.props;
    const shouldContinue = (this.state.email != null);

    // Loading
    if (loading) return <Loading />;

    return (
      <Container>
        <Content padder>
          <Header
            title="Add Contact"
            content="Add a contact"
          />

          {error && <Messages message={error} />}
          {success && <Messages message={success} type="success" />}

          <Form>
            <Item stackedLabel>
              <Label>Email</Label>
              <Input
                placeholder={'Email Address'}
                onChangeText={v => this.handleChange('email', v)}
              />
            </Item>

            <Spacer size={20} />
            <Text style= {{color:'red', height:20}}>{this.state.errorMessage}</Text>
            <Button block onPress={this.handleSubmit}>
              <Text>Done</Text>
            </Button>
          </Form>
        </Content>
      </Container>

    );
  }
}

export default AddContact;
