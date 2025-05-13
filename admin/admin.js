const monitorBtn = document.getElementById('monitor-btn')
const feedbacksBtn = document.getElementById('feedbacks-btn')
const monitorView = document.getElementById('monitor-view')
const feedbacksView = document.getElementById('feedbacks-view')
const feedbackList = document.getElementById('feedbacks')

monitorBtn.classList.add('active')
monitorView.style.display = 'block'
feedbacksView.style.display = 'none'

;(async () => {
  const feedbacksRes = await fetch('http://localhost:4321/list-feedbacks')
  const feedbacks = await feedbacksRes.json()

  for (let i = 0; i < feedbacks.length; i++) {
    const feedback = feedbacks[i]

    feedbackList.innerHTML += `
      <tr>
        <td>${feedback.user_id}</td>
        <td>${feedback.name}</td>
        <td>${feedback.feedback}</td>
      </tr>
    `
  }
})()

monitorBtn.addEventListener('click', () => {
  monitorBtn.classList.add('active')
  feedbacksBtn.classList.remove('active')

  monitorView.style.display = 'block'
  feedbacksView.style.display = 'none'
})

feedbacksBtn.addEventListener('click', () => {
  feedbacksBtn.classList.add('active')
  monitorBtn.classList.remove('active')

  feedbacksView.style.display = 'block'
  monitorView.style.display = 'none'
})
