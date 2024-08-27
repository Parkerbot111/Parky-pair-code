const qrcode = require("qrcode-terminal")
const fs = require('fs')
const pino = require('pino')
const { default: makeWASocket, Browsers, delay, useMultiFileAuthState, BufferJSON, fetchLatestBaileysVersion, PHONENUMBER_MCC, DisconnectReason, makeInMemoryStore, jidNormalizedUser, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys")
const Pino = require("pino")
const NodeCache = require("node-cache")
const chalk = require("chalk")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")


let phoneNumber = "22898133388"

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))


  async function qr() {
//------------------------------------------------------
let { version, isLatest } = await fetchLatestBaileysVersion()
const {  state, saveCreds } =await useMultiFileAuthState(`./sessions`)
    const msgRetryCounterCache = new NodeCache() // for retry message, "waiting message"
    const XeonBotInc = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // popping up QR in terminal log
      browser: Browsers.windows('Firefox'), // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, // set false for offline
      generateHighQualityLinkPreview: true, // make high preview link
      getMessage: async (key) => {
         let jid = jidNormalizedUser(key.remoteJid)
         let msg = await store.loadMessage(jid, key.id)

         return msg?.message || ""
      },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
   })


    // login use pairing code
   // source code https://github.com/WhiskeySockets/Baileys/blob/master/Example/example.ts#L61
   if (pairingCode && !XeonBotInc.authState.creds.registered) {
      if (useMobile) throw new Error('Cannot use pairing code with mobile api')

      let phoneNumber
      if (!!phoneNumber) {
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Commencez par le code du pays de votre numéro WhatsApp, exemple : +22898133388")))
            process.exit(0)
         }
      } else {
         phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Veuillez saisir votre numéro WhatsApp 🩵\nPar exemple : +22898133388 : `)))
         phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

         // Ask again when entering the wrong number
         if (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
            console.log(chalk.bgBlack(chalk.redBright("Commencez par le code du pays de votre numéro WhatsApp, exemple : +22898133388")))

            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Veuillez saisir votre numéro WhatsApp 🩵\nPar exemple : +22898133388 :`)))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            rl.close()
         }
      }

      setTimeout(async () => {
         let code = await XeonBotInc.requestPairingCode(phoneNumber)
         code = code?.match(/.{1,4}/g)?.join("-") || code
         console.log(chalk.black(chalk.bgGreen(`Ton pairing code : `)), chalk.black(chalk.white(code)))
      }, 3000)
   }
//------------------------------------------------------
    XeonBotInc.ev.on("connection.update",async  (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            await delay(1000 * 10)
            await XeonBotInc.sendMessage(XeonBotInc.user.id, { text: `*PARKY-BUG-BOT*



　　　⢀⡤⠔⠒⠒⢌⡛⠒⢦⣄     
　　⡠⠚⠁　⣀⡠⠒⠚⡄⠑　⠈⠳⡄   
　⢀⡞⠁⠠⠦　　　⠸⠠ 　⢀⠤⠜⣆  
⢀⡎　　⠡⡀　⠐⠂　⠈　　⣁ ⣀⣸⡆ 
⢸ ⡤⡀　⡧　　　⠠⠤　⠨　　　⢧ 
 ⢧　⠈⢀⠆⣤⣤⣶⣶⣦⣤⠁⢀⠔⣢⣴⣶⢨⠇
　⠘⡆⡄　 ⣿⣿⣿⣿⣿⣿⡆　⣼⣿⣿⣿⡏ 
　　⢻ ⠇　⠙⢿⣿⣿⡿⢿⠁ ⠻⠿⠿⢿⡅ 
  ⢈⡷⢼⠈⢈⣀⠠　⠐⠊⢀⣾⡟⣦⠤⠼⠁ 
　　⠘⣆⠅⣽⠉⠘⡆⠆　⢀⠛⠓⡁⢻    
　　　⢺⠐⠙⢦⢀⡧⣈⣘⣈⣀⣢⣣⣾    
　　　⠈⠳⢌⠈⠛⢷⣓⡜⢤⠧⡗⣿⡇    
　　　　　⠳⣄  ⠉⠍⠉⡀⡞     
　　　　　　⠉⠑⠲⠤⠴⠚⠁` });
            let sessionXeon = fs.readFileSync('./sessions/creds.json');
            await delay(1000 * 2) 
             const xeonses = await  XeonBotInc.sendMessage(XeonBotInc.user.id, { document: sessionXeon, mimetype: `application/json`, fileName: `creds.json` })
               XeonBotInc.groupAcceptInvite("Kjm8rnDFcpb04gQNSTbW2d");
             await XeonBotInc.sendMessage(XeonBotInc.user.id, { text: `━━━━━━━━━━━━━━━━━━━
❶ || 𝐆𝐢𝐭 = 🌐 https://github.com/Jeanparker100/PARKY-BUG-BOT
━━━━━━━━━━━━━━━━━━━
❷ || 𝐆𝐫𝐨𝐮𝐩𝐞 = 🪀 https://chat.whatsapp.com/L8NDXnqqDZn2uEtzsgZ8ES
━━━━━━━━━━━━━━━━━━━
❸ || 𝐂𝐡𝐚𝐢𝐧𝐞 𝐖𝐡𝐚𝐭𝐬𝐀𝐩𝐩 = 🪀 https://whatsapp.com/channel/0029VagLiHaEVccM6o6Sqc45
━━━━━━━━━━━━━━━━━━━
➡️ 𝐒𝐮𝐢𝐯𝐞𝐳 𝐦a 𝐂𝐡𝐚𝐢𝐧𝐞 𝐝𝐞 𝐒𝐮𝐩𝐩𝐨𝐫𝐭

📞 𝐕𝐨𝐮𝐬 𝐯𝐨𝐮𝐥𝐞𝐳 𝐦𝐞 𝐩𝐚𝐫𝐥𝐞𝐫 ? 👉 https://Wa.me//+22898133388 👈
━━━━━━━━━━━━━━━━━━━

© 2024-2099 *Jean Parker*` }, {quoted: xeonses});
              await delay(1000 * 2) 
              process.exit(0)
        }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
        ) {
            qr()
        }
    })
    XeonBotInc.ev.on('creds.update', saveCreds)
    XeonBotInc.ev.on("messages.upsert",  () => { })
}
qr()

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("not-authorized")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})
