const http = require('http')
const mineflayer = require('mineflayer')

let verifying = false

// ⭐ KEEP ALIVE SERVER (for Railway / UptimeRobot)
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

// ⭐⭐⭐ SMART VERIFY SYSTEM (LAZY PUPPETEER LOAD) ⭐⭐⭐
bot.on('messagestr', async (msg) => {

```
const m = msg.toLowerCase()
console.log("CHAT:", msg)

// normal confirm verification
if (
  m.includes("still playing") ||
  m.includes("paused") ||
  m.includes("confirm")
) {
  setTimeout(() => bot.chat("/confirm"), rand(4000,12000))
}

// ⭐ WEBSITE BUTTON VERIFY
if (msg.includes("falixnodes.net/verify") && !verifying) {

  verifying = true
  console.log("🌐 Verification started")

  const puppeteer = require("puppeteer") // ⭐ LAZY LOAD

  const linkMatch = msg.match(/https?:\/\/[^\s]+/)
  if (!linkMatch) return

  const link = linkMatch[0]

  setTimeout(async () => {

    let browser

    try {

      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--single-process",
          "--no-zygote"
        ]
      })

      const page = await browser.newPage()
      await page.goto(link, { waitUntil: "domcontentloaded" })

      await page.evaluate(() => {
        const btn =
          document.querySelector("button") ||
          document.querySelector("[type='submit']")
        if (btn) btn.click()
      })

      console.log("✅ Verify button clicked")

      await new Promise(r => setTimeout(r, 4000))

    } catch (e) {
      console.log("❌ Verify fail:", e.message)
    }

    if (browser) await browser.close()

    verifying = false

  }, rand(12000,20000))
}
```

})

bot.on('resourcePack', () => bot.acceptResourcePack())

bot.on('end', () => {
console.log("❌ Disconnected — cooling down")

```
const delay = rand(60000,120000)
console.log("⏳ Reconnecting in", delay/1000,"sec")

setTimeout(startBotWrapper, delay)
```

})

bot.on('kicked', r => console.log("⚠️ Kicked:", r))
bot.on('error', e => console.log("💥 Error:", e))
}

// ⭐ HUMAN MOVEMENT AI
function humanBehaviourLoop(bot) {

setInterval(() => {

```
const actionTime = rand(5000, 30000)

const actions = ['forward','back','left','right']
const action = actions[rand(0, actions.length)]

const yaw = Math.random() * Math.PI * 2
const pitch = (Math.random() - 0.5) * 0.6
bot.look(yaw, pitch, true)

if (Math.random() > 0.8) bot.setControlState('sneak', true)
if (Math.random() > 0.85) bot.setControlState('sprint', true)

bot.setControlState(action, true)

setTimeout(() => {
  bot.setControlState(action, false)
  bot.setControlState('sneak', false)
  bot.setControlState('sprint', false)
}, actionTime)
```

}, rand(20000,50000))

}

// ⭐ RANDOM CHAT AI (LOW SPAM)
function randomChatLoop(bot) {

const msgs = [
"lol",
"lag ho raha",
"kaun hai",
"bruh",
"wtf"
]

setInterval(() => {
if (Math.random() > 0.9) {
const msg = msgs[rand(0, msgs.length)]
bot.chat(msg)
}
}, rand(120000, 300000))

}

function rand(min, max) {
return Math.floor(Math.random() * (max - min)) + min
}

function startBotWrapper() {
try {
startBot()
} catch {
console.log("💀 Crash — restarting later")
setTimeout(startBotWrapper, 15000)
}
}

startBotWrapper()
