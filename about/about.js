const email = document.getElementById('email')
const body = document.getElementById('body')
const sendBtn = document.getElementById('send-btn')

sendBtn.addEventListener('click', () => {
  if (!email.value) {
    sendBtn.textContent = 'Empty email'
    sendBtn.style.backgroundColor = 'var(--err)'
    return
  }

  if (!body.value) {
    sendBtn.textContent = 'Empty feedback body'
    sendBtn.style.backgroundColor = 'var(--err)'
    return
  }

  const e = encodeURIComponent(email.value)
  const s = encodeURIComponent('Feedback')
  const b = encodeURIComponent(body.value)
  window.location.href = `mailto:ouremail@example.com?subject=${s}&body=Emailer: ${e} - ${b}`;
})
