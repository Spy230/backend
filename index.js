const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const token = '';
const bot = new TelegramBot(token, {polling: true}) ;
const webAppurl = 'https://vvxc.netlify.app/'
const app = express();
app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId,"ниже кнопка,заполни форму", {
            reply_markup: {
                keyboard: [
                    [{text: 'заполнить форму' , web_app : {url: webAppurl + '/form'}}]
                ]
            }
        })
        await bot.sendMessage(chatId,"заходи на наш интернет-магазин по кнопке ниже", {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'сделать заказ' , web_app : {url: webAppurl}}]
                ]
            }
        })


    }
    if(msg?.web_app_data?.data) {
        try{
            const date = JSON.parse(msg?.web_app_data?.data)
            await  bot.sendMessage(chatId, 'спасибо за обратную связь')
            await  bot.sendMessage(chatId, 'ваша страна' + data?.country);
            await  bot.sendMessage(chatId, 'ваша улица'  + data?.street);
            setTimeout(async () => {
                await bot.sendMessage(chatId,'всю информацию вы получите в этом чате');
            }, 3000)
        } catch (e) {
            console.log(e);
        }

    }
});

app.post('/web-data',  async (req,res ) => {
    const {queryId ,products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId , {
            type: 'article',
            id:queryId,
            title: 'успешная покупка',
            input_message_content: {message_text: 'поздравляю с покупкой , вы приобрели товар на суммы ' + totalPrice}
        })
        return res.status(200).json({})

    } catch (e) {
        await bot.answerWebAppQuery(queryId , {
            type: 'article',
            id:queryId,
            title: 'не удалось приобрести товар',
            input_message_content: {message_text: 'не удалось приобрести товар'}

        })
        return res.status(500).json({})
    }

})
const PORT = 8080;

app.listen(PORT, () => console.log('server started on PORT' + PORT))
