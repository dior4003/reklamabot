const { Telegraf } = require("telegraf");
const express = require("express");
const fs = require("fs");
const app = express();
const { Router, Markup } = Telegraf;
let _id = [];
var interval = 30;
var islogin = false;
var newpost = false;
const { LocalStorage } = require("node-localstorage");
localStorage = new LocalStorage("./scratch");

app.get("/", (req, res) => {
  console.log("get");
});

var sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "db.sql";

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.log(err.message);
    throw err;
  }
  console.log("db connect");
});
db.all("SELECT * FROM users", (err, row) => {
  if (!err) {
    // console.log(row);
  } else {
    console.log(err);
  }
});
localStorage.setItem("stop", "true");
localStorage.setItem("interval", 30);
//create table
//    const  crSQL=`CREATE TABLE users (
//              id INTEGER,
//              first_name text,
//              last_name text,
//              username text )`;

//     db.run(crSQL ,(err)=> {
//     if (err){console.log(err)}
//     console.log("create")});

async function sendAll(ctx) {
  db.all("SELECT * FROM users", (err, row) => {
    console.log(row);
    if (!err) {
      setInterval(() => {
        row.forEach(async (e) => {
          console.log(e.id);
          if (localStorage.getItem("stop") === "true") {
           await ctx
              .forwardMessage(
                e.id,
                -1001823110718,
                ctx.chat.id,
                false,
                true,
                ctx.message.message_id
              )
              .then(function () {
                console.log("mesage forwaded");
              });
          }
        });
      }, +localStorage.getItem("interval") * 1000 * 60);
    }
  });
}
async function createChat(ctx) {
  db.get("SELECT * FROM users WHERE id = ?", [ctx.chat.id], (err, rows) => {
    if (!rows) {
      var create_user = `INSERT INTO users(id,first_name,last_name,username) VALUES (?,?,?,?)`;

      db.run(
        create_user,
        [
          ctx.chat.id,
          ctx.chat.first_name || ctx.chat.title,
          ctx.chat.last_name || ctx.chat.type,
          ctx.chat.username,
        ],
        (err, row) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
}
const bot = new Telegraf("5637541587:AAGvrMwdR2NIr40m5V4A34pxzqEnxfNoRmg");

bot.start(async (ctx) => {
  createChat(ctx);
  ctx.deleteMessage();
  await ctx.reply("<b>Salom xush kelibsiz</b>", {
    parse_mode: "HTML",
  });
  console.log(ctx.from);
  bot.telegram.sendMessage(ctx.chat.id, "Xo'sh xizmat", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Reklama berish",
            callback_data: "log1",
          },
          { text: "Admin bilan bog'lanish", callback_data: "PCdF" },
        ],
        [
          {
            text: "/login",
            callback_data: "Login",
          },
          { text: "Hamkorlarimiz", callback_data: "PCdF" },
        ],
      ],
    },
  });
});
bot.command("/login", async (ctx) => {
  ctx.deleteMessage();
  console.log(ctx.from);
  ctx.telegram.sendMessage(ctx.chat.id, "Parolni kiriting", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "1",
            callback_data: "log1",
          },
          { text: "2", callback_data: "log1" },
          { text: "2", callback_data: "log1" },
        ],
        [
          {
            text: "4",
            callback_data: "log1",
          },
          { text: "5", callback_data: "log1" },
          { text: "6", callback_data: "log1" },
        ],
        [
          {
            text: "7",
            callback_data: "log1",
          },
          { text: "8", callback_data: "log1" },
          { text: "9", callback_data: "log1" },
        ],
        [
          {
            text: "<-",
            callback_data: "back",
          },
          { text: "0", callback_data: "log1" },
        ],
      ],
    },
  });
});
bot.action("logout", async (ctx) => {
  ctx.deleteMessage();
  await ctx.reply("<b>Admin panelidan muofaqiyatli chiqdingiz</b>", {
    parse_mode: "HTML",
  });

  islogin = false;
});
bot.action("interval", async (ctx) => {
  ctx.deleteMessage();
  ctx.telegram.sendMessage(ctx.chat.id, "Postni jo'natish oraligini tanlang", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "30 min", callback_data: "30" },
          { text: "1 soat", callback_data: "1" },
        ],
        [
          { text: "6 soat", callback_data: "2" },
          { text: "12 soat", callback_data: "3" },
        ],
      ],
    },
  });

  islogin = false;
});

bot.on("message", async (ctx) => {
  createChat(ctx);
  console.log(ctx.message.text);
  if (
    localStorage.getItem("islogin") === "true" &&
    localStorage.getItem("newpost") === "true"
  ) {
    sendAll(ctx);
    setTimeout(() => {
      localStorage.setItem("newpost", "false");
    }, 4000);
  } else {
    if (ctx.message.text === "Reklama berish") {
      await ctx.reply(
        "<b>Kechirasiz hozirda ommaviy reklama berish imkoniyati mavjud emas </b>",
        {
          parse_mode: "HTML",
        }
      );
    }
    if (ctx.message.text === "Admin bilan bog'lanish") {
      await ctx.reply("<b>Albatta siz bilan adminlarimiz bog'lanishdi</b>", {
        parse_mode: "HTML",
      });
    }
    if (ctx.message.text === "Hamkorlarimiz") {
      await ctx.reply(
        "<b>Hozircha hamkorlarimiz yoq hamkorlik qilish uchun admin bilan bog'laning</b>",
        {
          parse_mode: "HTML",
        }
      );
    }
  }
  //   console.log(ctx.chat);
});

bot.action("PCdF", (ctx) => {
  ctx.deleteMessage();
  ctx.telegram.sendMessage(
    ctx.chat.id,
    "Share with us the problems about Parco Campo di Fiori!",
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "Pictures", callback_data: "PIC-PCdF" },
            { text: "Location", callback_data: "POS-PCdF" },
          ],
          [
            { text: "write to us", callback_data: "TEXT-PCdF" },
            { text: "Go back Home", callback_data: "go-back" },
          ],
        ],
      },
    }
  );
});
bot.action("30", (ctx) => {
  ctx.deleteMessage();
  localStorage.setItem("interval", 30);
  ctx.reply("<b>Interval 30 daqiqaga o'zgartirildi</b>", {
    parse_mode: "HTML",
  });
});
bot.action("1", (ctx) => {
  ctx.deleteMessage();
  localStorage.setItem("interval", 60);
  ctx.reply("<b>Interval 60 daqiqaga o'zgartirildi</b>", {
    parse_mode: "HTML",
  });
});
bot.action("2", (ctx) => {
  ctx.deleteMessage();
  localStorage.setItem("interval", 360);
  ctx.reply("<b>Interval 6 soatga o'zgartirildi</b>", {
    parse_mode: "HTML",
  });
});
bot.action("3", (ctx) => {
  ctx.deleteMessage();
  localStorage.setItem("interval", 720);
  ctx.reply("<b>Interval 12 soatga o'zgartirildi</b>", {
    parse_mode: "HTML",
  });
});
bot.action("log1", async (ctx) => {
  ctx.deleteMessage();
  //   console.log(ctx.from);
  bot.telegram.sendMessage(ctx.chat.id, "Parolni kiriting", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "1",
            callback_data: "log2",
          },
          { text: "2", callback_data: "log1" },
          { text: "2", callback_data: "log1" },
        ],
        [
          {
            text: "4",
            callback_data: "log1",
          },
          { text: "5", callback_data: "log1" },
          { text: "6", callback_data: "log1" },
        ],
        [
          {
            text: "7",
            callback_data: "log1",
          },
          { text: "8", callback_data: "log1" },
          { text: "9", callback_data: "log1" },
        ],
        [
          {
            text: "<-",
            callback_data: "log1",
          },
          { text: "0", callback_data: "log1" },
          { text: "->", callback_data: "log1" },
        ],
      ],
    },
  });
});
bot.action("log2", async (ctx) => {
  ctx.deleteMessage();
  //   console.log(ctx.from);
  bot.telegram.sendMessage(ctx.chat.id, "Parolni kiriting", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "1",
            callback_data: "log1",
          },
          { text: "2", callback_data: "log3" },
          { text: "2", callback_data: "log1" },
        ],
        [
          {
            text: "4",
            callback_data: "log1",
          },
          { text: "5", callback_data: "log1" },
          { text: "6", callback_data: "log1" },
        ],
        [
          {
            text: "7",
            callback_data: "log1",
          },
          { text: "8", callback_data: "log1" },
          { text: "9", callback_data: "log1" },
        ],
        [
          {
            text: "<-",
            callback_data: "log1",
          },
          { text: "0", callback_data: "log1" },
          { text: "->", callback_data: "log1" },
        ],
      ],
    },
  });
});
bot.action("log3", async (ctx) => {
  ctx.deleteMessage();
  //   console.log(ctx.from);
  bot.telegram.sendMessage(ctx.chat.id, "Parolni kiriting", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "1",
            callback_data: "log1",
          },
          { text: "2", callback_data: "log3" },
          { text: "2", callback_data: "log1" },
        ],
        [
          {
            text: "4",
            callback_data: "log4",
          },
          { text: "5", callback_data: "log1" },
          { text: "6", callback_data: "log1" },
        ],
        [
          {
            text: "7",
            callback_data: "log1",
          },
          { text: "8", callback_data: "log1" },
          { text: "9", callback_data: "log1" },
        ],
        [
          {
            text: "<-",
            callback_data: "log1",
          },
          { text: "0", callback_data: "log1" },
          { text: "->", callback_data: "log1" },
        ],
      ],
    },
  });
});
bot.action("log4", async (ctx) => {
  localStorage.setItem("islogin", "true");
  ctx.deleteMessage();
  //   console.log(ctx.from);
  await ctx.reply("<b>Teshkiruv muvofaqiyatli tugadi</b>", {
    parse_mode: "HTML",
  });
  bot.telegram.sendMessage(ctx.chat.id, "Bosh menu", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Postni yangilash",
            callback_data: "NewPost",
          },
          { text: "Post jo'natish oralig'i", callback_data: "interval" },
        ],
        [
          {
            text: "Podpischiklar",
            callback_data: "allUser",
          },
        ],
        [
          {
            text: "Chiqish",
            callback_data: "logout",
          },
          { text: "Orqaga", callback_data: "postStop" },
        ],
      ],
    },
  });
});
bot.action("allUser", (ctx) => {
  ctx.deleteMessage();
  db.all("SELECT * FROM users", (err, row) => {
    let a = "";
    row.forEach((r, i) => {
      a += `<b>${i + 1})</b> @${r.username ? r.username : r.first_name}\n`;
    });
    if (!err) {
      ctx.reply(
        `<b>Foydalanuvchilar:
          ${a}
          </b>
          `,
        {
          parse_mode: "HTML",
        }
      );
    } else {
      //   console.log(err);
    }
  });
});
bot.action("NewPost", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("<b>Postni jo'nating</b>", {
    parse_mode: "HTML",
  });
  localStorage.setItem("newpost", "true");
  console.log(ctx);
});
bot.action("postStop", (ctx) => {
  ctx.deleteMessage();
  ctx.reply("<b>Postni joylash to'xtatildi</b>", {
    parse_mode: "HTML",
  });
  localStorage.setItem("newpost", "false");
  console.log(ctx);
});
bot.on("new_chat_members", (ctx) => createChat(ctx.chat));

bot.launch();

app.listen(5000, () => {
  console.log("server started");
});
