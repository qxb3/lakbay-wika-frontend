const nameInput = document.getElementById('name')
const feedbackInput = document.getElementById('feedback')
const sendBtn = document.getElementById('send-btn')

sendBtn.addEventListener('click', async () => {
  const name = nameInput.value
  const feedback = feedbackInput.value

  if (!name) {
    sendBtn.textContent = 'Please input your name'
    sendBtn.style.backgroundColor = 'var(--err)'
    return
  }

  if (!feedback) {
    sendBtn.textContent = 'Please input your feedback'
    sendBtn.style.backgroundColor = 'var(--err)'
    return
  }

  const userId = localStorage.getItem('user')
  if (!userId) {
    sendBtn.textContent = 'Please reload the webpage'
    sendBtn.style.backgroundColor = 'var(--err)'
    return
  }

  const feedbackRes = await fetch(`http://localhost:4321/feedback?userid=${encodeURIComponent(userId)}&name=${encodeURIComponent(name)}&feedback=${encodeURIComponent(feedback)}`, {
    method: 'POST'
  })

  const result = await feedbackRes.text()

  if (feedbackRes.status !== 200) {
    sendBtn.textContent = result
    sendBtn.style.backgroundColor = 'var(--err)'
    return
  }

  nameInput.value = ''
  feedbackInput.value = ''

  sendBtn.textContent = 'Success'
  sendBtn.style.backgroundColor = 'var(--color2d)'
})
