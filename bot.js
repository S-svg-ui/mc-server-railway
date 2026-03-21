const http = require('http')
const mineflayer = require('mineflayer')
const puppeteer = require("puppeteer")

// ⭐ KEEP ALIVE SERVER (for UptimeRobot)
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

// ⭐⭐⭐ SMART VERIFY SYSTEM ⭐⭐⭐
bot.on('messagestr', async (msg) => {

```
const m = msg.toLowerCase()
console.log("CHAT:", msg)

// normal confirm verification
if (
  m.includes("still playing") ||
  m.includes("paused") ||
  m.includes("confirm") ||
  m.includes("click")
) {
  console.log("⚡ Falix confirm detected")
  setTimeout(() => bot.chat("/confirm"), rand(4000,12000))
}

// ⭐ WEBSITE BUTTON VERIFY
if (msg.includes("falixnodes.net/verify")) {

  console.log("🌐 Verification link detected")

  const linkMatch = msg.match(/https?:\/\/[^\s]+/)
  if (!linkMatch) return

  const link = linkMatch[0]

  const delay = rand(12000,30000)
  console.log("⏳ Opening browser in", delay/1000,"seconds")

  setTimeout(async () => {

    try {

      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu"
        ]
      })

      const page = await browser.newPage()

      await page.goto(link, { waitUntil: "networkidle2" })

      await page.evaluate(() => {
        const btn =
          document.querySelector("button") ||
          document.querySelector(".btn") ||
          document.querySelector("#verify") ||
          document.querySelector("[type='submit']")
        if (btn) btn.click()
      })

      console.log("✅ Verify button clicked")

      await new Promise(r => setTimeout(r, 6000))

      await browser.close()

      console.log("✅ Browser closed — verification done")

    } catch (err) {
      console.log("❌ Puppeteer verify failed:", err.message)
    }

  }, delay)
}
```

})

bot.on('resourcePack', () => bot.acceptResourcePack())

bot.on('end', () => {
console.log("❌ Disconnected — reconnecting")
setTimeout(startBotWrapper, 7000)
})

bot.on('kicked', r => console.log("⚠️ Kicked:", r))
bot.on('error', e => console.log("💥 Error:", e))
}

// ⭐ HUMAN MOVEMENT AI
function humanBehaviourLoop(bot) {

setInterval(() => {

```
const actionTime = rand(5000, 40000)
const idleTime = rand(8000, 60000)

const actions = ['forward','back','left','right']
const action = actions[rand(0, actions.length)]

const yaw = Math.random() * Math.PI * 2
const pitch = (Math.random() - 0.5) * 0.6
bot.look(yaw, pitch, true)

if (Math.random() > 0.7) bot.setControlState('sneak', true)
if (Math.random() > 0.75) bot.setControlState('sprint', true)

bot.setControlState(action, true)

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

  setTimeout(() => {}, idleTime)

}, actionTime)
```

}, rand(15000,45000))

}

// ⭐ RANDOM CHAT AI
function randomChatLoop(bot) {

const msgs = [
"lol",
"lag ho raha",
"kaun hai yaha",
"wtf",
"bruh",
"noob server"
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

function startBotWrapper() {
try {
startBot()
} catch {
console.log("💀 Crash — restarting")
setTimeout(startBotWrapper, 10000)
}
}

startBotWrapper()
