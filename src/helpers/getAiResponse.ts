export const getAiResponse = async () => {
  try {
    const response = await fetch('/marvin/chat');
    if (!response.ok) {
      throw new Error('response error trying fetch data on mount');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error getting initial Ai question', error);
  }
};
