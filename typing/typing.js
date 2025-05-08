const phraseText = document.getElementById('phrase-text')
const dialectSelector = document.getElementById('dialect-selector')
const translateBtn = document.getElementById('translate-btn')
const translateBox = document.getElementById('translate-box')

translateBtn.addEventListener('click', async () => {
  if (!phraseText.value) {
    translateBtn.textContent = 'Phrase text is empty'
    translateBtn.style.backgroundColor = 'var(--err)'
    return
  }

  if (dialectSelector.value === 'none') {
    translateBtn.textContent = 'Please select a dialect'
    translateBtn.style.backgroundColor = 'var(--err)'
    return
  }

  translateBtn.textContent = '⏳ Processing...'

  const translateRes = await fetch(`http://localhost:4321/translate?text=${encodeURIComponent(phraseText.value)}&targetLanguage=${encodeURIComponent(dialectSelector.value)}`, {
    method: 'GET'
  })

  if (translateRes.status !== 200) {
    translateBtn.textContent = `There is no phrase: ${phraseText.value} on ${dialectSelector.value}`
    return;
  }

  const text = await translateRes.text()
  translateBox.textContent = text

  translateBtn.textContent = 'Translate'
  translateBtn.style.backgroundColor = 'var(--color2d)'
})
