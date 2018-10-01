const {BotFrameworkAdapter,ActivityTypes,MemoryStorage,ConversationState} = require('botbuilder');
const BotGreeting = require('botbuilder-greeting');

let server = require('restify').createServer();

const adapter = new BotFrameworkAdapter();
adapter.use(new BotGreeting(context => {
  return `Hi I'm your friendly bot`;
}));

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
  });
});