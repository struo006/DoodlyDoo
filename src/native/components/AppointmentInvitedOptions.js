import React, {Component} from 'react';
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
import InviteContactItem from './InviteContactItem';


class AppointmentInvitedOptions extends Component {
  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
    this.inviteFriends = this.inviteFriends.bind(this);
    this.emailToKey = this.emailToKey.bind(this);
    this.printFriends = this.printFriends.bind(this);
  }

  componentDidMount() {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (user) {
      FirebaseRef.child("friends/").child(that.emailToKey(user.email)).on("value", function(snapshot){
        var alreadyAdded = false;
        var contacts = [];
        let userInvites = FirebaseRef.child("requestInvite").child(that.props.recipe.id);
        that.setState({
          contacts: [],
        })
        snapshot.forEach(function(snapshot) {
          userInvites.on("value",function(alreadyInvited){
            alreadyInvited.forEach(function(alreadyInvited){
              if(snapshot.val().email == alreadyInvited.val().email) {
                alreadyAdded = true;
              }
            })
            if (!alreadyAdded && snapshot.val().hasAccepted && snapshot.val().email != that.props.recipe.masterEmail) {
              var contact = snapshot.val();
              contact['checked'] = false;
              contacts.push(contact);
              that.setState({
                contacts: contacts,
              });
              console.log(that.state.contacts);
            }
            else {
              alreadyAdded = false;
            }
          })
        })
        contacts = [];
      })
    }
  }

  emailToKey(emailAddress) {
     return emailAddress.replace(/[.]/g, ',');
  }

  printFriends = () => {
    const contactItems = this.state.contacts.map((contact) => {
      return (<InviteContactItem key={contact.email} contact={contact}/>)
    });
  }

  inviteFriends() {
    let contacts = this.state.contacts;
    this.setState({
      contacts: []
    });
    let masterUID = this.props.recipe.masteruid;
    let appointmentID = this.props.recipe.id;
    let user = Firebase.auth().currentUser;
    let thisAppointment = FirebaseRef.child("requestInvite/").child(appointmentID);
    contacts.forEach(contact => {
      if (contact.checked) {
        thisAppointment.child(this.emailToKey(contact.email)).set ({
          email: contact.email,
          invitedBy: user.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
          ownerAccepted: false
        });
      }
    });
  }

  render() {
    const { loading, error, success, recipe } = this.props;
    const contactItems = this.state.contacts.map((contact) => {
      return (<InviteContactItem key={contact.email} contact={contact}/>)
    });
    if (loading) return <Loading />;
    return (
      <View style={{backgroundColor: 'white', height: '100%', alignItems: 'center', paddingTop: 15, paddingBottom: 15}}>
        <H3>Invite friends to this appointment</H3>
        <ScrollView key="lol" style={{width: '90%', paddingBottom:30, marginTop: 15}}>
          {contactItems}
        </ScrollView>
        <Button bordered style={{marginBottom: 50, width: '95%', alignSelf: 'center', shadowColor: Colors.brandPrimary}} onPress={this.inviteFriends}>
          <Text style={{textAlign: 'center', width: '100%'}}>Request Invitations</Text>
        </Button>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes || {},
  member: state.member || {},
});

export default connect(mapStateToProps)(AppointmentInvitedOptions);
