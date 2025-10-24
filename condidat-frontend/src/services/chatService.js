import api from './api';

const chatService = {
  async send(messages, options = {}) {
    // options may include { concise: true } to ask the backend to respond directly
    const payload = { messages, ...options };
    const { data } = await api.post('/ai/chat/', payload);
    return data.reply;
  }
};

export default chatService;


