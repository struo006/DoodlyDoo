import React from 'react';
import { Image, ScrollView } from 'react-native';
import {Container, Body, List, Left, ListItem, Content, Text, H1, H2, H3, Button, View, Card, CardItem, Icon } from 'native-base';
import Colors from '../../../native-base-theme/variables/commonColor';
import Spacer from './Spacer';
import { connect } from 'react-redux';

import { Actions } from 'react-native-router-flux';

import { logout, getMemberData } from '../../actions/member';
import Swiper from 'react-native-swiper';

let temp = "'s Dashboard";

const printFriendRequestMessages = (friendRequests) =>
  friendRequests ? Object.entries(friendRequests).map(([key, value]) =>
    <ListItem onPress={Actions.manageContactsFromLanding} style={{backgroundColor: 'ghostwhite', alignSelf: 'stretch'}}>
      <Icon active name="ios-person-add" style={{color: Colors.brandPrimary, paddingRight: 15}}/>
      <Text style={{color: Colors.brandPrimary}}> New friend request from {value.firstName} {value.lastName} </Text>
    </ListItem>
  ) : null

  const printUnreadMessages = (member, setCurrentRecipe) =>
    member && member.unreadMessages ? Object.entries(member.unreadMessages).map(([key, value]) =>
      <ListItem onPress={() => {
        setCurrentRecipe({id: value.id, masteruid: value.masteruid});
        Actions.recipe({ match: { params: { id: String(value.id), member: member } } });
      }} style={{backgroundColor: 'ghostwhite', alignSelf: 'stretch'}}>
        <Icon active name="ios-chatbubbles" style={{color: Colors.brandPrimary, paddingRight: 15}}/>
        <Text style={{color: Colors.brandPrimary}}> New Messages in {key} </Text>
      </ListItem>
    ) : null

const printUpcomingAppointments = (appointments, member) =>
  appointments.map((value) =>
    <ListItem onPress={() => Actions.recipe({ match: { params: { id: String(value.id), member: member } } })} style={{backgroundColor: 'ghostwhite', alignSelf: 'stretch'}}>
      <Icon active name="md-calendar" style={{color: Colors.brandPrimary, paddingRight: 15}}/>
      <View horizontal={true} style={{flexDirection: 'column'}}>
        <Text style={{fontWeight: '500'}}> Today: <Text style={{fontWeight: '800', color: Colors.brandPrimary}}> {value.appointmentName} </Text> </Text>
        <Text style={{fontWeight: '300'}}> {value.meetupDate}:  {value.meetupTime} </Text>
      </View>
    </ListItem>
  );

const printNewAppointments = (appointments, member, setCurrentRecipe) =>
  appointments.map((value) =>
    <ListItem onPress={() => {
      setCurrentRecipe({id: value.id, masteruid: value.masteruid});
      Actions.recipe({ match: { params: { id: String(value.id), member: member } } })
    }} style={{backgroundColor: 'ghostwhite', alignSelf: 'stretch'}}>
      <Icon active name="md-clock" style={{color: Colors.brandPrimary, paddingRight: 15}}/>
      <View horizontal={true} style={{flexDirection: 'column'}}>
        <Text style={{fontWeight: '500'}}> New Appointment: <Text style={{fontWeight: '800', color: Colors.brandPrimary}}> {value.appointmentName} </Text> </Text>
        <Text style={{fontWeight: '300'}}> Created by {value.masterName} </Text>
      </View>
    </ListItem>
  );

const About = ({member, recipes, newRecipes, setCurrentRecipe}) => (
    <Container>
      {(member && member.email) ?
        <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
          <View style={{paddingTop: 15, paddingBottom: 15, width: '95%'}}>
            <H2 style={{width: '100%', textAlign: 'center', color: Colors.brandPrimary}}>{member.firstName+temp} </H2>
          </View>
          <Card style={{width: '95%', alignSelf: 'center'}}>
            <CardItem header bordered style={{backgroundColor: 'ghostwhite'}}>
              <Icon active name="ios-alert" style={{color: Colors.brandPrimary}}/>
              <Text>Updates!</Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'ghostwhite'}}>
              <List>
                  {printNewAppointments(newRecipes, member, setCurrentRecipe)}
                  {printUpcomingAppointments(recipes, member)}
                  {printUnreadMessages(member, setCurrentRecipe)}
                  {Array.isArray(recipes) && recipes.length <= 0 && Array.isArray(newRecipes) && newRecipes.length <= 0 && member && member.unreadMessages && Object.keys(member.unreadMessages).length <= 0 ?
                    <Text> You are all up to date </Text> : null}

              </List>
            </CardItem>
          </Card>
          <Spacer size={20} />
          <Card style={{width: '95%', alignSelf: 'center'}}>
            <CardItem header bordered style={{backgroundColor: 'ghostwhite'}}>
              <Icon active name="ios-bookmark" style={{color: Colors.brandPrimary}}/>
              <Text>Account Activity</Text>
            </CardItem>
            <CardItem style={{backgroundColor: 'ghostwhite'}}>
              <List>
                {printFriendRequestMessages(member.friendRequests)}
                {member && member.friendRequests && Object.keys(member.friendRequests).length <= 0 ? <Text> No recent activities </Text> : null}
              </List>
            </CardItem>
          </Card>
          <Spacer size={40} />
        </ScrollView> :


        <Swiper showsButtons={false}>
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <Card style={{width: '95%', alignSelf: 'center', paddingBottom: 15, justifyContent: 'center'}}>
              <H3 style={{paddingTop: 15, alignSelf: 'center'}}> Welcome to DoodlyDoo </H3>
              <CardItem header>
                  <Body><Text style={{fontWeight: '600', alignSelf: 'center'}}>The Event Planning App</Text></Body>
              </CardItem>
            </Card>
          </View>

          <View style={{flex: 1, backgroundColor: 'white'}}>
            <Card style={{width: '95%', alignSelf: 'center', paddingBottom: 15}}>
              <H3 style={{paddingTop: 15, alignSelf: 'center', paddingBottom: 10}}> Easily Make Appointments </H3>
              <CardItem cardBody>
                <Image source={{uri: 'https://media.giphy.com/media/3o7WIx6QRwSer4HyH6/giphy.gif'}} style={{height: 480, width: null, flex: 1}}/>
              </CardItem>
            </Card>
          </View>

            <View style={{flex: 1, backgroundColor: 'white'}}>
              <Card style={{width: '95%', alignSelf: 'center', paddingBottom: 15}}>
                <H3 style={{paddingTop: 15, alignSelf: 'center', paddingBottom: 10}}> Input Your Availabilities </H3>
                <CardItem cardBody>
                  <Image source={{uri: 'https://media.giphy.com/media/3o7WIMspZUYI8Tdhjq/giphy.gif'}} style={{height: 480, width: null, flex: 1}}/>
                </CardItem>
              </Card>
            </View>

            <View style={{flex: 1, backgroundColor: 'white'}}>
              <Card style={{width: '95%', alignSelf: 'center', paddingBottom: 15}}>
                <H3 style={{paddingTop: 15, alignSelf: 'center', paddingBottom: 10}}> Collaborating is Simple </H3>
                <CardItem cardBody>
                  <Image source={{uri: 'https://media.giphy.com/media/l0NgSywq4eYMU6G8o/giphy.gif'}} style={{height: 463, width: null, flex: 1}}/>
                </CardItem>
              </Card>
            </View>

            <View style={{flex: 1, backgroundColor: 'white'}}>
              <Card style={{width: '95%', justifyContent: 'center', alignSelf: 'center', paddingBottom: 15}}>
                <CardItem style={{alignSelf: 'center'}}>
                  <Button bordered style={{shadowColor: '#608296'}} onPress={Actions.signFromLanding}>
                    <Text style={{textAlign: 'center'}}>Get Started</Text>
                  </Button>
                </CardItem>
              </Card>
            </View>
        </Swiper>}

    </Container>
);

export default About;
