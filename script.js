const apiKeyInput = document.getElementById("apiKey");
const promptInput = document.getElementById("prompt");
const submitBtn = document.getElementById("submitBtn");
const outputCanvas = document.getElementById("outputCanvas");
const errorDiv = document.getElementById("error");

const ctx = outputCanvas.getContext("2d");

// Load the loading animation
const loadingImg = new Image();
loadingImg.src = "loader.gif";

function showLoading() {
  ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  ctx.drawImage(
    loadingImg,
    outputCanvas.width / 2 - 50,
    outputCanvas.height / 2 - 50,
    100,
    100
  );
}

function showError(message) {
  errorDiv.textContent = message;
}

function clearError() {
  errorDiv.textContent = "";
}

function isValidApiKey(apiKey) {
  return /^sk-[A-Za-z0-9]{48}$/.test(apiKey);
}

async function generateCode(prompt, apiKey) {
  const configuration = new OpenAI.Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAI.OpenAIApi(configuration);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Generate HTML, CSS, and JavaScript code for: ${prompt}`,
      max_tokens: 1000,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
}

function executeCode(code) {
  const scriptTag = document.createElement("script");
  scriptTag.textContent = code;
  document.body.appendChild(scriptTag);
}

submitBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    showError("Please enter your OpenAI API key.");
    return;
  }

  if (!isValidApiKey(apiKey)) {
    showError(
      'Invalid API key format. It should start with "sk-" and be 51 characters long.'
    );
    return;
  }

  if (!prompt) {
    showError("Please enter a prompt.");
    return;
  }

  clearError();
  showLoading();

  try {
    const generatedCode = await generateCode(prompt, apiKey);
    executeCode(generatedCode);
  } catch (error) {
    showError(error.message);
  }
});

// Resize canvas to fit container
function resizeCanvas() {
  outputCanvas.width = outputCanvas.clientWidth;
  outputCanvas.height = outputCanvas.clientHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
