import { ActivityIndicator, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { Image } from 'expo-image';
import Markdown from 'react-native-markdown-display';
import { Message } from 'ai';
import { MessageRectangle } from './message-rectangle';
import { Text } from '~/components/ui/text';
import { parseAssistantMessage } from '~/utils/parse-assistant-message';

export const MessageItem = ({ message }: { message: Message }) => {
  const isAssistant = message.role === 'assistant';
  const isUser = message.role === 'user';

  if (message.id === 'waiting') {
    return (
      <MessageContainer>
        <View className="flex-row items-center">
          <Avatar source={require('~/assets/images/ai-avatar.png')} />
          <ActivityIndicator size="small" className="text-primary-500" />
        </View>
      </MessageContainer>
    );
  }

  if (isAssistant) {
    const parsed = parseAssistantMessage(message.content);

    return (
      <MessageContainer>
        <View className="flex-row items-start mb-2">
          <Avatar source={require('~/assets/images/ai-avatar.png')} />
          <View className="flex-1 max-w-[85%]">
            {parsed.textContent && (
              <View className="mb-1.5">
                <Markdown style={markdownStyles}>{parsed.textContent}</Markdown>
              </View>
            )}

            {parsed.hasQuestion && parsed.questionData && (
              <View className="bg-primary-50 py-3 px-4 rounded-lg">
                <Text className="text-primary-600 font-semibold text-xs mb-1">
                  Question {parsed.questionData.question_number}:
                </Text>
                <Text className="text-sm">{parsed.questionData.question_text}</Text>
              </View>
            )}
          </View>
        </View>
      </MessageContainer>
    );
  }

  if (isUser) {
    return (
      <MessageContainer>
        <View className="flex-row justify-end mb-2">
          <View className="bg-primary rounded-lg max-w-2/3 px-4 py-3 max-w-[85%] relative">
            <Text className="text-white text-sm">{message.content}</Text>
            <View className="absolute bottom-0 right-2 translate-y-full">
              <MessageRectangle />
            </View>
          </View>
        </View>
      </MessageContainer>
    );
  }

  return null;
};

const MessageContainer = ({ children }: { children: React.ReactNode }) => {
  return <View className="mb-2">{children}</View>;
};

const Avatar = ({ source }: { source: ImageSourcePropType }) => {
  return <Image source={source} style={styles.avatar} />;
};

const styles = StyleSheet.create({
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  paragraph: {
    marginBottom: 8,
  },
  strong: {
    fontWeight: '600',
  },
  em: {
    fontStyle: 'italic',
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 6,
    fontSize: 13,
    fontFamily: 'monospace',
  },
});
