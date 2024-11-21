<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAiResponse } from '../helpers/getAiResponse';
import { typingEffect } from '../helpers/typingEffect';
import { postUserInput } from '../helpers/postUserInput';

const inputRef = ref<HTMLInputElement | null>(null);
const userInput = ref<string>('');
const aiResponse = ref<string>('');
const displayedResponse = ref<string>('');
const loading = ref<boolean>(true);
const loadingText = ref<string>('');
const decision = ref<boolean>(false);

//getting first AI question upon page load
onMounted(async () => {
  typingEffect('Waiting on Stan Lee...', 20, (text) => {
    loadingText.value = text;
  });

  try {
    aiResponse.value = await getAiResponse();
    typingEffect(response, 20, (text) => {
      displayedResponse.value = text;
    });
  } catch (error) {
    console.log('Error fetching initial Ai question upon page load');
  } finally {
    loading.value = true;
  }
  //input focus upon page load
  if (inputRef.value) {
    inputRef.value.focus();
  }
});

//sending user input to backend
const handleSubmit = async () => {
  if (userInput.value === '') {
    alert('We need some hint...');
    return;
  }

  //logic to decide what to display base on AI certainty
  const response = await postUserInput(userInput.value, aiResponse.value);
  console.log(userInput.value);
  if (!response.ok || !response) {
    throw new Error('Error getting AI response');
  }

  //store the response in localstorage
  localStorage.setItem('aiResponse', JSON.stringify(response));

  if (response.certainty) {
    aiResponse.value = response.nextQuestion;
  } else {
    aiResponse.value = `I blieve the superhero you are thinking is ${response.character}, am I right?`;
    decision.value = true;
  }
  userInput.value = '';
};

//trigger page refresh if AI is correct
const handleYes = () => {
  window.location.reload();
};

//move on to the next question if AI is wrong
const handleNo = () => {
  aiResponse.value = JSON.parse(
    localStorage.getItem('aiResponse')
  ).nextQuestion;
  decision.value = false;
};
</script>

<template>
  <div className="chat-area">
    <p v-if="loading">{{ loadingText }}</p>
    <p v-if="aiResponse">{{ aiResponse }}</p>
    <br />
    <div v-if="!decision">
      <input
        class="user-input"
        ref="inputRef"
        v-model="userInput"
        placeholder="Give me some hint..."
        @keydown.enter="handleSubmit"
      />
      <button @click="handleSubmit">SEND</button>
    </div>
    <div v-if="decision.value" class="decision">
      <button @click="handleYes">YES</button>
      <button @click="handleNo">NO</button>
    </div>
  </div>
</template>

<style scoped>
* {
  font-family: 'Anton', sans-serif;
}

.user-input {
  height: 30px;
  width: 400px;
  outline: none;
  border: none;
  border-bottom: 1px solid grey;
  background-color: rgba(0, 0, 0, 0);
}

.chat-area button {
  font-size: 20px;
  padding: 0 3px;
  outline: none;
  border-radius: 7px;
  background-color: rgba(0, 0, 0, 0);
  cursor: pointer;
  margin-left: 10px;
}
</style>
