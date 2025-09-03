// Test script to verify prompts API
const testPromptsAPI = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/prompts');
    const data = await response.json();
    console.log('Prompts API Response:', data);
    console.log('Number of prompts:', data.length);
    return data;
  } catch (error) {
    console.error('Error testing prompts API:', error);
  }
};

// Run the test
testPromptsAPI(); 