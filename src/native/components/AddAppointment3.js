import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Body, List, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H3, Icon, Card, CardItem } from 'native-base';
import { Scene, Tabs, Stack, Actions } from 'react-native-router-flux';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';
import { logout, getMemberData } from '../../actions/member';
import { connect } from 'react-redux';



class AddAppointment3 extends React.Component {
  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      friendCheck: {},
      friendObject: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.printFriends = this.printFriends.bind(this);
  }

  handleChange = (name, val) => {
    // this.setState({
    //   ...this.state,
    //   [name]: val,
    // });
  }

  handleEdit () {
    let appt = this.props.apptName;
    let des = this.props.description;
    let loc = this.props.location;
    let dates = this.props.dates;
    let id = this.props.recipe.id;
    let masterEmail = this.props.recipe.masterEmail;
    let masterName = this.props.recipe.masterName;
    let invitedUsers = this.props.recipe.invitedUsers;
    let masteruid = this.props.recipe.masteruid;
    let user = Firebase.auth().currentUser;
    let invited = {};

    const appointmentsInvited = FirebaseRef.child("appointments").child(this.props.recipe.masteruid).child(id).child('invitedUsers');
    const appointments = FirebaseRef.child("appointments").child(this.props.recipe.masteruid).child(id);
    appointmentsInvited.once('value', (snapshot) => {
      invited = snapshot.val();
    });

    Object.entries(this.state.friendCheck).map(([key, value]) => {
      if (value.checked && !(value.name in invited)) {
        invited[value.name] = {email: key, inputted: false, canAttend: true}
      } else if (!value.checked && value.name in invited) {
        delete invited[value.name];
      }
    });

    if (user) {
      var getuserdata = FirebaseRef.child('users/' + user.uid);
      getuserdata.once('value',function(snapshot){
        let fbRequestInvite = null;
        let editInvited = null;
        invitedUsers ?
          Object.entries(invitedUsers).map(([key, value]) => {
            let email = value.email.replace(/[.]/g, ',');
            if (!(Object.values(invited).indexOf(value.email) > -1) && (value.email !== masterEmail)) {
              FirebaseRef.child('invitedAppointments').child(email).child(id).remove();
              FirebaseRef.child("requestInvite").child(id).child(email).remove();
              FirebaseRef.child('appointments').child(masteruid).child(id).child('userDates').child(email).remove();
            } else {
              editInvited = FirebaseRef.child('invitedAppointments').child(email).child(id);
              fbRequestInvite = FirebaseRef.child("requestInvite").child(id).child(email);
              editInvited.update({
                appointmentName: appt,
                description: des,
                location: loc,
                dates: dates,
                invitedUsers: invited,
              });
              fbRequestInvite.set({
                email: email,
                invitedBy: masterEmail,
                ownerAccepted: true
              });
            }
          }) : null

        Object.getOwnPropertyNames(invited).length > 0 ?
          Object.entries(invited).map(([key, value]) => {
            let email = value.email.replace(/[.]/g, ',');
            if (!invitedUsers || !(Object.values(invitedUsers).indexOf(value.email) > -1)) {
              let newInvite = FirebaseRef.child('invitedAppointments').child(email).child(id);
              let fbRequestInvite = FirebaseRef.child("requestInvite").child(id).child(email);
              newInvite.set({
                appointmentName: appt,
                description: des,
                location: loc,
                dates: dates,
                masterEmail: masterEmail,
                masterName: masterName,
                id: id,
                invitedUsers: invited,
                masteruid: masteruid,
              });
              fbRequestInvite.set({
                email: value.email,
                invitedBy: masterEmail,
                ownerAccepted: true
              });
            }
          }) : null

        appointments.update({
          appointmentName: appt,
          description: des,
          location: loc,
          dates: dates,
          invitedUsers: invited,
        });
      })
      Actions.recipes();
    }
  }

  handleSubmit(e) {
    let appt = this.props.apptName;
    let des = this.props.description;
    let loc = this.props.location;
    let dates = this.props.dates;
    let invited = {};
    Object.entries(this.state.friendCheck).map(([key, value]) => {
      if (value.checked) {
        invited[value.name] = {email: key, inputted: false, canAttend: true}
      }
    });
    let user = Firebase.auth().currentUser;
    if (user) {
      var numofAppointments;
      var getuserdata = FirebaseRef.child('users/' + user.uid);
      getuserdata.once('value',function(snapshot){
        let masterEmail = snapshot.val().email;
        let masterName = `${snapshot.val().firstName} ${snapshot.val().lastName}`;
        numofAppointments = snapshot.val().numofAppointments;
        appointmentID = snapshot.val().appointmentID;
        numofAppointments++;
        appointmentID++;
        FirebaseRef.child('users/' + user.uid).update({numofAppointments: numofAppointments});
        let id = `${user.email.replace(/[.]/g, ',')}${appointmentID}`;
        const appointments = FirebaseRef.child("appointments").child(user.uid).child(id);
        Object.entries(invited).map(([key, value]) => {
          let invUser = value.email.replace(/[.]/g, ',');
          const firebaseInvited = FirebaseRef.child("invitedAppointments").child(invUser).child(id);
          let fbRequestInvite = FirebaseRef.child("requestInvite").child(id).child(invUser);
          invited[masterName] = {email: masterEmail, inputted: true, canAttend: true};
          firebaseInvited.set({
            appointmentName: appt,
            description: des,
            location: loc,
            dates: dates,
            masterEmail: masterEmail,
            masterName: masterName,
            id: id,
            invitedUsers: invited,
            masteruid: user.uid
          });
          fbRequestInvite.set({
            email: value.email,
            invitedBy: masterEmail,
            ownerAccepted: true
          });
        });
        appointments.set({
          appointmentName: appt,
          description: des,
          location: loc,
          dates: dates,
          masterEmail: masterEmail,
          masterName: masterName,
          id: id,
          invitedUsers: invited,
          masteruid: user.uid,
        });
        FirebaseRef.child('users/' + user.uid).update({appointmentID: appointmentID});
      })
      Actions.recipes();
    }
  }

    componentDidMount = () => {
      that = this;
      let userEmail = this.props.member.email.replace(/[.]/g, ',');
      let tempFriends = {};
      FirebaseRef.child('friends').child(userEmail).on('value', (snapshot) => {
        if(snapshot.val()) {
          Object.entries(snapshot.val()).map(([key, value]) => {
            if (this.props.recipe && this.props.recipe.invitedUsers) {
              Object.entries(this.props.recipe.invitedUsers).map(([invitedKey, invitedValue]) => {
                if (value.email === invitedValue.email) {
                  tempFriends[value.email] = {checked: true, name: `${value.firstName} ${value.lastName}`};
                } else {
                  if (!tempFriends[value.email]) tempFriends[value.email] = {checked: false, name: `${value.firstName} ${value.lastName}`};
                }
              });
            } else {
              tempFriends[value.email] = {checked: false, name: `${value.firstName} ${value.lastName}`};
            }
          });
          that.setState({friendObject: snapshot.val(), friendCheck: tempFriends})
        }
      });
    }

    printFriends = () => {
      return Object.entries(this.state.friendObject).map(([key, value]) => (
        <ListItem key={key} onPress={() => {
          let tempCheck = this.state.friendCheck;
          tempCheck[value.email].checked = !tempCheck[value.email].checked;
          this.setState({friendCheck: tempCheck})
        }} style={{width: '100%'}}>
            <CheckBox onPress={() => {
              let tempCheck = this.state.friendCheck;
              tempCheck[value.email].checked = !tempCheck[value.email].checked;
              this.setState({friendCheck: tempCheck})
            }} checked={this.state.friendCheck[value.email].checked}/>
            <Text style={{paddingLeft: 5}}> {value.firstName} {value.lastName} </Text>
        </ListItem>
      ));
    }


  render() {
    const { loading, error, success } = this.props;

    // Loading
    if (loading) return <Loading />;

    return (
      <Container>
        <Content padder>
          <Text style={{width: '100%', textAlign: 'center'}}> Step 3 of 3 </Text>
          <Spacer size={25} />
          {error && <Messages message={error} />}
          {success && <Messages message={success} type="success" />}

          <Card style={{ paddingHorizontal: 10, width: '95%', alignSelf: 'center'}}>
            <CardItem header bordered={true}>
              <Text style={{ fontWeight: '600', textAlign: 'center', width: '100%' }}>Friends List</Text>
            </CardItem>
            <CardItem cardBody bordered={true} style={{backgroundColor: 'white'}}>
              <List style={{width: '90%'}}>
                {this.printFriends()}
              </List>
            </CardItem>
          </Card>
            <Spacer size={30} />

            <Button block onPress={this.props.isEdit ? this.handleEdit : this.handleSubmit}>
              <Text>Done!</Text>
            </Button>
            <Spacer size={30} />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddAppointment3);
