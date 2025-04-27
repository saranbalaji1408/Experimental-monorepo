import axios from "axios";

const API_URL =
  "https://saran-server-401553303388.us-central1.run.app/api/messages";

export interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export const fetchMessages = async (): Promise<Message[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};

export const createMessage = async (
  sender: string,
  content: string
): Promise<Message | null> => {
  try {
    const response = await axios.post(API_URL, { sender, content });
    return response.data;
  } catch (error) {
    console.error("Error creating message:", error);
    return null;
  }
};

export const deleteMessage = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
};
