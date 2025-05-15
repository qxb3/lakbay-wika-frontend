(() => {
  const admin = localStorage.getItem('admin')
  if (!admin) {
    window.location.href = '/admin_login'
  }
})()

const monitorBtn = document.getElementById('monitor-btn')
const feedbacksBtn = document.getElementById('feedbacks-btn')

const logoutBtn = document.getElementById('logout-btn')

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

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('admin')
  window.location.href = '/admin'
})

;(() => {
  populateMonitorGraphs()
  populateFeedbacks()
})()

async function populateMonitorGraphs() {
  await errorRateGraph()
  await commonDialectsGraph()
  await usersOvertimeGraph()
}

async function errorRateGraph() {
  const errorRateCtx = document.getElementById('error-rate')

  const errRateRes = await fetch('http://localhost:4321/error-rate')
  const data = await errRateRes.json()

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
      responsive: true,
      maintainAspectRatio: true,
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

async function commonDialectsGraph() {
  const commonDialectsCtx = document.getElementById('common-dialects')

  const resp = await fetch('http://localhost:4321/common-dialects')
  const data = await resp.json()

  new Chart(commonDialectsCtx, {
    type: 'pie',
    data: {
      labels: data.map(v => v.dialect),
      datasets: [{
        label: 'Most Common Dialects',
        data: data.map(v => v.count),
        backgroundColor: [
          '#ff6384', '#36a2eb', '#cc65fe', '#ffce56',
          '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Most Common Dialects'
        }
      }
    }
  })
}

async function usersOvertimeGraph() {
  const userOvertimeCtx = document.getElementById('user-overtime')

  const resp = await fetch('http://localhost:4321/user-overtime')
  const data = await resp.json()

  const dates = data.map(v => new Date(v.date))
  const totalUsers = data.map(v => v.total_users)

  new Chart(userOvertimeCtx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'New users overtime',
        data: totalUsers,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
        pointRadius: 5,
        pointBackgroundColor: 'rgb(75, 192, 192)',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            tooltipFormat: 'yyyy-MM-dd',
          },
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          beginAtZero: true,
          stepSize: 1,
          title: {
            display: true,
            text: 'Users'
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: 'New users'
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
