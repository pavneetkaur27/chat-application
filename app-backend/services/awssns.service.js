const aws = require('aws-sdk');
const config = require('../config/app').config;

aws.config.update({
    secretAccessKey: config.AWS_SECRET_KEY,
    accessKeyId: config.AWS_ACCESS_KEY,
    region: config.AWS_REGION
});


const sns = new aws.SNS({ apiVersion: config.AWS_API_VERSION });


// create a SNS Topic
function createSNSTopic(topicName) {
    sns.createTopic({ Name: topicName }, (err, resp) => {
        if (err) {
            console.log("Error: createSNSTopic", err, topicName);
            return err;
        }
        console.log("SNS Topic Created", topicName, resp.TopicArn);
        return resp.TopicArn;
    })
}

// get all SNS Topics 
function getAllSNSTopics() {
    sns.listTopics({}, (err, resp) => {
        if (err) {
            console.log("Error: getAllSNSTopics", err);
            return err;
        }
        console.log("SNS Topics", resp.Topics);
        return resp.Topics;    // return array ot Topics having TopicArn attribute
    })
}

// delete a SNS Topic
function deletSNSTopic(topicArn) {
    sns.deleteTopic({ TopicArn: topicArn }, err => {
        if (err) {
            console.log("Error: deletSNSTopic", err, topicArn);
            return err;
        }
        console.log("SNS Topic Deleted", topicArn);
        return;
    })
}

// set SNS Topic Attribute
function setSNSTopicAttributes(topicArn, attributeName, attributeValue) {
    const params = {
        TopicArn: topicArn,
        AttributeName: attributeName,    // for example setting 'DisplayName' value
        AttributeValue: attributeValue
    }
    sns.setTopicAttributes(params, (err, resp) => {
        if (err) {
            console.log("Error: setSNSTopicAttributes", err, topicArn);
            return err;
        }
        console.log("SNS Topic Attributes updated", topicArn);
        return;
    })
}

// get SNS Topic Attributes
function getSNSTopicAttributes(topicArn) {
    sns.getTopicAttributes({ TopicArn: topicArn }, (err, resp) => {
        if (err) {
            console.log("Error: getSNSTopicAttributes", err, topicArn);
            return err;
        }
        console.log("SNS Topic Attributes", topicArn, resp);
        return resp;    // return object { Policy ; {} , Owner: '', SubscriptionsPending: '', TopicArn: '', EffectiveDeliveryPolicy: {}, SubscriptionsConfirmed: '', DisplayName: '', SubscriptionsDeleted: ''

    })
}

// get all Subscriptions for a particular Topic
function getSubscriptionsByTopic(topicArn) {
    sns.listSubscriptionsByTopic({ TopicArn: topicArn }, (err, resp) => {
        if (err) {
            console.log("Error: getSubscriptionsByTopic", err, topicArn);
            return err;
        }
        console.log("SNS Subscriptions for Topic", topicArn, resp);
        return resp;  // return array of objects having attributes { SubscriptionArn: 'PendingConfirmation', Owner: '', Protocol: '', Endpoint: '', TopicArn: '' }
    })
}

// create subscription for a Topic
function createSNSTopicSubscription(topicArn, protocol, endPoint) {
    const params = {
        Protocol: protocol,   // protocol can be any one of these: HTTP, HTTPS, Email, Email-JSON, Amazon SQS, AWS Lambda 
        TopicArn: topicArn,
        Endpoint: endPoint  // API url, email address etc
    };
    sns.subscribe(params, (err, resp) => {
        if (err) {
            console.log("Error: createSNSTopicSubscription", err, topicArn);
            return err;
        }
        console.log("SNS Topic Subscription created", topicArn, resp);  
        return;
    })
}



// createSNSTopic('new');

// getAllSNSTopics();
// setSNSTopicAttributes('arn:aws:sns:us-east-2:208246506321:hhhh')

module.exports = {
    createSNSTopic,
    getAllSNSTopics,
    deletSNSTopic,
    setSNSTopicAttributes,
    getSNSTopicAttributes,
    getSubscriptionsByTopic,
    createSNSTopicSubscription
}