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
import InviteRequestItem from './InviteRequestItem';
import InvitedItem from './InvitedItem';


class AppointmentMasterOptions extends React.Component {
  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      invited: []
    };
  }

  componentDidMount() {
    var that = this;
    let user = Firebase.auth().currentUser;
    if (user) {
      FirebaseRef.child("requestInvite/").child(this.props.recipe.id).on("value", function(snapshot){
        var requests = [];
        var request;
        var invited = [];
        that.setState({
          requests: [],
          invited: []
        })
        snapshot.forEach(function(snapshot) {
          if (!snapshot.val().ownerAccepted) {
            request = snapshot.val();
            requests.push(request);
            that.setState({
              requests: requests,
            });
          }
          else if (snapshot.val().ownerAccepted && snapshot.val().invitedBy != user.email) {
            invited.push(snapshot.val());
            that.setState({
              invited: invited,
            });
          }
        })
      })
    }
  }

  deleteAppointment = () => {
    let uid = Firebase.auth().currentUser.uid;

    const invited = FirebaseRef.child("appointments").child(uid).child(this.props.recipe.id).child('invitedUsers');
    invited.once('value', (snapshot) => {
      snapshot.val() ?
      Object.entries(snapshot.val()).map(([key, value]) => {
        let email = value.email.replace(/[.]/g, ',');
        FirebaseRef.child('invitedAppointments').child(email).child(this.props.recipe.id).remove();
      }) : null
    });

    let emailKey = this.props.recipe.masterEmail.replace(/[.]/g, ',');
    FirebaseRef.child('appointments').child(uid).child(this.props.recipe.id).remove();
    FirebaseRef.child('messages').child(uid).child(this.props.recipe.id).remove();
    let getuserdata = FirebaseRef.child('users/' + uid);
    getuserdata.once('value', function(snapshot){
      numofAppointments = snapshot.val().numofAppointments;
      numofAppointments--;
      FirebaseRef.child('users/' + uid).update({numofAppointments: numofAppointments});
    });
    Actions.recipes();
  }

  editAppointment = () => Actions.addAppointment1({isEdit: true, recipe: this.props.recipe});


  render() {
    const { loading, error, success, recipe } = this.props;
    // Loading
    if (loading) return <Loading />;
    const requestItems = this.state.requests.map((request) => {
      return (<InviteRequestItem appointment={this.props.recipe} key={request.email} request={request}/>)
    });
    const invitedItems = this.state.invited.map((invite) => {
      return (<InvitedItem appointment={this.props.recipe} key={invite.email} invite={invite}/>)
    });
    return (
      <View style={{height: '100%', backgroundColor: 'white', alignItems: 'center', paddingTop: 15, paddingBottom: 50}}>
        <View style={{width: '90%', height: '80%'}}>
          <H3 style={{alignSelf: 'center', paddingBottom: 15}}>Requests</H3>
          <View style={{height: 1, backgroundColor: "lightgrey"}}></View>
          <ScrollView style={{alignSelf: 'center', width: '100%',}}>
            {requestItems}
            {invitedItems}
          </ScrollView>
        </View>
        <View>
          <View>
            <View style={{height: 1, backgroundColor: "lightgrey"}}></View>
            <H3 style={{alignSelf: 'center', paddingTop: 15}}>Options</H3>
          </View>
          <View style={{paddingTop: 15, paddingBottom: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Button bordered style={{width: '45%', alignSelf: 'center', shadowColor: Colors.brandPrimary}} onPress={this.editAppointment}>
              <Text style={{textAlign: 'center', width: '100%'}}>Edit</Text>
            </Button>
            <Button bordered style={{width: '45%', alignSelf: 'center', borderColor: '#a32323'}} onPress={this.deleteAppointment}>
              <Text style={{textAlign: 'center', width: '100%', color: '#a32323'}}>Delete</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  recipes: state.recipes || {},
  member: state.member || {},
});

export default connect(mapStateToProps)(AppointmentMasterOptions);
