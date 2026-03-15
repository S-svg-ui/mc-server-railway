const http = require('http')
const mineflayer = require('mineflayer')

// ⭐ Railway uptime web server
http.createServer((req, res) => {
  res.write("alive")
  res.end()
}).listen(process.env.PORT || 3000)

function startBot() {

  const bot = mineflayer.createBot({
    host: 'mumumelelo.falix.gg',
    port: parseInt(process.env.MC_PORT) || 26737,
    username: 'AFK_24_7',
    version: '1.21.1',
    auth: 'offline'
  })

  bot.once('spawn', () => {
    console.log("✅ Joined server")

    humanBehaviourLoop(bot)
    randomChatLoop(bot)

  })

  // ⭐ Falix auto confirm
  bot.on('messagestr', (msg) => {
    const m = msg.toLowerCase()
    console.log("CHAT:", msg)

    if (
      m.includes("still playing") ||
      m.includes("paused") ||
      m.includes("confirm") ||
      m.includes("click")
    ) {
      console.log("⚡ Falix check detected")
      bot.chat("/confirm")
    }
  })

  bot.on('resourcePack', () => bot.acceptResourcePack())

  bot.on('end', () => {
    console.log("❌ Disconnected — reconnecting")
    setTimeout(startBotWrapper, 5000)
  })

  bot.on('kicked', r => console.log("⚠️ Kicked:", r))
  bot.on('error', e => console.log("💥 Error:", e))
}

// ⭐ HUMAN MOVEMENT AI
function humanBehaviourLoop(bot) {

  setInterval(() => {

    const actionTime = rand(5000, 40000) // walk duration
    const idleTime = rand(8000, 60000)   // idle duration

    const actions = ['forward','back','left','right']
    const action = actions[rand(0, actions.length)]

    // head random
    const yaw = Math.random() * Math.PI * 2
    const pitch = (Math.random() - 0.5) * 0.6
    bot.look(yaw, pitch, true)

    // random sneak hold
    if (Math.random() > 0.7) bot.setControlState('sneak', true)

    // random sprint burst
    if (Math.random() > 0.75) bot.setControlState('sprint', true)

    bot.setControlState(action, true)

    // occasional jump spam
    const jumpInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        bot.setControlState('jump', true)
        setTimeout(()=> bot.setControlState('jump', false), 300)
      }
      bot.swingArm()
    }, rand(2000,6000))

    setTimeout(() => {

      clearInterval(jumpInterval)

      bot.setControlState(action, false)
      bot.setControlState('sneak', false)
      bot.setControlState('sprint', false)

      // FULL idle phase (very human)
      setTimeout(() => {
        // do nothing
      }, idleTime)

    }, actionTime)

  }, rand(15000,45000))

}

// ⭐ RANDOM CHAT AI
function randomChatLoop(bot) {

  const msgs = [
    "lol",
    "brb",
    "lag?",
    "hmm",
    "anyone here",
    "ok",
    "nice",
    "wtf",
    "hahaha",
    "wait"
  ]

  setInterval(() => {
    if (Math.random() > 0.6) {
      const msg = msgs[rand(0, msgs.length)]
      bot.chat(msg)
    }
  }, rand(90000, 240000))

}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

// ⭐ WATCHDOG
function startBotWrapper() {
  try {
    startBot()
  } catch {
    console.log("💀 Crash — restarting")
    setTimeout(startBotWrapper, 10000)
  }
}

startBotWrapper()
