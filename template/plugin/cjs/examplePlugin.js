module.exports = {
  name: "Ping",
  triggers: ["ping"],
  code: async (ctx) => {
    ctx.reply("pong");
  },
};
