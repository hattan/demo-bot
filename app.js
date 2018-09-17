const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');
const { LuisRecognizer } = require('botbuilder-ai');
const restify = require('restify');
const Bot = require('./bot');

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

//LUIS Configs
const appId = '' ;
const subscriptionKey = '';
const serviceEndpoint = 'https://westus.api.cognitive.microsoft.com';

const model = new LuisRecognizer({
  appId: appId,
  subscriptionKey: subscriptionKey,
  serviceEndpoint: serviceEndpoint
});

const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MicrosoftAppId, 
    appPassword: process.env.MicrosoftAppPassword 
});

const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

const bot = new Bot(conversationState,adapter,model);
server.post('/api/messages',bot.Process.bind(bot));

