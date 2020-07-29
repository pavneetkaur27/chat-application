import React, { Component } from 'react'
import {connect} from "react-redux";
import io from "socket.io-client";
import WebPurify from 'webpurify';
import { withRouter } from 'react-router';
import MessageBox from './MessageBox';
import { fetchChatHistory ,getActiveUser} from '../actions/chatAction';
import {joinSocket,sendMessage,messageReceived,activeUsers,inactiveUser} from '../actions/socketAction';
import {API_ENDPOINT} from '../constants';
import Loader from './shared/Loader';
import UserIcon from '../assests/profilepic.svg';
import ActiveUserIcon from '../assests/ico_active.svg';

const socket = io(API_ENDPOINT);

const wp = new WebPurify({
    api_key: 'test'
    //, endpoint:   'us'  // Optional, available choices: 'eu', 'ap'. Default: 'us'.
    //, enterprise: false // Optional, set to true if you are using the enterprise API, allows SSL
});

class ChatGroup extends Component {
    constructor(props){
        super(props);
        this.state = {
           msg  : '',
           name : (this.props.history.location && this.props.history.location.state && this.props.history.location.state.data ) ? this.props.history.location.state.data.name : '',
           groupname : (this.props.history.location && this.props.history.location.state &&  this.props.history.location.state.data ) ? this.props.history.location.state.data.groupname : '',
           aid :  (this.props.history.location && this.props.history.location.state && this.props.history.location.state.data ) ? this.props.history.location.state.data.aid : '',
           gid : (this.props.history.location && this.props.history.location.state && this.props.history.location.state.data ) ? this.props.history.location.state.data.gid : '',
           showLoading : false
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
      
    componentDidMount() {
        this.scrollToBottom();
        let data = {
            aid     : this.state.aid,
            gid     : this.state.gid,
            tim     : new Date().getTime()
        }
        this.props.joinSocket(socket,data);
        this.props.fetchChatHistory(data);
        socket.on('ev', (data) => {
            this.props.messageReceived(data);
        });
        socket.on('aciveusers', (data) => {
            this.props.activeUsers(data);
        });
        socket.on('inactiveuser', ( data) =>{
            this.props.inactiveUser(data,this.props.chatReducer?.activeusers);
        })
        socket.on('connect_error', (error) => {
            this.props.joinSocket(socket,data);
        });
       
    }
      
    componentDidUpdate() {
        this.scrollToBottom();
    }

    handleMsgChange = (e) =>{
        this.setState({
            msg : e.target.value
        })
    }

    validateMessageInput(){
        return !(this.state.msg !== '');
    }

    sendMessage = (e) =>{

        e.preventDefault();
 
        // wp.check('bagot')
        // .then(profanity => {
        //     console.log(profanity);
        //     if (profanity) {
        //         alert("profanity found");
        //     } else {
            let data  = {
                msg : this.state.msg,
                aid     : this.state.aid,
                gid     : this.state.gid
            }
            this.props.sendMessage(socket, data)
                .then(res =>{
                    this.setState({
                        msg : ''
                    })     
                })   
            // }   
        // }).catch (err => {
        //     console.log(err);
        // });
     
    }
    
    paneDidMount = (node) => {    
        if(node) {      
          node.addEventListener("scroll", this.handleScroll.bind(this));      
        }
    }
    
    handleScroll = (event) => {    
        let node = event.target;
        let data = {
            aid     : this.state.aid,
            gid     : this.state.gid,
            tim     : this.props.chatReducer.allmessages[0].createdAt,
            previous_msg : true
        }
        if(node.scrollTop === 0){
            this.setState({showLoading : true})
            this.props.fetchChatHistory(data)
                .then(res => {
                    this.setState({
                        showLoading : false
                    })
                    if(res.data.data.allmessages.length > 14){
                        node.scrollTop = parseInt(node.clientHeight/2);
                    }
                })
        } 
    }

    getActiveUsers = () =>{
        this.props.getActiveUser({gid : this.state.gid});
    }
    render() {
        // console.log(this.props);
        return (
            <div>
                <div className="chat-box-container" style={{margin: '0 auto', maxWidth: 1167}}>
                    <div className="group-name-section">
                        {this.state.groupname}
                        
                    </div>
                    <div className="row no-padding no-margin">
                        <div className="col-12 col-sm-9 no-padding no-margin">
                            <div ref={this.paneDidMount}  className="message-container">
                                {this.state.showLoading ? 
                                    <div className="chat-loader">
                                        Loading....
                                    </div>
                                : null}
                                { (!this.props.chatReducer?.allmessages  || this.props.chatReducer.allmessages.length == 0) ? '' :
                                    this.props.chatReducer.allmessages.map((messageobj, i) => 
                                    <MessageBox 
                                        {...messageobj}
                                        key = {messageobj._id + messageobj.createdAt + i}    
                                    />
                                )}

                                <div style={{ float:"left", clear: "both" }}
                                    ref={(el) => { this.messagesEnd = el; }}>
                                </div>
                            </div>
                            <div className="send-message-container">
                                <form  onSubmit={this.sendMessage} >
                                    <div className="row no-margin no-padding">
                                        <div className="col-9 col-lg-10 col-sm-9 no-margin no-padding">
                                            <input type="text" className="ipt-send-msg" value={this.state.msg} onChange={this.handleMsgChange}></input>
                                        </div>
                                        <div className="col-3 col-lg-2 col-sm-3 no-margin no-padding">
                                            <button type="submit"  className="btn-send-msg" disabled={this.validateMessageInput()} >Send</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-sm-3 no-margin hide-sm" style={{padding:16}} >
                            <div>
                                
                                { (!this.props.chatReducer?.activeusers  || this.props.chatReducer?.activeusers.length == 0 )? '' : 
                                    this.props.chatReducer?.activeusers.map( (user) => {
                                        return (
                                            <div className="active-user-section" key={user._id}>
                                                <img alt="*" className="active-user-img"  onClick={this.getActiveUsers} src={UserIcon}></img>
                                                <span className="active-icon" style={{marginLeft:'-8px'}}><img style={{marginTop:'20px'}} src={ActiveUserIcon}></img></span>             
                                                <span style={{marginLeft:12}}>{user.name}</span>
                                                {user.groupadmin ? <span className="message-admin">Admin</span> : null}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>  
            </div>
        );
    }
}

const mapStateToProps = state => {
  return {
    chatReducer : state.chatReducer
  }
}


const mapDispatchToProps = {joinSocket,sendMessage,fetchChatHistory,messageReceived,getActiveUser,activeUsers,inactiveUser};

export default withRouter(connect( mapStateToProps, mapDispatchToProps)(ChatGroup));