const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" })
  });

  // Pairing Code
  if (!sock.authState.creds.registered) {
    const phone = process.argv[2];
    if (!phone) {
      console.log("Usage: node index.js <phone_number>");
      process.exit(1);
    }

    const code = await sock.requestPairingCode(phone);
    console.log(`Your Pairing Code: ${code}`);
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", ({ connection, lastDisconnect }) => {
    if (connection === "open") {
      console.log("✅ Kawshala-MD Connected!");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      if (shouldReconnect) {
        console.log("♻️ Reconnecting...");
        startBot();
      } else {
        console.log("❌ Logged Out.");
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (text === ".ping") {
      await sock.sendMessage(msg.key.remoteJid, {
        text: "🏓 Pong! Kawshala-MD is Online."
      });
    }

    if (text === ".menu") {
      await sock.sendMessage(msg.key.remoteJid, {
        text:
`🤖 *Kawshala-MD*

📌 Commands:
.ping
.menu`
      });
    }
  });
}

startBot();
