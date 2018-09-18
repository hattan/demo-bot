const request = require('request');

class JokeService{
  constructor() {
    this.options =  {
      url: 'https://icanhazdadjoke.com',
      headers: {
        'Accept': 'text/plain'
      }
    }; 
  }     
  
  getJoke(){
    const instance = this;
    return new Promise(function(resolve,reject){    
      request(instance.options, function (error, response, body) {
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
}

module.exports = new JokeService();