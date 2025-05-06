const languageSelector = document.getElementById('languageSelector');
const outputText = document.getElementById('outputText')

const backgroundImages = {
  none: 'url("")',
  tagalog: 'url("images/tagalog.png")',
  cebuano: 'url("images/Cebu.png")',
  ilocano: 'url("images/ilocano.png")',
  hiligayon: 'url("images/hiligaynon.png")',
  bicolano: 'url("images/bikol.png")',
  waray: 'url("images/waray.png")',
  kapampangan: 'url("images/kapampangan.png")',
  pangasinan: 'url("images/Pangasinense.png")',
};

function changeBackground() {
  const language = languageSelector.value

  if (language === 'none') {
    document.body.style.background = 'linear-gradient(to bottom, #4CAF50, #2196F3)'
    console.log(document.body.style.background)

    return
  }

  if (backgroundImages[language]) {
    document.body.style.backgroundImage = backgroundImages[language];
  }
}

const micButton = document.getElementById("micButton");
const phraseSelect = document.getElementById("phraseSelect");

let micRecorder;
let chunks = [];

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    micRecorder = new MediaRecorder(stream)

    micRecorder.ondataavailable = event => {
      chunks.push(event.data)
    }

    micRecorder.onstop = async () => {
      micButton.textContent = '⏳ Processing...'

      const audioBlob = new Blob(chunks, { type: 'audio/wav' })
      chunks = []

      const resampledBlob = await resampleAudioBlob(audioBlob)

      const speechToTextRes = await fetch('http://localhost:4321/speech-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: resampledBlob
      })

      if (speechToTextRes.status !== 200) {
        micButton.textContent = '⚠️ Cannot recognize speech'
        return;
      }

      const text = (await speechToTextRes.json()).text
      if (text.length === 0) {
        micButton.textContent = '⚠️ Cannot recognize speech'
        return;
      }

      const targetLanguage = languageSelector.value

      const translateRes = await fetch(`http://localhost:4321/translate?text=${text}&targetLanguage=${targetLanguage}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/text'
        }
      })

      if (translateRes.status !== 200) {
        micButton.textContent = `There is no phrase: ${text}`
        return;
      }

      const translation = await translateRes.text()
      outputText.textContent = translation;

      micButton.textContent = "🎤 Hold to speak"
    }

    micButton.addEventListener("mousedown", async () => {
      micButton.textContent = "🎤 Speaking..."
      micRecorder.start()
    });

    micButton.addEventListener("mouseup", () => {
      micRecorder.stop();
    });

  }).catch(e => {
    micButton.disabled = true;
    micButton.textContent = 'Please make sure to allow microphone'
    console.log(e)
  })

async function resampleAudioBlob(audioBlob, inputRate = 48000, outputRate = 16000) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Decode the audio Blob into an AudioBuffer
  const arrayBuffer = await audioBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // Create an OfflineAudioContext with the desired output rate
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.duration * outputRate,
    outputRate
  );

  // Create a source node from the decoded audioBuffer
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);

  // Start rendering (resampling the audio)
  source.start();
  const resampledBuffer = await offlineContext.startRendering();

  // Convert the resampled buffer to a WAV Blob
  const resampledData = resampledBuffer.getChannelData(0);
  const wavBlob = encodeWAV(resampledData, outputRate);

  // Return the WAV Blob (or send it to your API directly)
  return wavBlob;
}

// WAV encoding function (simple version)
function encodeWAV(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // Write the WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}
