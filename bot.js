```js
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

  bot.once('spawn', () => {
    console.log("✅ Joined server")

    // ⭐ REAL Anti AFK movement system
    setInterval(() => {

      const yaw = Math.random() * Math.PI * 2
      const pitch = (Math.random() - 0.5) * 0.4

      bot.look(yaw, pitch, true)

      bot.setControlState('forward', true)

      setTimeout(() => {

        bot.setControlState('jump', true)

        setTimeout(() => {
          bot.setControlState('jump', false)
          bot.setControlState('forward', false)
        }, 400)

      }, 1500)

      bot.swingArm()

    }, 8000)

  })

  // ⭐ Resource pack accept
  bot.on('resourcePack', () => {
    console.log("📦 Accepting resource pack")
    bot.acceptResourcePack()
  })

  // ⭐ Strong reconnect logic
  bot.on('end', () => {
    console.log("❌ Disconnected — reconnecting in 5s")
    setTimeout(startBotWrapper, 5000)
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
    console.log("💀 Crash detected — restarting in 10s")
    setTimeout(startBotWrapper, 10000)
  }
}

startBotWrapper()
```
