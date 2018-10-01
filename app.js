const {BotFrameworkAdapter,ActivityTypes,MemoryStorage,ConversationState} = require('botbuilder');
let server = require('restify').createServer();

const adapter = new BotFrameworkAdapter();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});


const conversationState = new ConversationState(new MemoryStorage());
let countProperty = conversationState.createProperty("CountProperty");

async function save(context,count){
  await countProperty.set(context,count);
  await conversationState.saveChanges(context);
}
server.post('/api/messages', async (req, res) => {
  
  adapter.processActivity(req,res, async context=>{

    if(context.activity.type == ActivityTypes.Message){
      let count = await countProperty.get(context,0);
      count++;

      await context.sendActivity(`${count} - You said ${context.activity.text}`);
      await save(context,count);
    }
    else if(isUserJoinEvent(context)){
      await handleNewUser(context);
    }

  });

});

function isUserJoinEvent(context){
  return context.activity.type == "conversationUpdate" && context.activity.membersAdded && context.activity.membersAdded.length > 0;
}

function handleNewUser(context){
  let user = getNewUser(context);
  if( (user && !isWebChat(context)) || (!user && isWebChat(context))){
    return context.sendActivity(`Hello ! I'm your friendly demo bot.`);
  }
}

function isWebChat(context){
    return context.activity.channelId == 'webchat';
}
function getNewUser(context){
  return context.activity.membersAdded.find(member=> member.id != context.activity.recipient.id);
}