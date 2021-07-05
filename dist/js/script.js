window.addEventListener('DOMContentLoaded', () => {
  // TABS 
  const tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items'),
    tabs = tabsParent.querySelectorAll('.tabheader__item');


  function hideTabs() {
    tabsContent.forEach(content => {
      content.classList.remove('show', 'fade');
      content.classList.add('hide');
    });

    tabs.forEach(tab => {
      tab.classList.remove('tabheader__item_active');
    });
  };

  function showTab(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  };

  hideTabs();
  showTab();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, i) => {
        if (tab === target) {
          hideTabs();
          showTab(i);
        };
      });
    };
  });
  //TIMER
  const endTime = '2021-12-31';

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - new Date(),
      days = Math.floor(total / (1000 * 60 * 60 * 24)),
      hours = Math.floor(total / (1000 * 60 * 60) % 24),
      minutes = Math.floor(total / (1000 * 60) % 60)
    seconds = Math.floor((total / 1000) % 60);

    return {
      total,
      days,
      hours,
      minutes,
      seconds
    }
  }

  function getZero(elem) {
    if (elem >= 0 && elem < 10) {
      return `0${elem}`;
    } else {
      return elem;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      interval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const time = getTimeRemaining(endtime);

      days.innerHTML = getZero(time.days);
      hours.innerHTML = getZero(time.hours);
      minutes.innerHTML = getZero(time.minutes);
      seconds.innerHTML = getZero(time.seconds);

      if (time.total <= 0) {
        clearInterval(interval);
      }
    }
  }

  setClock('.timer', endTime);

  // MODAL WINDOW

  const modalTriggers = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  function showModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(openModalinterval);
    document.removeEventListener('scroll', scrollShowModal);
  }

  function hideModal() {
    modal.classList.remove('show');
    modal.classList.add('hide');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', showModal);
  })

  modal.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal') || event.target.getAttribute('data-close') == '') {
      hideModal();
    }
  })

  function scrollShowModal() {
    if (window.pageYOffset + document.documentElement.clientHeight === document.documentElement.scrollHeight) {
      showModal();
    }
  }

  document.addEventListener('scroll', scrollShowModal);

  const openModalinterval = setInterval(showModal, 50000);

  // MENU CARD 

  class MenuCard {
    constructor(img, alt, title, text, price, rate, parrent, ...classes) {
      this.img = img;
      this.alt = alt;
      this.title = title;
      this.text = text;
      this.price = price;
      this.rate = rate;
      this.classes = classes;
      this.parrent = document.querySelector(parrent);
      this.convertToUAH();
    }

    convertToUAH() {
      return this.price = (this.price * this.rate).toFixed(2);
    }

    render() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.classes = "menu__item";
        element.classList.add(this.classes);
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }
      element.innerHTML = `
             <img src=${this.img} alt=${this.alt}>
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
  
  const getResource = async (url) => {
    const res = await fetch(url);

    if(!res.ok){
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    };

    return await res.json();
  };

  getResource('http://localhost:3000/menu')
    .then(data => {
      data.forEach(({img, altimg, title, descr, price, rate}) => {
        new MenuCard(img, altimg, title, descr, price, rate, ".menu__field .container").render();
      })
    });

  // FORMS 

  const forms = document.querySelectorAll('form');

  const message = {
    loading: './img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами сяжемся',
    failure: 'Что-то пошло не так...'
  }

  forms.forEach(form => {
    BindPostData(form);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-type': 'application/json'
      },
      body: data,
    });

    return await res.json();
  }

  function BindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('img');
      statusMessage.classList.add('modal__status-loading')
      statusMessage.src = message.loading;
      form.append(statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData('http://localhost:3000/requests', json)
        .then(data => {
          showThanksModal(message.success);
          console.log(data);
          statusMessage.remove();
        }).catch(() => {
          showThanksModal(message.failure);
        }).finally(() => {
          form.reset();
        })
    })
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    prevModalDialog.classList.add('hide');

    showModal();

    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
         <div class="modal__content">
             <div data-close class="modal__close">&times;</div>
             <div class="modal__title">${message}</div>
         </div>
     `;

    document.querySelector('.modal').append(thanksModal);

    setTimeout(() => {
      thanksModal.remove();
      hideModal();
      prevModalDialog.classList.remove('hide');
    }, 4000);
  }

  fetch('../db.json')
    .then(data => data.json())
    .then(res => console.log(res))
})