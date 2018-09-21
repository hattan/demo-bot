const {BotFrameworkAdapter, MemoryStorage, ConversationState} = require("botbuilder");
const restify = require('restify');
const request = require('request');
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

      switch(context.activity.text){
        case 'show sessions':
          return context.sendActivity(`https://www.socalcodecamp.com/tracks`);
        case 'tell joke':
          let joke = await getJoke();
          return context.sendActivity(joke);
        default:
          return context.sendActivity(`I didn't understand "${context.activity.text}", can you rephrase?`);        
      }

    } else if (isUserJoinEvent(context)){
      return handleNewUser(context);
    }
  });
});

function getJoke(){
  return new Promise(function(resolve,reject){
    const options = {
        url: 'https://icanhazdadjoke.com',
        headers: {
          'Accept': 'text/plain'
        }
      };         
    request(options, function (error, response, body) {
        if(error){
            reject(error);
        }
        if(response.statusCode == 200){
            resolve(body); 
        }else{
        reject(new Error(`Invalid http response code ${response.statusCode}`));
        }
    });
  });
}


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


