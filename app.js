const { BotFrameworkAdapter, MemoryStorage, ConversationState, CardFactory } = require('botbuilder');
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
        switch(context.activity.text){
          case 'show sessions':
            return context.sendActivity({ attachments: [createAdaptiveCard()] });
          case 'tell joke':
            var joke = await getJoke();
            return context.sendActivity(joke);
          default:
            return context.sendActivity(`I didn't understand ${context.activity.text}. Can you rephrase please?`);
        }        
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

function createAdaptiveCard() {
  return CardFactory.adaptiveCard({
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "version": "1.0",
      "type": "AdaptiveCard",
      "speak": "Your flight is confirmed for you and 3 other passengers from San Francisco to Amsterdam on Friday, October 10 8:30 AM",
      "body": [
          {
              "type": "TextBlock",
              "text": "Speakers",
              "weight": "bolder",
              "isSubtle": false
          },
          {
              "type": "TextBlock",
              "text": "Hattan Shobokshi",
              "separator": true
          },
          {
              "type": "TextBlock",
              "text": "Daniel Egan",
              "spacing": "none"
          },
          {
              "type": "TextBlock",
              "text": "Top Sessions",
              "weight": "bolder",
              "spacing": "medium",
          },
          {
              "type": "TextBlock",
              "text": "Fri, October 10 8:30 AM",
          },
          {
              "type": "ColumnSet",
              "separator": true,
              "columns": [
                  {
                      "type": "Column",
                      "width": 1,
                      "items": [
                          {
                              "type": "TextBlock",
                              "size": "extraLarge",
                              "color": "accent",
                              "text": "Introduction to Bot Framework",
                              "spacing": "none"
                          },
                          {
                              "type": "TextBlock",
                              "text": "Hattan Shobokshi",
                              "isSubtle": true,
                              "spacing": "none"                                
                          }

                      ]
                  }
           
              ]
          },
          {
              "type": "TextBlock",
              "text": "Fri, October 10 9:30 AM",
              "spacing": "medium"
          },
          {
              "type": "ColumnSet",
              "separator": true,
              "columns": [
                  {
                      "type": "Column",
                      "width": 1,
                      "items": [
                          {
                              "type": "TextBlock",
                              "size": "extraLarge",
                              "color": "accent",
                              "text": "Advanced Bot Framework",
                              "spacing": "none"
                          },
                          {
                              "type": "TextBlock",
                              "text": "Daniel Egan",
                              "isSubtle": true,
                              "spacing": "none"                                
                          }

                      ]
                  }
           
              ]
          },
          {
              "type": "ColumnSet",
              "spacing": "medium",
              "columns": [
                  {
                      "type": "Column",
                      "width": "1",
                      "items": [
                          {
                              "type": "TextInput",
                              "text": "",
                              "size": "medium",
                              "isSubtle": true
                          }
                      ]
                  },
                  {
                      "type": "Column",
                      "width": 1,
                      "items": [
                          {
                              "type": "TextBlock",
                              "horizontalAlignment": "right",
                              "text": "",
                              "size": "medium",
                              "weight": "bolder"
                          }
                      ]
                  }
              ]
          }
      ],
      'actions': [
          // Hotels Search form
          {
              'type': 'Action.ShowCard',
              'title': 'Hotels',
              'speak': '<s>Hotels</s>',
              'card': {
                  'type': 'AdaptiveCard',
                  'body': [
                      {
                          'type': 'TextBlock',
                          'text': 'Book your hotel for SoCal Code Camp!',
                          'speak': '<s>Welcome to the Hotels finder!</s>',
                          'weight': 'bolder',
                          'size': 'large'
                      },
                      {
                          'type': 'TextBlock',
                          'text': 'Please enter your destination:'
                      },
                      {
                          'type': 'Input.Text',
                          'id': 'destination',
                          'speak': '<s>Please enter your destination</s>',
                          'placeholder': 'Los Angeles, CA',
                          'style': 'text'
                      },
                      {
                          'type': 'TextBlock',
                          'text': 'When do you want to check in?'
                      },
                      {
                          'type': 'Input.Date',
                          'id': 'checkin',
                          'speak': '<s>When do you want to check in?</s>'
                      },
                      {
                          'type': 'TextBlock',
                          'text': 'How many nights do you want to stay?'
                      },
                      {
                          'type': 'Input.Number',
                          'id': 'nights',
                          'min': 1,
                          'max': 60,
                          'speak': '<s>How many nights do you want to stay?</s>'
                      }
                  ],
                  'actions': [
                      {
                          'type': 'Action.Submit',
                          'title': 'Search',
                          'speak': '<s>Search</s>',
                          'data': {
                              'type': 'hotelSearch'
                          }
                      }
                  ]
              }
          },
          {
              'type': 'Action.ShowCard',
              'title': 'Flights',
              'speak': '<s>Flights</s>',
              'card': {
                  'type': 'AdaptiveCard',
                  'body': [
                      {
                          'type': 'TextBlock',
                          'text': 'Flights is not implemented =(',
                          'speak': '<s>Flights is not implemented</s>',
                          'weight': 'bolder'
                      }
                  ]
              }
          },
          {
              'type': 'Action.ShowCard',
              'title': 'See All Sessions',
              'speak': '<s>All Sessions</s>',
              'card': {
                  'type': 'AdaptiveCard',
                  'body': [
                      {
                          'type': 'TextBlock',
                          'text': 'Todo',
                          'speak': '..soon..',
                          'weight': 'bolder'
                      }
                  ]
              }
          }            
      ]
  });
}

