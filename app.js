const {BotFrameworkAdapter, MemoryStorage, ConversationState} = require("botbuilder");
const restify = require('restify');

const adapter = new BotFrameworkAdapter({ 
  appId: process.env.MicrosoftAppId, 
  appPassword: process.env.MicrosoftAppPassword 
});

const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

server.post('/api/messages', async (req, res) => {
  adapter.processActivity(req,res, async context =>{
    if(context.activity.type == "message"){

      let state = conversationState.get(context);
      state.count = ++state.count || 0;

      return context.sendActivity(`${state.count} - You said "${context.activity.text}"`);

    } else if (isUserJoinEvent(context)){
      return handleNewUser(context);
    }
  });
});

function isUserJoinEvent(context){
  return context.activity.type = "conversationUpdate" && context.activity.membersAdded && context.activity.membersAdded.length > 0;
}

function handleNewUser(context){
  let user = getNewUser(context);
  if(user){
    return context.sendActivity(`Hello ${user.name}. I'm your friendly demo bot.`);
  }
}

function getNewUser(context){
  return context.activity.membersAdded.find(member=> member.id != context.activity.recipient.id);
}


