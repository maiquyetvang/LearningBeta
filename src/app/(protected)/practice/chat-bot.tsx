import { ChatInput, MessageList } from '~/components/chat-bot';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { ScreenHeader } from '~/components/screen-header';
import { fetch as expoFetch } from 'expo/fetch';
import { generateAPIUrl } from '~/utils/generate-api-url';
import { useChat } from '@ai-sdk/react';

export default function ChatBotScreen() {
  const { messages, error, handleInputChange, input, handleSubmit, status } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl('/api/chat'),
    onError: (error) => console.error(error, 'ERROR'),
  });

  if (error) return <Text>{error.message}</Text>;
  const isPending = status === 'streaming' || status === 'submitted';
  return (
    <SafeAreaView className="bg-background" style={styles.container}>
      <ScreenHeader title="Chat Bot" />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={12}
        style={styles.keyboardContainer}
      >
        <View style={styles.chatContainer}>
          <MessageList messages={messages} status={status} />
          <ChatInput
            loading={isPending}
            handleInputChange={handleInputChange}
            input={input}
            onSubmitValue={handleSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
});
