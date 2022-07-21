const images = [
    'https://picsum.photos/id/100/700/373',
    'https://picsum.photos/id/200/700/373',
    'https://picsum.photos/id/352/700/373',
    'https://picsum.photos/id/434/700/373',
    'https://picsum.photos/id/522/700/373',
    'https://picsum.photos/id/666/700/373',
    'https://picsum.photos/id/777/700/373',
    'https://picsum.photos/id/800/700/373',
    'https://picsum.photos/id/900/700/373',
    'https://picsum.photos/id/999/700/373',
]

//Element
const slidesEl = document.querySelector('.slides')
const paginationEl = document.querySelector('.pagination')
//Tem
const slideTemplate = document.getElementById('slide-template')
const paginationBulletTemplate = document.getElementById('pagination-bullet-template')

//next-prev
const nextBtn = document.querySelector('.next-btn')
const prevBtn = document.querySelector('.prev-btn')

const Slider = {
    slides: [],
    setting: {
        cooldownTime: 0,
        slidingDuration: 300,
        autoSlidingTime: 5000,
        setCooldownTime(cooldownTime){
            this.cooldownTime = cooldownTime*1
        },
        setSlidingDuration(slidingDuration){
            this.slidingDuration = slidingDuration*1
        },
        setAutoSlidingTime(autoSlidingTime){
            this.autoSlidingTime = autoSlidingTime*1
            Slider.autoSliding.reset()
        },
    },
    slideNumber: null,
    lastSlide: null,
    numberOfSlides: null,
    pagination: {
        init() {
            paginationEl.innerHTML = ''
            //use .firstElementChild to Avoiding DocumentFragment pitfall
            //https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template#avoiding_documentfragment_pitfall
            for (let i = 0; i < Slider.numberOfSlides; i++) {
                const bulletEl = paginationBulletTemplate.content.firstElementChild.cloneNode(true)
                bulletEl.addEventListener('click', () => Slider.changeSlide(i))
                paginationEl.append(bulletEl)
            }
            this.update()
        },
        update() {
            const realSlideNumber = (Slider.slideNumber + Slider.numberOfSlides) % Slider.numberOfSlides
            const pagination = [...paginationEl.children]
            pagination.forEach(bullet => bullet.classList.remove("pagination-bullet-active"))
            pagination[realSlideNumber].classList.add("pagination-bullet-active")
        }
    },
    autoSliding: {
        counter: null,
        on() {
            this.counter = setInterval(Slider.nextSlide, Slider.setting.autoSlidingTime)
        },
        off() {
            clearInterval(this.counter)
        },
        reset(){
            this.off()
            this.on()
        }
    },
    init(images) {
        this.slides  = [...images, ...images, ...images]
        this.lastSlide = images.length-1
        this.numberOfSlides = images.length
        this.render()
        this.pagination.init()
        this.autoSliding.reset()
    },
    render() {
        slidesEl.innerHTML=''
        this.slides.forEach(slide => {
            const slideLi = slideTemplate.content.cloneNode(true)
            slideLi.querySelector('[data-image]').src = slide
            slidesEl.append(slideLi)
        })
        slidesEl.style.width = `${this.numberOfSlides*3 * 100}%`
    },
    moveSlidesElement(duration = this.setting.slidingDuration) {
        const marginValue = Slider.slideNumber * 100 * -1
        slidesEl.style.transitionDuration = duration + 'ms'
        slidesEl.style.marginLeft = `${marginValue}%`
    },
    nextSlide() {
        Slider.slideNumber++
        Slider.moveSlidesElement()
        Slider.pagination.update()
        Slider.cooldownOn()
        const isEndLast = Slider.slideNumber >= Slider.numberOfSlides
        if (!isEndLast) return
        Slider.slideNumber = 0
        setTimeout(Slider.moveSlidesElement, Slider.setting.slidingDuration, 0)
    },
    prevSlide() {
        Slider.slideNumber--
        Slider.moveSlidesElement()
        Slider.pagination.update()
        Slider.cooldownOn()
        const isEndFirst = Slider.slideNumber < 0
        if (!isEndFirst) return 
        Slider.slideNumber = Slider.lastSlide
        setTimeout(Slider.moveSlidesElement, Slider.setting.slidingDuration, 0)
    },
    cooldownOn() {
        nextBtn.disabled = true
        prevBtn.disabled = true
        this.autoSliding.reset()
        setTimeout(() => {
            nextBtn.disabled = false
            prevBtn.disabled = false
        }, this.setting.slidingDuration + this.setting.cooldownTime)
    },
    changeSlide(number) {
        this.slideNumber = number
        this.moveSlidesElement()
        Slider.pagination.update()
    },
}

nextBtn.addEventListener('click', Slider.nextSlide)
prevBtn.addEventListener('click', Slider.prevSlide)

//main
Slider.init(images.slice(0, 5))


//setting
const numberOfSlideInput = document.querySelector('#number-of-slide')
const slidingDurationInput = document.querySelector('#sliding-duration')
const cooldownTimeInput = document.querySelector('#cooldown-time')
const autoSlidingTimeInput = document.querySelector('#auto-sliding-gap')
const saveSettingBtn = document.querySelector('.setting-save')

function changeNumOfImage(value){
    Slider.init(images.slice(0, value))
}

function saveSetting(){
    const numberOfSlide = numberOfSlideInput.value
    const slidingDuration = slidingDurationInput.value
    const cooldownTime = cooldownTimeInput.value
    const autoSlidingTime = autoSlidingTimeInput.value
    changeNumOfImage(numberOfSlide)
    Slider.setting.setSlidingDuration(slidingDuration)
    Slider.setting.setCooldownTime(cooldownTime)
    Slider.setting.setAutoSlidingTime(autoSlidingTime)
}
saveSettingBtn.addEventListener('click', saveSetting)

