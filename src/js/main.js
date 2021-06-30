window.addEventListener('DOMContentLoaded', () => {
     // TABS 
    const tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items'),
          tabs = tabsParent.querySelectorAll('.tabheader__item');

         
    function hideTabs(){
        tabsContent.forEach(content => {
            content.classList.remove('show', 'fade');
            content.classList.add('hide');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    };

    function showTab(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    };
    
    hideTabs();
    showTab();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;
        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((tab, i) => {
                if(tab === target){
                    hideTabs();
                    showTab(i);
                };
            });
        };
    });
    //TIMER
    const endTime = '2021-12-31';

    function getTimeRemaining(endtime){
        const total = Date.parse(endtime) - new Date(),
              days = Math.floor(total / (1000 * 60 * 60 * 24)),
              hours = Math.floor(total / (1000 * 60 * 60) % 24),
              minutes = Math.floor(total / (1000 * 60) % 60)
              seconds = Math.floor((total / 1000) % 60);
        
        return{
            total,
            days,
            hours,
            minutes,
            seconds
        }
    }

    function getZero(elem){
        if(elem >= 0 && elem < 10){
            return `0${elem}`;
        }else{
            return elem;
        }
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              interval = setInterval(updateClock, 1000);
        
        updateClock();

        function updateClock(){
            const time = getTimeRemaining(endtime);

            days.innerHTML = getZero(time.days);
            hours.innerHTML = getZero(time.hours);
            minutes.innerHTML = getZero(time.minutes);
            seconds.innerHTML = getZero(time.seconds);

            if(time.total <= 0){
                clearInterval(interval);
            }
        }
    }

    setClock('.timer', endTime);

    // MODAL WINDOW

    const modalTriggers = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalClose = modal.querySelector('[data-close]');

    function showModal(){
        modal.classList.toggle('show');
        document.body.style.overflow = 'hidden';
        clearInterval(openModalinterval);
        document.removeEventListener('scroll', scrollShowModal);
    }

    function hideModal(){
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    }

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', showModal);
    })

    modalClose.addEventListener('click', hideModal);

    modal.addEventListener('click', (event) => {
        if(event.target.classList.contains('modal')){
            hideModal();
        }
    })

    function scrollShowModal(){
        if(window.pageYOffset + document.documentElement.clientHeight === document.documentElement.scrollHeight){
            showModal();       
        }
    }

    document.addEventListener('scroll', scrollShowModal);

    const openModalinterval = setInterval(showModal, 15000);

    // MENU CARD 

    class MenuCard{
        constructor(src, alt, title, text, price, rate, parrent, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
            this.rate = rate;
            this.classes = classes;
            this.parrent = document.querySelector(parrent);
            this.convertToUAH();
        }

        convertToUAH(){
            return this.price = this.price * this.rate;
        }

        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.classes = "menu__item";
                element.classList.add(this.classes);
            }else{
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;

            this.parrent.append(element);
        }
    }
    // Временно !!!!
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        6,
        27.3,
        ".menu__field .container",
        // "menu__item"
    ).render();
    
    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        27.3,
        ".menu__field .container",
        "menu__item"
    ).render();
    
    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
        11,
        27.3,
        ".menu__field .container",
        "menu__item"
    ).render();
    // 

    // FORMS 

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка ...',
        success: 'Спасибо! Скоро мы с вами сяжемся',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(form => {
        postData(form);
    })

    function postData(form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');
            
            // request.setRequestHeader('Content-type', 'multipart/form-data');
            const formData = new FormData(form);

            request.send(formData);
            request.addEventListener('load', () => {
                if(request.status === 200){
                    statusMessage.textContent = message.success;
                    form.reset();

                    setTimeout(() => {
                        statusMessage.remove();
                    },2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            })
        })
    }
})

