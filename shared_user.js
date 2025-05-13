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

window.logTranslation = async (userId, inputType, dialect, success, error) => {
  const res = await fetch(`http://localhost:4321/log-translation?userid=${encodeURIComponent(userId)}&inputType=${inputType}&dialect=${encodeURIComponent(dialect)}&success=${encodeURIComponent(success)}&error=${encodeURIComponent(error)}`, {
    method: 'POST'
  })

  if (res.status === 200) {
    console.log(`Translation log: ${userId}, ${inputType}, ${dialect}, ${success}, ${error}`)
  }
}
