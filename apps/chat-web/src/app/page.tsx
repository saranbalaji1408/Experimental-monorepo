"use client";

import React, { useEffect, useState } from "react";
import { Box, VStack, useToast, Container, Heading } from "@chakra-ui/react";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import {
  fetchMessages,
  createMessage,
  deleteMessage,
  Message,
} from "../services/messageService";
import { ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadMessages = async () => {
    setLoading(true);
    const data = await fetchMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleSendMessage = async (sender: string, content: string) => {
    const newMessage = await createMessage(sender, content);
    if (newMessage) {
      setMessages([...messages, newMessage]);
      toast({
        title: "Message sent",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to send message",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    const success = await deleteMessage(id);
    if (success) {
      setMessages(messages.filter((message) => message._id !== id));
      toast({
        title: "Message deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to delete message",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50">
        <Container maxW="container.md" py={8}>
          <Heading as="h1" mb={8} textAlign="center">
            Chat Application
          </Heading>
          <VStack spacing={8} align="stretch">
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              bg="white"
            >
              <MessageList messages={messages} onDelete={handleDeleteMessage} />
            </Box>

            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              boxShadow="md"
              bg="white"
            >
              <MessageInput onSend={handleSendMessage} />
            </Box>
          </VStack>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
