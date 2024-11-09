export class ChatService {
  private static baseUrl = '/crm';

  static async getUserChats(email: string) {
    try {
      const response = await fetch(`${this.baseUrl}/users/list/${email}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  static async sendMessage(from: string, text: string) {
    try {
      const response = await fetch(`${this.baseUrl}/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ from, text })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static async deleteChat(userId: string) {
    try {
      await fetch(`${this.baseUrl}/delete/chat/${userId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw error;
    }
  }

  static async addTag(userId: string, tag: string) {
    try {
      await fetch(`${this.baseUrl}/tags/add/${userId}/${tag}`);
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  }

  static async removeTag(userId: string, tag: string) {
    try {
      await fetch(`${this.baseUrl}/tags/remove/${userId}/${tag}`);
    } catch (error) {
      console.error('Error removing tag:', error);
      throw error;
    }
  }

  static async getChatMessages(email: string) {
    try {
      const response = await fetch(`${this.baseUrl}/chats/${email}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  static async getUserData() {
    try {
      const response = await fetch('/auth/data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  static async login(email: string, password: string) {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  }
}