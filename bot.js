const { LuisRecognizer } = require('botbuilder-ai');
const jokeService = require('./jokeservice');
const cardService = require('./cardService');


module.exports = class Bot{
  constructor(state,adapter,model){
    this.conversationState = state;
    this.adapter=adapter;
    this.model = model;
  }

  getState(context){
    return this.conversationState.get(context);
  }

  async Process(req, res) { 
    return this.adapter.processActivity(req, res,this.activityHandler.bind(this));
  }

  async activityHandler(context) {
    const state = this.getState(context);
    if (context.activity.type === 'message') {
      await this.model
      .recognize(context)
      .then(async res => {
        let intent = state.intent = LuisRecognizer.topIntent(res);

        switch(intent){
          case 'TellJoke':
            var joke = await jokeService.getJoke();
            return context.sendActivity(`Found this joke: ${joke}`);  

          case 'FindSessionList':
            return context.sendActivity({ attachments: [cardService.createAdaptiveCard()] });
          
          case 'FindSessionBySpeaker':
            let speaker =  res.entities['Speaker'];
            let session = res.entities['Session'];
            return context.sendActivity(` Yes! Speaker: ${speaker} | Session: ${session}`);            
          
          default:
            return context.sendActivity(`I didn't understand ${context.activity.text}. Can you rephrase please?`);
        }

      });          
    } else if (this.isUserJoinEvent(context)){
      return this.handleNewUser(context);
    }
  };
  
  isUserJoinEvent(context){
    return context.activity.type = "conversationUpdate" && context.activity.membersAdded && context.activity.membersAdded.length > 0;
  }

  handleNewUser(context){
    let user = this.getNewUser(context);
    if(user){
      return context.sendActivity(`Hello ${user.name}. I'm your friendly demo bot.`);
    }
  }

  getNewUser(context){
    return context.activity.membersAdded.find(member=> member.id != context.activity.recipient.id);
  }
}


