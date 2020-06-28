import React, { Component } from 'react';
import {connect} from "react-redux";
import { Switch, Route,withRouter } from 'react-router-dom';
import JoinGroup from './JoinGroup';
import ChatGroup from './ChatGroup';
import Header from './partials/header';
import Alert from './shared/Alert';
import Loader from './shared/Loader';
import Cookies from 'universal-cookie';
import bvalid from 'bvalid/lib/bvalid.es';
const cookies = new Cookies();

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn : false
    }
  }

  componentWillMount(){
    
      this.setState({
        isLoggedIn : true,
      })
  }
  
 

  render(){
    // console.log(this.props);
    return (
      <div className="org-main-body">

        <Alert/>
                 
          <Header />
          <div >
            <Loader loading={this.props.loading}/>
            <Switch>
                <Route exact path="/" render={() => <JoinGroup /> }/>
                <Route exact path="/chatgroup" render={() => <ChatGroup /> }/>
              </Switch>
          </div>
    
      </div>
    );
  }
}


class InvalidPage extends Component {
  render() {
      return (
          <div className="page-not-found">
            Sorry! Page not found.
          </div>
      );
  }
}

const mapStateToProps = state => {
  return {
      loading: state.chatReducer.loading,
      chatReducer : state.chatReducer
  }
}

const mapDispatchToProps = {};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Home))