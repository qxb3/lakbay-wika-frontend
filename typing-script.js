const inputText = document.getElementById('input-text')
const languageSelector = document.getElementById('languageSelector');
const translateBtn = document.getElementById('translateButton')
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

  if (backgroundImages[language]) {
    document.body.style.backgroundImage = backgroundImages[language];
  }
}

translateBtn.addEventListener('click', async() => {
  if (inputText.value.length == 0) {
    translateBtn.textContent = 'Please enter a phrase'
    return
  }

  if (languageSelector.value === 'none') {
    translateBtn.textContent = 'Please select a dialect'
    return
  }

  translateBtn.textContent = '⏳ Processing...'

  const translateRes = await fetch(`http://localhost:4321/translate?text=${inputText.value}&targetLanguage=${languageSelector.value}`, {
    method: 'GET'
  })

  if (translateRes.status !== 200) {
    translateBtn.textContent = `There is no phrase: ${text}`
    return;
  }

  const text = await translateRes.text()
  outputText.textContent = text

  translateBtn.textContent = 'Translate'
})
