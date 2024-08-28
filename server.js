const express = require('express');
const pino = require('pino');
const { default: makeWASocket, Browsers, delay, useMultiFileAuthState, fetchLatestBaileysVersion, PHONENUMBER_MCC, makeCacheableSignalKeyStore, jidNormalizedUser } = require('@whiskeysockets/baileys');
const NodeCache = require('node-cache');
const chalk = require('chalk');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const msgRetryCounterCache = new NodeCache();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route pour générer le code de jumelage
app.get('/code', async (req, res) => {
    const phoneNumber = req.query.number || '';

    if (!phoneNumber) {
        return res.status(400).send('Phone number is required.');
    }

    const cleanedNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
        return res.status(400).send('Invalid phone number format.');
    }

    try {
        let { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState('./sessions');
        
        const XeonBotInc = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.windows('Firefox'),
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid);
                let msg = await store.loadMessage(jid, key.id);
                return msg?.message || "";
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: undefined,
        });

        if (!XeonBotInc.authState.creds.registered) {
            const code = await XeonBotInc.requestPairingCode(cleanedNumber);
            const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
            res.json({ code: formattedCode });
        } else {
            res.status(400).send('Already registered.');
        }
    } catch (error) {
        res.status(500).send('Error generating pairing code.');
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
