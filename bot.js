const jokeService = require('./jokeservice');
const cardService = require('./cardService');


module.exports = class Bot{
  constructor(state,adapter){
    this.conversationState = state;
    this.adapter=adapter;
  }

  getState(context){
    return this.conversationState.get(context);
  }

  async Process(req, res) { 
    return this.adapter.processActivity(req, res,this.activityHandler.bind(this));
  }

  async activityHandler(context) {
    if (context.activity.type === 'message') {
        switch(context.activity.text){
          case 'show sessions':
            return context.sendActivity({ attachments: [cardService.createAdaptiveCard()] });

          case 'tell joke':
            var joke = await jokeService.getJoke();
            return context.sendActivity(joke);
            
          default:
            return context.sendActivity(`I didn't understand ${context.activity.text}. Can you rephrase please?`);
        }        
    }
  };
}

