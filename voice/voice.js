const dialectSelector = document.getElementById('dialect-selector')
const speakBtn = document.getElementById('speak-btn')
const translateBox = document.getElementById('translate-box')

let recorder = null
let chunks = []

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    recorder = new MediaRecorder(stream)

    recorder.ondataavailable = function(event) {
      chunks.push(event.data)
    }

    recorder.onstop = async function() {
      speakBtn.textContent = '⏳ Processing...'
      speakBtn.style.backgroundColor = 'var(--color2)'

      const blob = await resampleAudioBlob(new Blob(chunks, { type: 'audio/wav' }))
      chunks = []

      const speechToTextRes = await fetch('http://localhost:4321/speech-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        body: blob
      })

      if (speechToTextRes.status !== 200) {
        speakBtn.textContent = '⚠️ Cannot recognize speech'
        speakBtn.style.backgroundColor = 'var(--err)'
        window.logTranslation(userId, 'voice', dialectSelector.value, false, speakBtn.textContent)
        return
      }

      const text = (await speechToTextRes.json()).text
      if (text.length === 0) {
        speakBtn.textContent = '⚠️ Cannot recognize speech'
        speakBtn.style.backgroundColor = 'var(--err)'
        window.logTranslation(userId, 'voice', dialectSelector.value, false, speakBtn.textContent)
        return
      }

      const translateRes = await fetch(`http://localhost:4321/translate?text=${encodeURIComponent(text)}&targetLanguage=${encodeURIComponent(dialectSelector.value)}`, {
        method: 'GET'
      })

      if (translateRes.status !== 200) {
        speakBtn.textContent = `There is no phrase: ${text} on ${dialectSelector.value}`
        speakBtn.style.backgroundColor = 'var(--err)'
        window.logTranslation(userId, 'voice', dialectSelector.value, false, speakBtn.textContent)
        return
      }

      const translation = await translateRes.text()
      translateBox.textContent = translation

      speakBtn.textContent = "🎤 Hold to speak"

      const userId = localStorage.getItem('user')
      window.logTranslation(userId, 'voice', dialectSelector.value, true, null)
    }

    speakBtn.addEventListener('mousedown', () => {
      if (dialectSelector.value === 'none') {
        speakBtn.textContent = 'Please select a dialect'
        speakBtn.style.backgroundColor = 'var(--err)'
        return
      }

      speakBtn.textContent = '🎤 Speaking...'
      speakBtn.style.backgroundColor = 'var(--color2)'
      recorder.start()
    })

    speakBtn.addEventListener('mouseup', () => {
      recorder.stop();
    })
  })
  .catch(err => {
    speakBtn.textContent = 'Please make sure to allow the microphone'
    speakBtn.style.backgroundColor = 'var(--err)'

    console.error(err)
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
