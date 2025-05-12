(async () => {
  if (!localStorage.getItem('user')) {
    const uuidResp = await fetch('http://localhost:4321/request-uuid')
    const uuid = await uuidResp.text()

    if (uuidResp.status !== 200) {
      console.error(uuidResp)
      return
    }

    localStorage.setItem('user', uuid)
  }
})()
