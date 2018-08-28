import React from 'react';
import PropTypes from 'prop-types';
import { Container, Content, Text, Body, ListItem, Form, Item, Label, Input, CheckBox, Button, View, H3, Icon } from 'native-base';
import { Scene, Tabs, Stack, Actions } from 'react-native-router-flux';
import Colors from '../../../native-base-theme/variables/commonColor';
import Messages from './Messages';
import Loading from './Loading';
import Header from './Header';
import Spacer from './Spacer';

class AddAppointment1 extends React.Component {
  // static propTypes = {
  //   error: PropTypes.string,
  //   success: PropTypes.string,
  //   loading: PropTypes.bool.isRequired,
  //   onFormSubmit: PropTypes.func.isRequired,
  //   member: PropTypes.shape({
  //     firstName: PropTypes.string,
  //     lastName: PropTypes.string,
  //     email: PropTypes.string,
  //   }).isRequired,
  // }

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      apptName: this.props.isEdit ? this.props.recipe.appointmentName : '',
      description: this.props.isEdit ? this.props.recipe.description : '',
      location: this.props.isEdit ? this.props.recipe.location : '',
      errorMessage: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(name, value) {
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(e) {
    if (this.state.apptName == '' || this.state.description == '' || this.state.location == '') {
      this.setState({
        errorMessage: "Please fill out all missing fields."
      });
    }
    else {
      this.setState({
        errorMessage: ''
      });
      Actions.addAppointment2({apptName:this.state.apptName, description:this.state.description, location:this.state.location, isEdit: this.props.isEdit, recipe: this.props.recipe});
    }
  }

  render() {
    const { loading, error, success } = this.props;

    // Loading
    if (loading) return <Loading />;

    return (
      <Container>
        <Content padder>
          <Text style={{width: '100%', textAlign: 'center'}}> Step 1 of 3 </Text>
          <Spacer size={50} />
          {error && <Messages message={error} />}
          {success && <Messages message={success} type="success" />}

          <Form>
            <Item>
              <Icon active name="md-list" style={{color: Colors.brandPrimary}}/>
              <Input
                value={this.props.isEdit ? this.state.apptName : null}
                placeholder="Appointment Name"
                onChangeText={v => this.handleChange('apptName', v)}
              />
            </Item>
            <Spacer size={25} />
            <Item>
              <Icon active name="md-menu" style={{color: Colors.brandPrimary}}/>
              <Input
                value={this.props.isEdit ? this.state.description : null}
                placeholder="Brief Description"
                onChangeText={v => this.handleChange('description', v)}
              />
            </Item>
            <Spacer size={25} />
            <Item>
              <Icon active name="md-pin" style={{color: Colors.brandPrimary}}/>
              <Input
                value={this.props.isEdit ? this.state.location : null}
                placeholder="Location"
                onChangeText={v => this.handleChange('location', v)}
              />
            </Item>

            <Spacer size={60} />
            <Text style= {{color:'red', height:20}}>{this.state.errorMessage}</Text>
            <Spacer size={10} />
            <Button block onPress={this.handleSubmit}>
              <Text>Continue</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default AddAppointment1;
