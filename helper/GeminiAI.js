const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory
} = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const __path = process.cwd();

const genAI = new GoogleGenerativeAI('AIzaSyCBBTh-MIpyfZV_hl-CafqdX4ZzdXDMc4c');

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

const safetySettings = [{
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];
// Export the GeminiAI function
module.exports = async function GeminiAI(userId, chat, image, mode) {
  return new Promise(async (resolve, reject) => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-latest"
    });

    // Load or create chat history for the user
    const userHistoryDir = path.join(__path, 'gemini-chat', userId);
    const historyFilePath = path.join(userHistoryDir, 'chat_history.json');

    let chatHistory = [];

    // Check if user directory exists, create it if not
    if (!fs.existsSync(userHistoryDir)) {
      fs.mkdirSync(userHistoryDir, {
        recursive: true
      });
      console.log(`Folder riwayat chat untuk pengguna ${userId} telah dibuat.`);
    }

    try {
      // Check if history file exists in the user directory
      if (fs.existsSync(historyFilePath)) {
        const historyData = fs.readFileSync(historyFilePath, 'utf-8');
        if (historyData.trim() === '') {
          console.warn(`Peringatan: Riwayat chat kosong untuk pengguna ${userId}. Memulai chat baru.`);
        } else {
          chatHistory = JSON.parse(historyData.replace(/,\s*\]/g, ']'));
        }
      } else {
        // Create empty chat history file if it doesn't exist
        fs.writeFileSync(historyFilePath, '[]');
        console.log(`File riwayat chat untuk pengguna ${userId} telah dibuat.`);
      }
    } catch (error) {
      console.error(`Error saat memuat riwayat chat untuk pengguna ${userId}:`, error.message);
    }

    // Add new user message


    // Check if image exists and is valid within the user's directory
    let messageParts = [{
      text: chat
    }];
    if (image) { // Ensure 'image' is not null or undefined
      const imagePath = path.join(userHistoryDir, image);

      if (image.startsWith('gemini-img') && fs.existsSync(imagePath)) {
        const imageMimeType = image.endsWith('.png') ? 'image/png' : 'image/jpeg';
        const imagePart = fileToGenerativePart(imagePath, imageMimeType);
        messageParts.push(imagePart);
      }
    }
    const chatSession = model.startChat({
      history: chatHistory,
      safetySettings: safetySettings,

    });

    try {
      var stream = mode ? true : false;
      let text
      if (stream) {
        const result = await chatSession.sendMessageStream(messageParts);
        const aggregatedResponse = await result.response;
        text = aggregatedResponse.text();
        text = text.replace(/\*\*+/g, '*');
      } else {
        const result = await chatSession.sendMessage(messageParts);
        text = result.response.text();
        text = text.replace(/\*\*+/g, '*');
      }

      // Write chat history in the specified format
      fs.writeFileSync(historyFilePath, JSON.stringify(chatHistory, null, 2));

      resolve(text);
    } catch (error) {
      reject(error);
    }
  });
};
