const http = require('http')
const mineflayer = require('mineflayer')

let verifying = false

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
    console.log("Joined server")
    humanBehaviourLoop(bot)
    randomChatLoop(bot)
  })

  bot.on('messagestr', async (msg) => {

    const m = msg.toLowerCase()
    console.log("CHAT:", msg)

    if (
      m.includes("still playing") ||
      m.includes("paused") ||
      m.includes("confirm")
    ) {
      setTimeout(() => bot.chat("/confirm"), rand(4000,12000))
    }

    if (msg.includes("falixnodes.net/verify") && !verifying) {

      verifying = true
      console.log("Verification started")

      const puppeteer = require("puppeteer")

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

          console.log("Verify clicked")

          await new Promise(r => setTimeout(r, 4000))

        } catch (e) {
          console.log("Verify error:", e.message)
        }

        if (browser) await browser.close()

        verifying = false

      }, rand(12000,20000))
    }

  })

  bot.on('resourcePack', () => bot.acceptResourcePack())

  bot.on('end', () => {
    console.log("Disconnected — reconnecting")
    setTimeout(startBotWrapper, rand(60000,120000))
  })

  bot.on('kicked', r => console.log("Kicked:", r))
  bot.on('error', e => console.log("Error:", e))
}

function humanBehaviourLoop(bot) {

  setInterval(() => {

    const actionTime = rand(5000, 30000)
    const actions = ['forward','back','left','right']
    const action = actions[rand(0, actions.length)]

    bot.setControlState(action, true)

    setTimeout(() => {
      bot.setControlState(action, false)
    }, actionTime)

  }, rand(20000,50000))

}

function randomChatLoop(bot) {

  const msgs = ["lol","lag ho raha","kaun hai","bruh","wtf"]

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
    setTimeout(startBotWrapper, 15000)
  }
}

startBotWrapper()
