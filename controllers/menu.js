const Telegram = require('telegram-node-bot');
const scrape = require('../scrape_modules/scrape');
const spreadsheet = require('../scrape_modules/spreadsheet');
const fs = require('fs');


class MenuController extends Telegram.TelegramBaseController{

  startHandler($){
    let introMessage = "Enter usernames : \nExample of input:\nalexandramitroshina\nreira_reira\nalexis_mode\npp.tysya";
    let usernameForm = {
        name: {
    	    q: introMessage,
    	    error: 'Sorry, wrong input',
    	    validator: (message, callback) => {
    		    if(message.text) {
    			    callback(true, message.text);
    			    return;
    		    }
    		    callback(false)
    	    }
        }
    };

    $.runMenu({
      message: 'Select action from panel below',
      layout: 2,
      'Track users': () => {
        $.runForm(usernameForm, (result) => {
           this.addHandler($, result.name);
           let users = result.name.split('\n');
           for(let user of users){
             let intervalID = setInterval(async ()=>{
               let res = await scrape.isAvaible(user);
               if(res == false){
                 $.sendMessage('User '+user+" became unavailable");
                 clearInterval(intervalID);
               }
             }, 3000);
           }
           this.startHandler($);
        })
      },
      'Get Users': () => {
        this.getHandler($);
        this.startHandler($);
      },
      'Analyze users': async () => {
        $.runForm(usernameForm, async (result) => {
          $.sendMessage("Wait till I'm gathering data");
          let users = result.name.split('\n');
          let dataSet = [];
          let anyAvailable = false;

          for(let user of users){
            let checkResult = await scrape.isValidUser(user);
            if(checkResult == true){
              anyAvailable = true;
              let data = await scrape.getData(user);
              data.username = user;
              dataSet.push(data);
            } else {
              $.sendMessage('User '+user+" is not available");
            }
          }
          if(anyAvailable){
            let fileName = await spreadsheet.generateReport(dataSet);
            $.sendDocument(Telegram.InputFile.byFilePath(fileName));  
          }
          this.startHandler($);
        })
      },
      'Help': () => {
        let helpString = "Here's what this guy is capable of : \n";
        helpString += "1. Fetching data about instagram users\n";
        helpString += "To do that, click 'Analyze users' and enter a list of usernames in the following format:\n";
        helpString += "username1\nusername2\nusername3\n....\n";
        helpString += "2. Track availability of accounts\n";
        helpString += "Just enter a list of users to track in the format specified above";
        $.sendMessage(helpString);
        this.startHandler($);
      }
    })
  }


  addHandler($, user){
    let users = user.split('\n');

    $.getUserSession('usernames').then(usernames => {
      if(!Array.isArray(usernames)) return $.setUserSession('usernames', users)
      else $.setUserSession('usernames', usernames.concat(users));
    })
  }

  getHandler($){
    $.getUserSession('usernames').then(usernames => {
      if(usernames.length == undefined) return $.sendMessage('There are no usernames set');
      $.sendMessage(this._serializeList(usernames), {parse_mode: 'Markdown'});
    })
  }

  get routes(){
    return{
      'startCommand': 'startHandler',
      'addCommand': 'addHandler',
      'getCommand': 'getHandler',
    };
  }

  _serializeList(usersLise){
    let serialized = "List of usernames: ";
    usersLise.forEach((username, index) => {
       serialized += "\n"+(index+1)+". " + username;
    });
    return serialized;
  }

  _getDatasetStrting(dataSet){
    let dsString = "Results : \n";
    for(let user of dataSet){
      dsString += "Username : " + user.username;
      dsString += "\nBio :\n" + user.bio;
      dsString += "\nAverage number of likes : " + user.likes;
    }
    return dsString;
  }
}

module.exports = MenuController;
