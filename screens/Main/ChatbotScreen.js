import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from 'react-native-paper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env'; // ✅ Securely import API key

const ChatbotScreen = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Generative AI
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message to chat
    const userMessage = { text: inputText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // ✅ Use the correct Gemini model name
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      // Prepare the prompt
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: inputText }] }]
      });

      const response = await result.response;
      const botMessageText = response.text();

      // Add response message
      const botMessage = {
        text: `${botMessageText}\n\n*Disclaimer: AI-generated response.*`,
        sender: 'bot',
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: '⚠️ Unable to provide a response. Please try again later.', sender: 'bot' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {messages.map((item, index) => (
        <View key={index} style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      ))}

      {isLoading && <ActivityIndicator size="large" color="green" style={styles.loading} />}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
        />
        <Button title="Send" onPress={sendMessage} disabled={isLoading} color="green" />
      </View>
    </ScrollView>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginTop: 20,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  loading: {
    marginVertical: 10,
  },
});

export default ChatbotScreen;
