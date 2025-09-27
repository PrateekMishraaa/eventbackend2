// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode");
// const mongoose = require("mongoose");
// const Registration = require("../models/Registration");

// // Active sessions storage
// const activeSessions = {};

// // Initialize WhatsApp Client
// const createWhatsAppClient = (userId) => {
//   return new Promise((resolve, reject) => {
//     if (activeSessions[userId]?.client) {
//       return resolve(activeSessions[userId].client);
//     }

//     const client = new Client({
//       authStrategy: new LocalAuth({ clientId: userId }),
//       puppeteer: {
//         headless: true,
//         args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       },
//     });

//     // Session data structure
//     activeSessions[userId] = {
//       client,
//       qrCode: null,
//       status: 'initializing',
//       lastUpdated: new Date()
//     };

//     // Event: QR Code Generation
//     client.on("qr", async (qr) => {
//       try {
//         const qrImage = await qrcode.toDataURL(qr);
//         activeSessions[userId] = {
//           ...activeSessions[userId],
//           qrCode: qrImage,
//           status: 'waiting',
//           lastUpdated: new Date()
//         };
//       } catch (err) {
//         console.error('QR generation error:', err);
//       }
//     });

//     // Event: Client Ready
//     client.on("ready", () => {
//       activeSessions[userId] = {
//         ...activeSessions[userId],
//         status: 'connected',
//         qrCode: null,
//         lastUpdated: new Date()
//       };
//       console.log(`Client ${userId} ready`);
//     });

//     // Event: Disconnect
//     client.on("disconnected", (reason) => {
//       console.log(`Client ${userId} disconnected:`, reason);
//       cleanUpSession(userId);
//     });

//     // Initialize client
//     client.initialize().then(() => {
//       resolve(client);
//     }).catch(err => {
//       cleanUpSession(userId);
//       reject(err);
//     });
//   });
// };

// // Clean up session data
// const cleanUpSession = (userId) => {
//   if (activeSessions[userId]) {
//     if (activeSessions[userId].client) {
//       activeSessions[userId].client.destroy();
//     }
//     delete activeSessions[userId];
//   }
// };

// // Controller: Start WhatsApp Client
// exports.startClient = async (req, res) => {
//   const { userId } = req.body;
//   console.log(userId)

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     await createWhatsAppClient(userId);
//     res.json({ 
//       success: true, 
//       message: "WhatsApp client initialized",
//       status: activeSessions[userId]?.status || 'disconnected'
//     });
//   } catch (error) {
//     console.error("Client initialization error:", error);
//     res.status(500).json({ 
//       error: "Failed to initialize client",
//       details: error.message 
//     });
//   }
// };

// // Controller: Get Session Status
// exports.getSessionStatus = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   const session = activeSessions[userId] || { status: 'disconnected' };

//   res.json({
//     status: session.status,
//     qrCode: session.qrCode,
//     userId,
//     lastUpdated: session.lastUpdated
//   });
// };

// // Controller: Logout/Destroy Session
// exports.logout = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     cleanUpSession(userId);
//     res.json({ success: true, message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ 
//       error: "Failed to logout",
//       details: error.message 
//     });
//   }
// };

// // Controller: Send Message (example)
// exports.sendMessage = async (req, res) => {
//   const { userId, phone, message } = req.body;

//   if (!activeSessions[userId] || activeSessions[userId].status !== 'connected') {
//     return res.status(400).json({ error: "WhatsApp client not connected" });
//   }

//   try {
//     const client = activeSessions[userId].client;
//     const number = phone.replace(/\D/g, "") + "@c.us";
    
//     const isRegistered = await client.isRegisteredUser(number);
//     if (!isRegistered) {
//       return res.status(400).json({ error: "Phone number not registered on WhatsApp" });
//     }

//     const sentMessage = await client.sendMessage(number, message);
    
//     // Save to database
//     const newMessage = new Message({
//       userId,
//       from: userId + "@c.us",
//       to: number,
//       message,
//       direction: "outgoing",
//       messageId: sentMessage.id.id,
//       status: "sent",
//       timestamp: new Date()
//     });
//     await newMessage.save();

//     res.json({ 
//       success: true,
//       messageId: sentMessage.id.id,
//       status: "sent"
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       error: "Failed to send message",
//       details: error.message 
//     });
//   }
// };





























//---------------------------
// const { Client, LocalAuth } = require("whatsapp-web.js");
// const qrcode = require("qrcode");

// // Active sessions storage
// const activeSessions = {};

// // Initialize WhatsApp Client
// const createWhatsAppClient = (userId, io) => {
//   return new Promise((resolve, reject) => {
//     if (activeSessions[userId]?.client) {
//       return resolve(activeSessions[userId].client);
//     }

//     const client = new Client({
//       authStrategy: new LocalAuth({ clientId: userId }),
//       puppeteer: {
//         headless: true,
//         args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       },
//     });

//     activeSessions[userId] = {
//       client,
//       qrCode: null,
//       status: 'initializing',
//       lastUpdated: new Date()
//     };

//     // QR code event
//     client.on("qr", async (qr) => {
//       try {
//         const qrImage = await qrcode.toDataURL(qr);
//         activeSessions[userId] = {
//           ...activeSessions[userId],
//           qrCode: qrImage,
//           status: 'waiting',
//           lastUpdated: new Date()
//         };
//         // Emit QR to frontend
//         io.emit("whatsapp-qr", { qr: qrImage, userId });
//       } catch (err) {
//         console.error('QR generation error:', err);
//       }
//     });

//     // Ready event
//     client.on("ready", () => {
//       activeSessions[userId] = {
//         ...activeSessions[userId],
//         status: 'connected',
//         qrCode: null,
//         lastUpdated: new Date()
//       };
//       console.log(`Client ${userId} ready`);
//       io.emit("whatsapp-status", { isReady: true, userId });
//     });

//     // Disconnected event
//     client.on("disconnected", (reason) => {
//       console.log(`Client ${userId} disconnected:`, reason);
//       io.emit("disconnected", { userId, reason });
//       cleanUpSession(userId);
//     });

//     client.initialize()
//       .then(() => resolve(client))
//       .catch(err => {
//         cleanUpSession(userId);
//         reject(err);
//       });
//   });
// };

// // Clean up session data
// const cleanUpSession = (userId) => {
//   if (activeSessions[userId]) {
//     if (activeSessions[userId].client) {
//       activeSessions[userId].client.destroy();
//     }
//     delete activeSessions[userId];
//   }
// };

// // Controller: Start WhatsApp Client
// exports.startClient = async (req, res) => {
//   const { userId } = req.body;
//   const io = req.app.get('io'); // Get io from app locals

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     await createWhatsAppClient(userId, io);
//     res.json({ 
//       success: true, 
//       message: "WhatsApp client initialized",
//       status: activeSessions[userId]?.status || 'disconnected'
//     });
//   } catch (error) {
//     console.error("Client initialization error:", error);
//     res.status(500).json({ 
//       error: "Failed to initialize client",
//       details: error.message 
//     });
//   }
// };

// // Controller: Get Session Status
// exports.getSessionStatus = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   const session = activeSessions[userId] || { status: 'disconnected' };

//   res.json({
//     status: session.status,
//     qrCode: session.qrCode,
//     userId,
//     lastUpdated: session.lastUpdated
//   });
// };

// // Controller: Logout/Destroy Session
// exports.logout = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     cleanUpSession(userId);
//     res.json({ success: true, message: "Logged out successfully" });
//   } catch (error) {
//     res.status(500).json({ 
//       error: "Failed to logout",
//       details: error.message 
//     });
//   }
// };




































// whatsappController.js
const { Client, LocalAuth } = require('whatsapp-web.js');

const activeSessions = {};

const startClient = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ success: false, error: 'User ID is required' });
  }

  // Avoid starting multiple sessions
  if (activeSessions[userId]) {
    return res.status(200).json({ success: true, message: 'Client already running' });
  }

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: userId }),
    puppeteer: { headless: true }
  });

  const session = { client, status: 'initializing', qr: null };
  activeSessions[userId] = session;

  const io = req.app.get('io');

  client.on('qr', (qr) => {
    console.log(`QR received for user ${userId}`);
    session.qr = qr;
    session.status = 'qr';

    if (io) {
      io.to(userId).emit('whatsapp-qr', { qr, userId });
    }
  });

  client.on('ready', () => {
    console.log(`WhatsApp client ready for user ${userId}`);
    session.status = 'authenticated';
    session.qr = null;

    if (io) {
      io.to(userId).emit('whatsapp-status', {
        isReady: true,
        userId
      });
    }
  });

  client.on('authenticated', () => {
    console.log(`WhatsApp client authenticated for user ${userId}`);
    session.status = 'authenticated';
  });

  client.on('disconnected', () => {
    console.log(`Client disconnected for user ${userId}`);
    session.status = 'disconnected';
    session.qr = null;

    if (io) {
      io.to(userId).emit('whatsapp-status', {
        isReady: false,
        userId
      });
    }
  });

  await client.initialize();

  res.status(200).json({ success: true, message: 'Client started' });
};



module.exports = {
  startClient,
  activeSessions,
};
