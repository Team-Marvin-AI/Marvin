export const typingEffect = (
  text: string,
  interval: number,
  callback: (text: string) => void
) => {
  if (!text || typeof text !== 'string' || text.length === 0) {
    console.error('Expected text to be a string, but got:', typeof text);
    return;
  }
  let index = 0;
  let displayedText = '';
  const typingInterval = setInterval(() => {
    if (index < text.length) {
      displayedText += text[index];
      callback(displayedText);
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, interval);
};
