import React, { Component } from 'react';
import {connect} from "react-redux";
import { Switch, Route,withRouter } from 'react-router-dom';
import OrganisationLogIn from './orgLogin';
import JoinGroup from './joinGroup';
import Header from './partials/header';
import Alert from './shared/Alert';
import Loader from './shared/Loader';
import Cookies from 'universal-cookie';
import bvalid from 'bvalid/lib/bvalid.es';
const cookies = new Cookies();

class OrgHome extends Component {
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
                <Route exact path="/login" render={() => <OrganisationLogIn /> }/>  
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
      loading: state.ordReducer.loading,
      orgpanel : state.ordReducer
  }
}

const mapDispatchToProps = {};


export default withRouter(connect(mapStateToProps,mapDispatchToProps)(OrgHome))