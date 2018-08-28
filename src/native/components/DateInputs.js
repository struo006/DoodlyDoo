import React from 'react';
import { connect } from 'react-redux';
import {Firebase,FirebaseRef} from './../../lib/firebase.js';
import { Container, Icon, Button, View, Text, Modal, Card, CardItem, List, Content, ListItem, Body, Separator} from 'native-base';
import { ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Colors from '../../../native-base-theme/variables/commonColor';
import CalculateDates from './CalculateDates';


class DateInputs extends React.Component {
  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      inputtedInfo: null,
      showMessage: true,
    };
  }

  componentWillMount() {
    that = this;
    let recipeInfo = this.props.recipes.recipe;
    FirebaseRef.child('appointments').child(recipeInfo.masteruid).child(recipeInfo.id).child('userDates').once('value', (snapshot) => {
      that.setState({inputtedInfo: snapshot.val()});
    });
  }

  componentDidMount () {
    if (this.state.inputtedInfo) {
      Object.values(this.state.inputtedInfo).map((value) => {
        if (value[this.props.date]) {
          this.setState({showMessage: false});
        }
      });
    }
  }

  printInputs = (object) => object ? Object.entries(object).map(([key, value]) => (
    <View>
      {
      value[this.props.date] ?
      <ListItem itemDivider style={{paddingLeft: 20, paddingBottom: 12, paddingTop: 12}}>
          <Text style={{fontWeight: '700', fontSize: '17'}}>{value.name} ({key.replace(/[,]/g, '.')})</Text>
       </ListItem> : null
      }
       {
         Object.entries(value).map(([date, timesArray]) => {
           if (this.props.date === date) {
             return timesArray.map((times) => (
                    <ListItem key={key} rightIcon={{ style: { opacity: 0 } }} style={{paddingLeft: 20, borderBottomWidth: 0}}>
                       <Text>{times.start} - {times.end}</Text>
                    </ListItem>
                  ));
          }
        })
      }
     </View>
   )) : null

  render() {
    const { recipes, member } = this.props;

    return (
        <ScrollView style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
          {
            this.state.showMessage ?
             <Text style={{paddingLeft: 15, paddingTop: 15}}> No inputted times for this date </Text> :
                <List>
                  <ListItem itemHeader style={{paddingBottom: 12, paddingTop: 12}}>
                    <Icon active name="ios-time" style={{paddingRight: 20, color: Colors.brandPrimary}}/>
                    <Text style={{fontWeight: '800', fontSize: '19'}}> Non-conflicting Times </Text>
                  </ListItem>
                  <CalculateDates inputtedInfo={this.state.inputtedInfo} date={this.props.date} recipe={this.props.recipe}/>

                  <ListItem itemHeader style={{paddingBottom: 12, paddingTop: 12}}>
                    <Icon active name="ios-person" style={{fontSize: 40, paddingRight: 20, color: Colors.brandPrimary}}/>
                    <Text style={{fontWeight: '800', fontSize: '19'}}> Individual Times </Text>
                  </ListItem>
                  {this.printInputs(this.state.inputtedInfo)}
                </List>
          }
        </ScrollView>
      );
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
  recipes: state.recipes || {},
});

export default connect(mapStateToProps)(DateInputs);
