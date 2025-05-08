const emailInput = document.getElementById('email-input')
const feedbackInput = document.getElementById('feedback-input')
const sendBtn = document.getElementById('send-btn')

sendBtn.addEventListener('click', () => {
    if (!emailInput.value) {
        sendBtn.textContent = 'Please enter your email'
        return
    }

    if (!feedbackInput.value) {
        sendBtn.textContent = 'Please enter your feedback'
        return
    }

    const subject = encodeURIComponent("Feedback");
    const body = encodeURIComponent(feedbackInput.value);
    window.location.href = `mailto:${emailInput.value}?subject=${subject}&body=${body}`;
})
