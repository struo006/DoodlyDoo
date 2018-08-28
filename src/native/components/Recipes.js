import React from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, TouchableOpacity, RefreshControl, Image, ScrollView } from 'react-native';
import { Container, Content, Card, CardItem, Body, Text, Button, H3} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { logout, getMemberData } from '../../actions/member';
import Loading from './Loading';
import Error from './Error';
import Header from './Header';
import Spacer from './Spacer';
import Colors from '../../../native-base-theme/variables/commonColor';


const RecipeListing = ({
  error,
  loading,
  recipes,
  reFetch,
  member,
  setCurrentRecipe,
}) => {
  // Loading
  if (loading) return <Loading />;

  // Error
  if (error) return <Error content={error} />;

  const keyExtractor = item => item.id;

  const onPress = item => {
    setCurrentRecipe({id: item.id, masteruid: item.masteruid});
    return Actions.recipe({ match: { params: { id: String(item.id), member: member } } });
  }

  return (
    <Container>
      {(member && member.email) ?
      <View style={{paddingTop: 10,marginBottom: 30}}>
        <Button bordered
                style={{width: '95%', alignSelf: 'center', shadowColor: '#608296'}}
                onPress={Actions.addAppointment1}>
          <Text style={{width: '100%', textAlign: 'center'}}>Create Appointment</Text>
        </Button>
        <ScrollView style={{height: "99%"}}>
          <Spacer size={10} />
          <FlatList
            numColumns={1}
            data={recipes}
            renderItem={({ item }) => (
              <Card style={{marginBottom: 10, width: '95%', alignSelf: 'center'}}>
                <CardItem header bordered={true} style={{backgroundColor: 'ghostwhite'}}>
                  <Text style={{ fontWeight: '600', color: Colors.brandPrimary}}>{item.appointmentName}</Text>
                  <Button bordered small onPress={() => onPress(item)}
                    style={{right: 0, position: 'absolute', top: 9.5, borderColor: Colors.brandPrimary, marginRight: 10}}>
                    <Text style={{color: Colors.brandPrimary}}>View</Text>
                  </Button>
                </CardItem>
                <CardItem cardBody bordered={false} style={{backgroundColor: 'ghostwhite'}}>
                  <Body style={{paddingLeft: 15}}>
                    <Spacer size={10} />
                    <Text style={{fontWeight: '600'}}>Created By: <Text style={{fontWeight: '200'}}> {item.masterName} </Text> </Text>
                    <Spacer size={10} />
                  </Body>
                </CardItem>
              </Card>
            )}
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {}}
              />
            }
          />
          <Spacer size={20} />
        </ScrollView>
      </View>
      :
      <View style={{justifyContent: 'center', alignSelf: 'center', flex: 1}}>
        <Button bordered style={{shadowColor: '#608296', alignSelf: 'center', marginBottom: 20}} onPress={Actions.loginFromLanding}>
          <Text style={{textAlign: 'center'}}>Sign In</Text>
        </Button>
        <Button bordered style={{shadowColor: '#608296'}} onPress={Actions.signFromLanding}>
          <Text style={{textAlign: 'center'}}>Create Account</Text>
        </Button>
      </View>}
    </Container>
  );
};

RecipeListing.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  recipes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  reFetch: PropTypes.func,
};

RecipeListing.defaultProps = {
  error: null,
  reFetch: null,
};

export default RecipeListing;
