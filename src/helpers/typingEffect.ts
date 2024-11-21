export const typingEffect = (
  text: string,
  interval: number,
  callback: (text: string) => void
) => {
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
