const {BotFrameworkAdapter, MemoryStorage, ConversationState} = require("botbuilder");
const BotGreeting = require('botbuilder-greeting');
const restify = require('restify');

const adapter = new BotFrameworkAdapter({ 
  appId: process.env.MicrosoftAppId, 
  appPassword: process.env.MicrosoftAppPassword 
});

adapter.use(new BotGreeting(context => {
  return `Hello ! I'm your friendly demo bot.`;
}));

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

    } 
  });
});


