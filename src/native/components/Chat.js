import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { connect } from 'react-redux';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';
import { getRecipes } from '../../actions/recipes';
import { getMemberData } from '../../actions/member';
import { Icon } from 'native-base';
import { Button, View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';


class Chat extends React.Component {
  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isOwner: false,
      modalVisible: false,
      showName: false,
      user: {},
      masterEmail: null,
      invitedUsers: null,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(user) {
    this.setState({modalVisible: !this.state.modalVisible, user: user});
  }

  componentDidMount() {
    that = this;
    let recipeInfo = this.props.recipes.recipe;
    let name = `${this.props.member.firstName} ${this.props.member.lastName}`;
    let emailKey = null;
    FirebaseRef.child('appointments').child(recipeInfo.masteruid).child(recipeInfo.id).once('value', (snapshot) => {
      if (snapshot.val()) {
        emailKey = snapshot.val().masterEmail.replace(/[.]/g, ',');
        let appointmentMessages = FirebaseRef.child('messages').child(emailKey).child(recipeInfo.id).child('messages');
        appointmentMessages ? appointmentMessages.on('value', (appointmentSnap) => {
          let tempMessages = appointmentSnap.val();
          that.setState({messages: tempMessages, masterEmail: snapshot.val().masterEmail});
        }) : null
      }
    }).then(() => {
      let tempObject = {};
      tempObject[name] = true;
      emailKey ? FirebaseRef.child('messages').child(emailKey).child(recipeInfo.id).child('usersRead').update(tempObject) : null;
      FirebaseRef.child('appointments').child(recipeInfo.masteruid).child(recipeInfo.id).child('invitedUsers').once('value', (snapshot) => {
        let invitedUsers = snapshot.val();
        that.setState({invitedUsers: invitedUsers});
      })
    });
  }

  onSend(messages = []) {
    let recipeInfo = this.props.recipes.recipe;
    let emailKey = this.state.masterEmail.replace(/[.]/g, ',');
    let appointmentMessages = FirebaseRef.child('messages').child(emailKey).child(recipeInfo.id).child('messages');
    let appointmentRead = FirebaseRef.child('messages').child(emailKey).child(recipeInfo.id).child('usersRead');
    let name = `${this.props.member.firstName} ${this.props.member.lastName}`;

    if (this.state.invitedUsers) {
      let recipeInfo = this.props.recipes.recipe;
      let tempUsersRead = {};
      Object.keys(this.state.invitedUsers).map((key) => {
        name !== key ? tempUsersRead[key] = false : tempUsersRead[key] = true;
      });
      appointmentRead.set(tempUsersRead);
    }
    if (appointmentMessages) {
      appointmentMessages.set(messages.concat(this.state.messages));
    }
  }

  render() {
    const { loading, error, success, member } = this.props;

    // Loading
    if (loading) return <Loading />;

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
            <GiftedChat
              messages={this.state.messages}
              keyboardShouldPersistTaps='always'
              submitOnReturn={true}
              bottomOffset={48}
              showUserAvatar={true}
              onPressAvatar={(user) => this.toggleModal(user)}
              onSend={(messages) => {
                this.onSend(messages);
                }}
              user={{
                name: `${member.firstName} ${member.lastName}`,
                _id: member.email
              }}
            />
            { this.state.modalVisible ?
              <Modal isVisible={this.state.modalVisible}
              onRequestClose={() => this.toggleModal()}
              animationType='slide'
              transparent={true}>
                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalVisible: false})} style={{flex: 1}}>
                    <View style={{width: '100%', height: '16%', backgroundColor: '#f5f5f5'}}>
                      <TouchableOpacity activeOpacity={1} onPress={() => this.setState({modalVisible: true})} style={{flex: 1}}>
                        <View style={{width: '100%', bottom: 0, position: 'absolute', paddingLeft: 15}}>
                          <Text style={{fontWeight: '700', fontSize: 20, paddingBottom: 10}}> Full Name: <Text style={{fontWeight: '300'}}>{this.state.user.name}</Text> </Text>
                          <Text style={{fontWeight: '700', fontSize: 20, paddingBottom: 15}}> Email: <Text style={{fontWeight: '300'}}>{this.state.user._id}</Text> </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                </TouchableOpacity>
              </Modal> : null }
        </View>
      );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  recipes: state.recipes || {},
});

const mapDispatchToProps = {
  getMemberData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
