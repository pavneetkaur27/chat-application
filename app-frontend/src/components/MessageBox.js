import React from 'react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const MessageBox = (props) => {

    let sentbyself = false;
    const aid = cookies.get('a_id');

    if(props.account && aid == props.account._id){
        sentbyself = true;
    }

    return (
        <div>
            {sentbyself ? 
                <div className="message-box-section sent-section">
                    <div className="message-sender-name ">
                        You
                    </div>
                    <div className="message-text">
                        {props.msg}
                    </div>
                </div>
            :
                <div className="message-box-section received-section">
                    <div className="message-sender-name">
                        {props.account ? props.account.name : null}
                    </div>
                    <div className="message-text">
                        {props.msg}
                    </div>
                </div>
            }
        </div>
    );
}

export default MessageBox;