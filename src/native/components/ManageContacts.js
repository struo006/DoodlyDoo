import React from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { Container, Content, Text, Body, List, Left, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H1, H2, H3, } from 'native-base';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import RequestItem from './RequestItem';
import ContactItem from './ContactItem';
import Colors from '../../../native-base-theme/variables/commonColor';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';
import {ScrollView} from 'react-native';

class ManageContacts extends React.Component {

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      requests: [],
      selectedButton: null,
      theyAccepted: null,
      contactsExist: true,
    };
    this.theyAccepted = this.theyAccepted.bind(this);
    this.emailToKey = this.emailToKey.bind(this);
  }

  componentDidMount() {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (user) {
      FirebaseRef.child("friends/").child(that.emailToKey(user.email) + '/').on("value",function(snapshot){
        var contacts = [];
        var requests = [];
        that.setState({
          contacts: [],
          requests:[]
        })
        snapshot.forEach(function(snapshot) {
          if (snapshot.val().hasAccepted) {
            contacts.push(snapshot.val());
            that.setState({
              contacts: contacts,
            });
          }
          else {
            requests.push(snapshot.val());
            that.setState({
              requests: requests,
            });
          }
        })
      });
    }
  }

  theyAccepted(e) {
    let user = Firebase.auth().currentUser;
    var that = this;
    if (user) {
        var theyAccepted = FirebaseRef.child("friends/").child(this.emailToKey(e) + '/').child(this.emailToKey(user.email));
        return theyAccepted.once('value').then(function(snapshot) {
          return snapshot.val().hasAccepted;
        });
    }
  }

  emailToKey(emailAddress) {
     return emailAddress.replace(/[.]/g, ',');
  }

  render() {
    const { loading, error, success } = this.props;
    const contactItems = this.state.contacts.map((contact) => {
      return (<ContactItem key={contact.email} contact={contact}/>)
    });
    const requestItems = this.state.requests.map((request) => {
      return (<RequestItem
        key={request.email}
        request={request}
        />)
    });

    if (loading) return <Loading />;
    return (
      <ScrollView>
            {
              this.state.requests.length > 0 || this.state.contacts.length > 0 ?
              <List style={{marginLeft: -17}}>
                {requestItems}
                {contactItems}
              </List>
              : <Text style={{textAlign:'center', marginTop: 10}}>You have no friends!</Text>
          }
        </ScrollView>
    );
  }
}

export default ManageContacts;
