import React, { useState } from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";
import { Lesson } from "~/types/lesson.type";
import { SpeakButton } from "../custom-ui/speak-button";
import { Text } from "../ui/text";
import { CheckResultButton } from "./CheckResultButton";

const SingleChooseImageLesson = ({
  value,
  disabled,
  onSuccess,
}: {
  value: Lesson;
  disabled?: boolean;
  onSuccess?: (isFail?: boolean) => void;
}) => {
  const { question, imageSelectors, answer, image, audioLanguage } =
    value.value;
  const [selected, setSelected] = useState<string | null>();

  const handleSelectWord = (value: string) => {
    setSelected(value);
  };

  const handleCheckResults = () => {
    const isCorrect = !!answer && answer === selected;
    onSuccess?.(!isCorrect);
  };

  // Chia imageSelectors thành các hàng
  const rows = [];
  if (imageSelectors && imageSelectors.length > 0) {
    // Tạo mảng 2 chiều từ mảng 1 chiều
    for (let i = 0; i < imageSelectors.length; i += 2) {
      rows.push(imageSelectors.slice(i, i + 2));
    }
  }

  return (
    <View className='flex-1 gap-6'>
      {!!question && (
        <Text className='font-semibold text-xl text-center text-primary'>
          {question}
        </Text>
      )}

      {image && (
        <Image
          src={image}
          alt='Question Image'
          style={{ flex: 1, maxHeight: 200, objectFit: "contain" }}
        />
      )}

      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((item, colIndex) => {
              const isUsed = selected === item.label;
              return (
                <View
                  key={`item-${rowIndex}-${colIndex}`}
                  style={styles.gridItem}
                >
                  <SpeakButton
                    onPress={() => {
                      handleSelectWord(item.label);
                    }}
                    disabled={disabled}
                    style={[styles.button, isUsed && styles.selectedButton]}
                    label={item.label}
                    image={item.image}
                    isSelected={isUsed}
                    language={audioLanguage}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <CheckResultButton disabled={!selected} onCheck={handleCheckResults} />
    </View>
  );
};

export default SingleChooseImageLesson;

// Lấy chiều rộng màn hình để tính toán kích thước nút
const { width } = Dimensions.get("window");
const buttonWidth = (width - 64) / 2; // 64 = padding của container + khoảng cách giữa các nút

const styles = StyleSheet.create({
  gridContainer: {
    width: "100%",
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridItem: {
    width: "48%", // Gần 50% để có khoảng cách giữa các nút
  },
  button: {
    borderWidth: 2,
    borderRadius: 8,
    width: "100%",
  },

  container: {
    padding: 16,
    flex: 1,
  },
  sentenceContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 50,
  },
  sentenceText: {},
  blankText: {
    fontWeight: "500",
  },
  optionsContainer: {
    flexWrap: "wrap",
    width: "100%",
    gap: 8,
  },
  wordButton: {
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    margin: 4,
  },
  wordButtonDisabled: {
    opacity: 0.4,
  },
  wordText: {},
});
