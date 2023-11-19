const API_URL = 'https://api.quotable.io/random'
const quoteContainer = document.getElementById('words_container')
const userInput = document.getElementById('word_input')
const refreshBtn = document.getElementById('refresh')
const timer = document.getElementById('timer')
const result = document.getElementsByClassName('result')[0]

let isTimeRunning = false
let startTime = null
let timeoutId = null
let charCount = 0

userInput.addEventListener('input', () => {
    if (!isTimeRunning) {
        isTimeRunning = true
        startTime = new Date()
        startTimer()
        result.innerText = ''
    }

    const quoteArr = quoteContainer.querySelectorAll('span')
    const inputArr = userInput.value.split('')
    quoteArr.forEach((charSpan, index) => {
        const character = inputArr[index]
        if (character == null) {
            charSpan.classList.remove('correct')
            charSpan.classList.remove('incorrect')
        } else if (character == charSpan.innerText) {
            charSpan.classList.add('correct')
            charSpan.classList.remove('incorrect')
        } else {
            charSpan.classList.remove('correct')
            charSpan.classList.add('incorrect')
        }
    })
    if (inputArr.length > quoteArr.length) {
        // after completed quote adding character count
        quoteArr.forEach((charSpan, index) => {
            const character = inputArr[index]
            if (character == charSpan.innerText && character != ' ') {
                charCount++
            }
        })
        renderQuote()
    }
})

function startTimer() {
    timeoutId = setInterval(() => {
        let time = Math.floor(60 - ((new Date() - startTime) / 1000))
        timer.innerText = `0:${time.toString().padStart(2, '0')}`
        if (time <= 0) {
            // caculating correctly typed characters when time ends
            const quoteArr = quoteContainer.querySelectorAll('span')
            quoteArr.forEach(span => {
                if (span.classList.contains('correct')) {
                    charCount++
                }
            });
            // time ended clearing values
            isTimeRunning = false
            clearInterval(timeoutId)
            timeoutId = null
            startTime = null
            timer.textContent = '1:00'
            let wpm = Math.floor(charCount / 6)
            result.innerText = `Your typing speed is ${wpm} WPM`
            console.log(`Your typing speed is ${wpm} WPM`)
            userInput.readOnly = true
            setTimeout(() => {
                userInput.readOnly = false
                renderQuote()
            }, 5000);
        }
    }, 1000);
}

refreshBtn.addEventListener('click', () => {
    location.reload()
})


function getRandomQuote() {
    return fetch(API_URL).then(res => res.json()).then(data => data.content)
}

async function renderQuote() {
    const quote = await getRandomQuote()
    quoteContainer.innerHTML = ''
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.innerText = char
        quoteContainer.appendChild(charSpan)
    });
    userInput.value = ''
}

renderQuote()