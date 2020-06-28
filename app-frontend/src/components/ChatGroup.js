import React, { Component } from 'react'
import {connect} from "react-redux";
import io from "socket.io-client";
import { withRouter } from 'react-router';
import MessageBox from './MessageBox';
import { fetchChatHistory } from '../actions/chatAction';
import {joinSocket,sendMessage,messageReceived} from '../actions/socketAction';
import {API_ENDPOINT} from '../constants';
import Loader from './shared/Loader';

const socket = io(API_ENDPOINT);

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
        if(node.scrollTop == 0){
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

    render() {
        
        if(!this.props.chatReducer.allmessages){
            return (
                <div>

                <Loader />
                    <div style={{ float:"left", clear: "both" }}
                        ref={(el) => { this.messagesEnd = el; }}>
                    </div>
                </div>
            );
        }else{      
            return (
                <div>
                    <div className="chat-box-container" style={{margin: '0 auto', maxWidth: 767}}>
                        <div className="group-name-section">
                            {this.state.groupname}
                            <div style={{float: 'right'}}>sds</div>
                        </div>
                        <div ref={this.paneDidMount}  className="message-container">
                        {this.state.showLoading ? 
                            <div className="chat-loader">
                                Loading....
                            </div>
                        : null}
                            {this.props.chatReducer.allmessages.length == 0 ? '' :
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
                                <input type="text" className="ipt-send-msg" value={this.state.msg} onChange={this.handleMsgChange}></input>
                                <button type="submit"  className="btn-send-msg" disabled={this.validateMessageInput()} >Send</button>
                            </form>
                        </div>
                    </div>  
                </div>
            );
        }
    }
}

const mapStateToProps = state => {
  return {
    chatReducer : state.chatReducer
  }
}


const mapDispatchToProps = {joinSocket,sendMessage,fetchChatHistory,messageReceived};

export default withRouter(connect( mapStateToProps, mapDispatchToProps)(ChatGroup));