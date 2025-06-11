import { memo, useEffect, useMemo, useRef } from 'react';

import { FlashList } from '@shopify/flash-list';
import { Message } from 'ai';
import { MessageItem } from './message-item';
import { View } from 'react-native';

const MessageList = ({
  messages,
  status,
}: {
  messages: Message[];
  isWaiting?: boolean;
  status: 'error' | 'submitted' | 'streaming' | 'ready';
}) => {
  const messagesWithWaiting = useMemo(() => {
    if (status === 'submitted') {
      return [
        ...messages,
        { id: 'waiting', role: 'assistant', content: '...' },
      ] as unknown as Message[];
    }
    return messages;
  }, [status, messages]);
  const renderMessage = ({ item, index }: { item: Message; index: number }) =>
    index === messagesWithWaiting.length - 1 ? (
      <View className="min-h-[620px]">
        <MessageItem message={item} />
      </View>
    ) : (
      <MessageItem message={item} />
    );
  const ref = useRef<FlashList<Message>>(null);
  useEffect(() => {
    if (messagesWithWaiting.length < 2) return;
    setTimeout(() => {
      ref.current?.scrollToIndex({
        index: messagesWithWaiting.length - 2,
        viewPosition: 0,
        animated: true,
      });
    }, 100);
  }, [messagesWithWaiting]);

  return (
    <FlashList
      data={messagesWithWaiting}
      ref={ref}
      renderItem={renderMessage}
      estimatedItemSize={100}
      contentContainerStyle={{ paddingVertical: 8 }}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
};

const MemoizedMessageList = memo(MessageList);

export { MemoizedMessageList as MessageList };
