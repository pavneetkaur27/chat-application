import React, { Component } from 'react'
import {connect} from "react-redux";
import Card from '@material-ui/core/Card';
import { withRouter } from 'react-router';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import { ChatGroup } from '../actions/chatAction';


class ChatGroup extends Component {
    constructor(props){
        super(props);
        this.state = {
           
        }
    }



    render() {

        return (
            <div>
               chat app
            </div>  
        );

    }
}

const mapStateToProps = state => {
  return {
  }
}


const mapDispatchToProps = {};

export default withRouter(connect( mapStateToProps, mapDispatchToProps)(ChatGroup));