const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');
const restify = require('restify');
const request = require('request');

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MicrosoftAppId, 
    appPassword: process.env.MicrosoftAppPassword 
});

const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

server.post('/api/messages', async (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    if (context.activity.type === 'message') {
        const state = conversationState.get(context);
        state.count = ++state.count || 0;
        return context.sendActivity(`${state.count}- you said : ${context.activity.text}`);
    } else {
      return context.sendActivity(`[${context.activity.type} event detected]`);
    }
  });
});

