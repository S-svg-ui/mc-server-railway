const mineflayer = require('mineflayer')

function startBot() {

  const bot = mineflayer.createBot({
    host: 'mumumelelo.falix.gg',
    port: 25565,
    username: 'AFK_24_7',
    version: "1.21.1"
    auth: 'offline',
  })

  bot.on('spawn', () => {
    console.log("✅ Joined server")

    setInterval(() => {
      bot.swingArm()
    }, 45000)
  })

  bot.on('resourcePack', () => {
    console.log("📦 Accepting pack")
    bot.acceptResourcePack()
  })

  bot.on('end', () => {
    console.log("❌ Reconnecting in 10s")
    setTimeout(startBot, 10000)
  })

  bot.on('kicked', console.log)
  bot.on('error', console.log)
}

startBot()
