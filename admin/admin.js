const monitorBtn = document.getElementById('monitor-btn')
const feedbacksBtn = document.getElementById('feedbacks-btn')

const monitorView = document.getElementById('monitor-view')
const feedbacksView = document.getElementById('feedbacks-view')

monitorBtn.classList.add('active')
monitorView.style.display = 'block'
feedbacksView.style.display = 'none'

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

;(() => {
  populateMonitorGraphs()
  populateFeedbacks()
})()

async function populateMonitorGraphs() {
  await errorRateGraph()
}

async function errorRateGraph() {
  const errorRateCtx = document.getElementById('error-rate')

  const data = [
      { dialect: 'tagalog', total: 5, errors: 1 },
      { dialect: 'cebuano', total: 4, errors: 1 },
      { dialect: 'ilocano', total: 4, errors: 1 },
      { dialect: 'hiligayon', total: 3, errors: 1 },
      { dialect: 'bicolano', total: 2, errors: 1 },
      { dialect: 'waray', total: 2, errors: 1 },
      { dialect: 'kapampangan', total: 2, errors: 0 },
      { dialect: 'pangasinan', total: 2, errors: 1 }
    ];

    const labels = data.map(row => row.dialect);
    const errorRates = data.map(row => +(row.errors / row.total * 100).toFixed(2)); // %

    new Chart(errorRateCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Error Rate (%)',
          data: errorRates,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Error Rate (%)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Translation Error Rate by Dialect'
          },
          tooltip: {
            callbacks: {
              label: ctx => `${ctx.raw}% errors`
            }
          }
        }
      }
    })
}

async function populateFeedbacks() {
  const feedbackList = document.getElementById('feedbacks')

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
}
