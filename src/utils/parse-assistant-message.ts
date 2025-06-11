export const parseAssistantMessage = (content: string) => {
  const jsonRegex = /```json\s*(\{[\s\S]*?\})\s*```/;
  const match = content.match(jsonRegex);

  if (match) {
    const beforeJson = content.substring(0, match.index).trim();
    const jsonContent = match[1];
    const afterJson = content.substring((match.index || 0) + match[0].length).trim();

    try {
      const questionData = JSON.parse(jsonContent);
      return {
        hasQuestion: true,
        textContent: beforeJson + (afterJson ? '\n\n' + afterJson : ''),
        questionData,
      };
    } catch (e) {
      console.log('JSON parsing error:', e);
      // If JSON parsing fails, treat as regular message
      return {
        hasQuestion: false,
        textContent: content,
        questionData: null,
      };
    }
  }

  return {
    hasQuestion: false,
    textContent: content,
    questionData: null,
  };
};
