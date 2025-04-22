import React, { useState } from 'react';
import { 
  HStack, 
  Input, 
  Button, 
  FormControl,
  FormLabel,
  VStack
} from '@chakra-ui/react';

interface MessageInputProps {
  onSend: (sender: string, content: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [sender, setSender] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sender.trim() && content.trim()) {
      onSend(sender, content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Your Name</FormLabel>
          <Input
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Enter your name"
          />
        </FormControl>
        
        <HStack>
          <FormControl flex="1">
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Send
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default MessageInput;