let score = 0
const holes = document.querySelectorAll('li'),
    app = document.getElementById('app'),
    prizeSpan = document.querySelectorAll('.prizeSpan'),
    startBtn = document.getElementById('startBtn'),
    krots = document.getElementById('krots'),
    prize = 'Текст награды',
    descriptions = document.querySelectorAll('.description'),
    form = document.getElementById('form'),
    startContainer = document.getElementById('start'),
    parentName = document.getElementById('name'),
    parentPhone = document.getElementById('tel'),
    data = {};

const changeHoleToKrot = (Hole) => {
    holes[Hole].querySelector('img').setAttribute('src', './assets/img/krot.svg');
    holes[Hole].dataset.action = 'krot'
}


const changeKrotToHole = (krot) => {
    krot.querySelector('img').setAttribute('src', './assets/img/hole.svg');
    krot.dataset.action = 'hole'
}

const win = () => {
    prizeSpan.forEach((prizeSpan) => {
        prizeSpan.innerHTML = prize
    })
    krots.classList.add('finished')

    descriptions.forEach((descriptions) => {
        descriptions.remove()
    })

    form.classList.remove('hidden')
    startContainer.remove();
}

function spawnKrot(score) {
    if (score < 5) {
        setTimeout(() => {
            let choose = ~~(Math.random() * (6 - 0) + 0);
            changeHoleToKrot(choose)
        }, 1000)
    }
}

function start() {
    startBtn.classList.add("disabled");
    spawnKrot(score)
}

holes.forEach(function (krot) {
    krot.addEventListener('click', function (event) {
        if (event.target.dataset.action === 'krot') {
            changeKrotToHole(event.target)
            score++
            if (score === 5 ? win() : spawnKrot(score))
                console.log(score);
        } else {
            return
        }
    })
})

function sendToPhp() {
    data['prize'] = prize;
    data['parent_name'] = parentName.value;
    data['parent_phone'] = parentPhone.value;



    let url = new URL(window.location.href);
    let utm_source = null
    let utm_medium = null
    let utm_campaign = null
    let utm_content = null
    let utm_term = null

    let params = new URLSearchParams(decodeURIComponent(url.search))

    if (params.get("utm_source")) {
        utm_source = params.get("utm_source")
    }
    if (params.get("utm_medium")) {
        utm_medium = params.get("utm_medium")
    }
    if (params.get("utm_campaign")) {
        utm_campaign = params.get("utm_campaign")
    }
    if (params.get("utm_content")) {
        utm_content = params.get("utm_content")
    }
    if (params.get("utm_term")) {
        utm_term = params.get("utm_term")
    }


    const formData = new FormData();

    // добавляем нашу data в formData
    for (let key in data) {
        if (key === "parentPhone") {
            formData.append(key, formatPhone(data[key]));
        } else {
            formData.append(key, data[key]);
        }
    }

    formData.append('utm_source', utm_source)
    formData.append('utm_medium', utm_medium)
    formData.append('utm_campaign', utm_campaign)
    formData.append('utm_content', utm_content)
    formData.append('utm_term', utm_term)


    const inputData = {};
    formData.forEach((val, key) => {
        inputData[key] = val
    })


    fetch("[ссылка на создание лида]", {
        method: "POST",
        // mode: "no-cors",
        body: formData,
    })
    console.log('запрос отправился')

    let params_url = new URLSearchParams(url.search.slice(1));
    let source = params_url.get('utm_source'),
        medium = params_url.get('utm_medium'),
        campaign = params_url.get('utm_campaign'),
        content = params_url.get('utm_content'),
        term = params_url.get('utm_term'),
        phone = data['parent_phone'].replace(/[^0-9]/g, '');

    let utms = '?';
    if (source) utms += 'utm_source=' + source + '&';
    if (medium) utms += 'utm_medium=' + medium + '&';
    if (campaign) utms += 'utm_campaign=' + campaign + '&';
    if (content) utms += 'utm_content=' + content + '&';
    if (term) utms += 'utm_term=' + term + '&';
    if (phone) utms += 'phone=' + phone + '&';

    window.parent.location.href = "[Ссылка на страницу после отправки формы]" + utms;
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    sendToPhp();
});