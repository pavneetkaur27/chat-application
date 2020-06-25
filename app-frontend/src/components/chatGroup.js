import React, { Component } from 'react'
import {connect} from "react-redux";
import io from "socket.io-client";
import Card from '@material-ui/core/Card';
import { withRouter } from 'react-router';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import { ChatGroup } from '../actions/chatAction';
import {API_ENDPOINT} from '../constants';

const socket = io(API_ENDPOINT);

class ChatGroup extends Component {
    constructor(props){
        super(props);
        this.state = {
           uname : (this.props.history.location && this.props.history.location.state ) ? this.props.history.location.state.uname : '',
           groupname : (this.props.history.location && this.props.history.location.state ) ? this.props.history.location.state.groupname : '',
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
      
    componentDidMount() {
        this.scrollToBottom();
        var data = {
            name        : this.state.uname,
            groupname   : this.state.groupname
        }

        socket.emit('joingroup', (data) , (err) => {console.log(err)});
    }
      
    componentDidUpdate() {
        this.scrollToBottom();
    }


    render() {
        return (
            <div>
                <div className="chat-box-container" style={{margin: '0 auto', maxWidth: 767}}>
                    <div className="group-name-section">
                        {this.state.groupname}
                    </div>
                    <div className="message-container">
                        <div>test</div>
                        <div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div><div>test</div>
                        <div>pavi</div>
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="send-message-container">
                        <input type="text" className="ipt-send-msg"></input>
                        <button className="btn-send-msg">Send</button>
                    </div>
                </div>  
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