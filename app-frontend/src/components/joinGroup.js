import React, { Component } from 'react'
import {connect} from "react-redux";
import Card from '@material-ui/core/Card';
import { withRouter } from 'react-router';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { joinGroup } from '../actions/chatAction';


class JoinGroup extends Component {
    constructor(props){
        super(props);
        this.state = {
            name        : '',
            groupname   : '',
            isNameError : false,
            isGroupNameError : false,
        }
    }


    nameHandleChange = (e) =>{
        this.setState({
            isNameError : false,
            name : e.target.value,
        })
    }

    groupnameHandleChange = (e) =>{
        this.setState({
            isGroupNameError : false,
            groupname : e.target.value,
        })
    }

    joingroup = () => {
       
        if(!this.state.name && !this.state.groupname ){
            this.setState({
                isNameError : true,
                isGroupNameError : true
            })
        }else if(!this.state.name ){
            this.setState({
                isNameError : true,
            })
        }else if(!this.state.groupname){
            this.setState({
                isGroupNameError : true,
            })
        }else{
            var data = {
                name        : this.state.name,
                groupname   : this.state.groupname
            }
            this.props.joinGroup(data);
            // this.props.history.push({
            //     pathname : '/chatgroup',
            //     state    : {
            //         uname : this.state.name,
            //         groupname : this.state.groupname
            //     }
            // })
            
        }
    }

    render() {

        return (
            <div >
                <Typography className="org-signup-form-heading" gutterBottom>
                   Join chat group
                </Typography>
              
                <div className="row center-all no-margin no-padding">
                    <Card className="col-xl-4 col-lg-6  col-sm-6 org-login-card-container" >
                        <CardContent>
                            <div className="">
                                <Typography className="org-signup-detail-title"   gutterBottom>
                                    Name
                                </Typography>
                                <input type="text" required className={this.state.isNameError ? "org-signup-input-field org-err-input" : "org-signup-input-field"} placeholder="Ex : pavneet" value={this.state.name} onChange={this.nameHandleChange} />
                                
                                {this.state.isNameError ? <p className="org-error-msg">Please enter your name</p> : null }
                                
                                <Typography className="org-signup-detail-title"   gutterBottom style={{marginTop:24}}>
                                    Group Name
                                </Typography>
                                <input type="text" required className={this.state.isGroupNameError ? "org-signup-input-field org-err-input" : "org-signup-input-field"} placeholder="Ex : Chat Club" value={this.state.groupname} onChange={this.groupnameHandleChange} />
                                {this.state.isGroupNameError ? <p className="org-error-msg">Please enter Group name</p> : null }
                               
                                <Button variant="contained" className="org-signup-btn org-signup-detail-title-margin" onClick={this.joingroup}>
                                    Join
                                </Button>
                            </div>       
                        </CardContent>
                    </Card>
                </div>
            </div>  
        );

    }
}

const mapStateToProps = state => {
  return {
  }
}


const mapDispatchToProps = {joinGroup};

export default withRouter(connect( mapStateToProps, mapDispatchToProps)(JoinGroup));