type envType = 'local' | 'vds' | 'github';

const env: envType = 'local';

let url: string = '';

if (env === 'local') {
  url = 'http://localhost:3000/api/vacancy';
} else if (env === 'github'){
  url = '';
}

// Выпадающие списки

const optionBtnOrder = document.querySelector('.option__btn_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionListOrder = document.querySelector('.option__list_order');
const optionListPeriod = document.querySelector('.option__list_period');

optionBtnOrder.addEventListener('click', (e) => {
    optionListOrder.classList.toggle('option__list_active');
    optionListPeriod.classList.remove('option__list_active');
});

optionBtnPeriod.addEventListener('click', (e) => {
    optionListPeriod.classList.toggle('option__list_active');
    optionListOrder.classList.remove('option__list_active');
});

optionListOrder.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('option__item')) {
        optionBtnOrder.textContent = target.textContent;
        optionListOrder.classList.remove('option__list_active');
        for (const elem of optionListOrder.querySelectorAll('.option__item')) {
            if (elem === target) {
                elem.classList.add('option__item_active');
            } else {
                elem.classList.remove('option__item_active');
            }
        }
    }
});

optionListPeriod.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('option__item')) {
        optionBtnPeriod.textContent = target.textContent;
        optionListPeriod.classList.remove('option__list_active');
        for (const elem of optionListPeriod.querySelectorAll('.option__item')) {
            if (elem === target) {
                elem.classList.add('option__item_active');
            } else {
                elem.classList.remove('option__item_active');
            }
        }
    }
});

// Выбор города

const topCityBtn = document.querySelector('.top__city');
const city = document.querySelector('.city');
const cityClose = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');

topCityBtn.addEventListener('click', () => {
    city.classList.toggle('city_active');
})

cityRegionList.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('city__link')) {
        topCityBtn.textContent = target.textContent;
        city.classList.remove('city_active');
    }
    
});

document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target === cityClose) {
        city.classList.remove('city_active');
    }
});
// Модальное окно

const overlayVacancy = document.querySelector('.overlay_vacancy');
const resultList = document.querySelector('.result__list');

resultList.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    if (target.dataset.vacancy) {
        event.preventDefault();
        overlayVacancy.classList.add('overlay_active');
    }
});

overlayVacancy.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === overlayVacancy || target.classList.contains('modal__close')) {
        overlayVacancy.classList.remove('overlay_active');
    }
})

// Вывод карточек

const createCard = (vacancy) => {

  const {
    title,
    id, 
    compensation, 
    workSchedule, 
    employer,
    address,
    description,
    date,
   } = vacancy;

  const card = document.createElement('li');
  card.classList.add('result__item');

  card.insertAdjacentHTML('afterbegin', `
    <li class="result__item">
      <article class="vacancy">
      <h2 class="vacancy__title">
          <a class="vacancy__open-modal" href="#" data-vacancy="${id}">${title}</a>
      </h2>
      <p class="vacancy__compensation">${compensation}</p>
      <p class="vacancy__work-schedule">${workSchedule}</p>
      <div class="vacancy__employer">
          <p class="vacancy__employer-title">${employer}</p>
          <p class="vacancy__employer-address">${address}</p>
      </div>
      <p class="vacancy__description">${description}</p>
      <p class="vacancy__date">
          <time datetime="${date}">${date}</time>
      </p>
      <div class="vacancy__wrapper-btn">
          <a class="vacancy__response vacancy__open-modal" href="#" data-vacancy="${id}">Откликнуться</a>
          <button class="vacancy__contacts">Показать контакты</button>
      </div>
      </article>
    </li>
    `);

    return card;
};

const renderCards = (data) => {
  resultList.textContent = '';
  const cards = data.map(createCard);
  resultList.append(...cards);
};

const getData = ({search}: any = {}): Promise<object> => {
  if (search) {
    return fetch(`${url}?search=${search}`).then(response => response.json());
  }
  return fetch(url).then(response => response.json());
}

const formSearch: any =  document.querySelector('.bottom__search');


formSearch.addEventListener('submit', async (e) => {
  e.preventDefault();
  const textSearch: string = formSearch.search.value;
  
  const updateVacanciesListTitle = (vacanciesCount: number, searchString: string): void => {
    const found = document.querySelector('.found');
    found.textContent = '';
    found.appendChild(document.createTextNode(`${vacanciesCount} вакансий «`));
    const foundItem = document.createElement('span');
    foundItem.classList.add('found__item');
    foundItem.textContent = searchString;
    found.appendChild(foundItem);
    found.appendChild(document.createTextNode(`»`));
  }

  if (textSearch.length > 2) {
    formSearch.search.style.borderColor = '';
    const data = await getData({search: textSearch});
    updateVacanciesListTitle(Object.keys(data).length, textSearch);
    renderCards(data);
    formSearch.reset();
  } else {
    formSearch.search.style.borderColor = 'red';
    setTimeout(() => {
      formSearch.search.style.borderColor = '';
    }, 2000);
  }
});

const init = async (): Promise<any> => {
  const data = await getData();
  console.log(data);
  renderCards(data);
}
init();