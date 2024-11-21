export const postUserInput = async (userAnswer: string, aiResponse: string) => {
  try {
    const response = await fetch('/marvin/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'userInput': userAnswer,
        'aiResponse': aiResponse,
      }),
    });
    console.log('postuserinput: ', response.ok)
    if (response.ok === false) {
      throw new Error('Error trying sending post request with user input');
    }
    const data = await response.json(); 
    console.log("data: ", data)
    return data;
  } catch (error) {
    console.log((error as Error).message || 'Error sending user input to AI');
  }
};
