import React from "react";
import {
  Box,
  VStack,
  Text,
  HStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Message } from "../services/messageService";

interface MessageListProps {
  messages: Message[];
  onDelete: (id: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onDelete }) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <VStack
      spacing={4}
      align="stretch"
      w="100%"
      maxH="500px"
      overflowY="auto"
      p={4}
    >
      {messages.length === 0 ? (
        <Text textAlign="center" color="gray.500">
          No messages yet
        </Text>
      ) : (
        messages.map((message) => (
          <Box
            key={message._id}
            p={3}
            bg={bgColor}
            borderRadius="md"
            boxShadow="sm"
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">{message.sender}</Text>
                <Text>{message.content}</Text>
                <Text fontSize="xs" color="gray.500">
                  {new Date(message.timestamp).toLocaleString()}
                </Text>
              </VStack>
              <IconButton
                aria-label="Delete message"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={() => onDelete(message._id)}
              />
            </HStack>
          </Box>
        ))
      )}
    </VStack>
  );
};

export default MessageList;
