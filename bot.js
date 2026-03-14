const http = require('http')
const mineflayer = require('mineflayer')

// ⭐ Railway uptime web server
http.createServer((req, res) => {
  res.write("bot alive")
  res.end()
}).listen(process.env.PORT || 3000)

function startBot() {

  const bot = mineflayer.createBot({
    host: 'mumumelelelo.falix.gg',
    port: 25565,
    username: 'AFK_24_7',
    version: '1.21.1',
    auth: 'offline'
  })

  bot.on('spawn', () => {
    console.log("✅ Joined server")

    // ⭐ Anti AFK movement
    setInterval(() => {
      bot.swingArm()
    }, 45000)
  })

  // ⭐ Resource pack accept
  bot.on('resourcePack', () => {
    console.log("📦 Accepting resource pack")
    bot.acceptResourcePack()
  })

  // ⭐ Auto reconnect
  bot.on('end', () => {
    console.log("❌ Disconnected — reconnecting in 10s")
    setTimeout(startBot, 10000)
  })

  bot.on('kicked', (reason) => {
    console.log("⚠️ Kicked:", reason)
  })

  bot.on('error', (err) => {
    console.log("💥 Error:", err)
  })
}

startBot()
