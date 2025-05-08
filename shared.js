const navMenuModal = document.getElementById('mobile-nav-modal-container')
const navMenuBtn = document.getElementById('mobile-nav-menu-btn')
const navCloseBtn = document.getElementById('mobile-nav-modal-close')

navMenuBtn.addEventListener('click', () => {
  navMenuModal.style.display = 'block'
})

navCloseBtn.addEventListener('click', () => {
  navMenuModal.style.display = 'none'
  isNavMenuOpen = false
})

const backgroundImages = {
  none: 'url("")',
  tagalog: 'url("/images/tagalog.png")',
  cebuano: 'url("/images/Cebu.png")',
  ilocano: 'url("/images/ilocano.png")',
  hiligayon: 'url("/images/hiligaynon.png")',
  bicolano: 'url("/images/bikol.png")',
  waray: 'url("/images/waray.png")',
  kapampangan: 'url("/images/kapampangan.png")',
  pangasinan: 'url("/images/Pangasinense.png")',
}

function changeBackground() {
  const dialectSelector = document.getElementById('dialect-selector')
  const dialect = dialectSelector.value

  if (dialect === 'none') {
    return document.body.style.background = 'linear-gradient(to bottom, var(--color1), var(--color2))'
  }

  if (backgroundImages[dialect]) {
    document.body.style.backgroundImage = backgroundImages[dialect];
  }
}
