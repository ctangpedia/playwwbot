const Discord = require("discord.js");
require('dotenv').config();
const client = new Discord.Client();
var prefix = process.env.PREFIX;
var gvc;

/**
 * Generate an random integer in given range
 * @author MDN contributors
 * @param {int} min lower bound (inclusive)
 * @param {int} max upper bound (inclusive)
 * @returns {int} random integer in range (inclusive)
 */
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const play = (con,path) => {
  let dispatcher = con.playFile(`./voices/${path}.mp3`);
  dispatcher.on("end",end=>{gvc.leave()});
}

const wc = (number) => {
  gvc.join().then(con=>{
    let dispatcher = con.playFile('./voices/i-am-witch-my-silver-water-is.mp3');
    dispatcher.on("end",()=>{
      dispatcher=null;
      dispatcher=con.playFile(`./voices/numbers/${number}.mp3`);
      dispatcher.on("end",()=>{
        dispatcher=null;
        dispatcher=con.playFile('./voices/number.mp3');
        dispatcher.on("end",()=>{gvc.leave()})
      })
    })
  }).catch(e => console.error(e));
}

const se = (number, goodpeople, mode) => {
  switch (mode){
    case 1:
    gvc.join().then(con=>{
      let dispatcher = con.playFile('./voices/seer/i-am-seer-i-checked.mp3');
      dispatcher.on("end",()=>{
        dispatcher=null;
        dispatcher=con.playFile(`./voices/numbers/${number}.mp3`);
        dispatcher.on("end",()=>{
          dispatcher=null;
          dispatcher=con.playFile('./voices/seer/number-he-is.mp3');
          dispatcher.on("end",()=>{
            dispatcher=null;
            if(goodpeople=="bad"){dispatcher=con.playFile('./voices/seer/my-check-kill.mp3');}
            else{dispatcher=con.playFile('./voices/seer/checkgoodpeople.mp3');}
            dispatcher.on("end",()=>{gvc.leave()});
          });
        });
      });
    }).catch(e => console.error(e));
    break;
    case 2:
    gvc.join().then(con=>{
      let dispatcher = con.playFile('./voices/seer/only-real-seer.mp3');
      dispatcher.on("end",()=>{
        dispatcher=null;
        dispatcher=con.playFile(`./voices/numbers/${number}.mp3`);
        dispatcher.on("end",()=>{
          dispatcher=null;
          dispatcher=con.playFile('./voices/number.mp3');
          dispatcher.on("end",()=>{
            dispatcher=null;
            dispatcher=con.playFile('./voices/is.mp3');
            dispatcher.on("end",()=>{
              dispatcher=null;
              if(goodpeople=="bad"){dispatcher=con.playFile('./voices/seer/my-check-kill.mp3');}
              else{dispatcher=con.playFile('./voices/seer/checkgoodpeople.mp3');}
              dispatcher.on("end",()=>{gvc.leave()});
            });
          });
        });
      });
    }).catch(e => console.error(e));
    break;
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content.substring(0,1) == prefix) {
    var args = msg.content.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);

    switch (cmd) {
      case 'help':
        msg.channel.send("Hello. I am a bot, nice to meet you. I can play werewolf and make decisions on my own (in the future).");
      break;
      case 'speak':
      let vc = msg.member.voiceChannel;
      if(!vc){return msg.reply("get into a vc first");}
      else{
        gvc=vc;
        switch (args[0]) {
          case 'vl':
            vc.join().then(con=>{
              play(con,"goodpeople",false);
            }).catch(e => console.error(e));
          break;
          case 'se':
            se(args[1],args[2],random(1,2));
          break;
          case 'wc':
            wc(args[1]);
          break;
        }
      }
      break;
    }
  }
});

client.login();
