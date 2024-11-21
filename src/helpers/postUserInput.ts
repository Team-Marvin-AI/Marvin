export const postUserInput = async (userInput: string, aiResponse: string) => {
  try {
    const response = await fetch('/marvin/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'userInput': userInput,
        'aiResponse': aiResponse,
      }),
    });
    if (!response.ok) {
      throw new Error('Error trying sending post request with user input');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log((error as Error).message || 'Error sending user input to AI');
  }
};
