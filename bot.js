const http = require('http')
const mineflayer = require('mineflayer')

// ⭐ Railway uptime web server (VERY IMPORTANT)
http.createServer((req, res) => {
  res.write("bot alive")
  res.end()
}).listen(process.env.PORT || 3000)

function startBot() {

  const bot = mineflayer.createBot({
    host: 'mumumelelo.falix.gg',
    port: 26737,
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

  // ⭐ When bot disconnects
  bot.on('end', () => {
    console.log("❌ Disconnected — reconnecting in 10s")
    setTimeout(startBotWrapper, 10000)
  })

  bot.on('kicked', (reason) => {
    console.log("⚠️ Kicked:", reason)
  })

  bot.on('error', (err) => {
    console.log("💥 Error:", err)
  })
}

// ⭐ FULL watchdog restart system (never die)
function startBotWrapper() {
  try {
    startBot()
  } catch (e) {
    console.log("💀 Crash detected — restarting in 15s")
    setTimeout(startBotWrapper, 15000)
  }
}

startBotWrapper()
