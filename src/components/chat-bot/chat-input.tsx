import { ActivityIndicator, TextInput, View } from 'react-native';

import { Button } from '~/components/ui/button';
import { SendIcon } from 'lucide-react-native';

export const ChatInput = ({
  onSubmitValue,
  handleInputChange,
  input,
  loading,
}: {
  onSubmitValue: () => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  input: string;
  loading: boolean;
}) => {
  const disabledSubmit = input.trim() === '';
  const handleSubmit = () => {
    if (disabledSubmit) return;
    onSubmitValue();
  };
  return (
    <View className="border border-border rounded-lg flex-row min-h-20 p-1">
      <TextInput
        className="flex-1 p-2"
        placeholder="Type your answer..."
        placeholderTextColor="#666"
        value={input}
        onChange={(e) =>
          handleInputChange({
            ...e,
            target: {
              ...e.target,
              value: e.nativeEvent.text,
            },
          } as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        onSubmitEditing={handleSubmit}
        autoFocus={true}
        multiline
        maxLength={500}
      />
      <Button size="icon" onPress={handleSubmit} className="mt-auto" disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <SendIcon size={20} color="white" />
        )}
      </Button>
    </View>
  );
};
