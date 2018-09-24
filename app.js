const { BotFrameworkAdapter, MemoryStorage, ConversationState } = require('botbuilder');
const BotGreeting = require('botbuilder-greeting');
const restify = require('restify');
const Bot = require('./bot');

let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MicrosoftAppId, 
    appPassword: process.env.MicrosoftAppPassword 
});

adapter.use(new BotGreeting(context => {
  return `Hello ! I'm your friendly demo bot.`;
}));


const conversationState = new ConversationState(new MemoryStorage());
adapter.use(conversationState);

const bot = new Bot(conversationState,adapter);
server.post('/api/messages',bot.Process.bind(bot));

