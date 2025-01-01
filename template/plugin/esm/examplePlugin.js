export default {
    name: "Ping",
    triggers: ["ping"],
    code: async (ctx) => {
        ctx.reply("pong")
    }
}