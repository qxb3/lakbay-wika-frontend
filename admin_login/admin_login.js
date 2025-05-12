const usernameInput = document.getElementById('username')
const passwordInput = document.getElementById('password')
const loginBtn = document.getElementById('login-btn')

loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value
  const password = passwordInput.value

  if (!username || !password) {
    loginBtn.textContent = 'Please enter username & password'
    loginBtn.style.backgroundColor = 'var(--err)'
    return
  }

  const response = await fetch(`http://localhost:4321/admin-login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
    method: 'POST'
  })

  const result = await response.text()

  if (response.status !== 200) {
    loginBtn.textContent = result
    loginBtn.style.backgroundColor = 'var(--err)'
    return
  }

  localStorage.setItem('admin', result)
  window.location.href = '/admin'
})
