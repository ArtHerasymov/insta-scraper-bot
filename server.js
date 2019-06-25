const Telegram = require('telegram-node-bot'),
tg = new Telegram.Telegram('855974406:AAEKWcFb10I138O1sLniPrspxS1qKlZVPCo', {
  workers: 1
});
const MenuController = require('./controllers/menu');

const menuController = new MenuController();

tg.router.when(new Telegram.TextCommand('/start', 'startCommand'), menuController)
.otherwise(menuController);
