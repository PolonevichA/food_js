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

    const openModalinterval = setInterval(showModal, 5000);
})