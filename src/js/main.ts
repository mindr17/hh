type envType = 'local' | 'vds' | 'github';

const env: envType = 'local';

let url: string = '';

if (env === 'local') {
  url = 'http://localhost:3000/api/vacancy';
} else if (env === 'github'){
  url = '';
}

const optionBtnOrder = document.querySelector('.option__btn_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionListOrder = document.querySelector('.option__list_order');
const optionListPeriod = document.querySelector('.option__list_period');

const topCityBtn = document.querySelector('.top__city');
const city = document.querySelector('.city');
const cityClose = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');

const overlayVacancy = document.querySelector('.overlay_vacancy');
const resultList = document.querySelector('.result__list');

const formSearch: any =  document.querySelector('.bottom__search');

// возвращает число и слово
const declOfNum = (n, titles) => { return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
  0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
};

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

const getData = ({search, id}: any = {}): Promise<object> => {
  if (search) {
    return fetch(`${url}?search=${search}`).then(response => response.json());
  }
  return fetch(`${url}/${id ? id : ''}`).then(response => response.json());
}

const updateVacanciesListTitle = (vacanciesCount?: number, searchString?: string): void => {
  const found = document.querySelector('.found');
  found.textContent = '';
  if (searchString) {
    const wordsArr = ['вакансия', 'вакансии', 'вакансий'];
    const vacanciesString = declOfNum(vacanciesCount, wordsArr);
    found.appendChild(document.createTextNode(`${vacanciesString} «`));
    const foundItem = document.createElement('span');
    foundItem.classList.add('found__item');
    foundItem.textContent = searchString;
    found.appendChild(foundItem);
    found.appendChild(document.createTextNode(`»`));
  } else {
    found.textContent = 'Любой текст, который вы там хотели бы видеть';
  }
}
updateVacanciesListTitle();

const optionHandler = (): void => {
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
};

const cityHandler = (): void => {
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
};

const createModal = (data: any): any => {
  const {
    address,
    compensation,
    country,
    description,
    employer,
    employment,
    experience,
    skills,
    title,
  } = data;

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const closeButtonElem = document.createElement('button');
  closeButtonElem.classList.add('modal__close');
  closeButtonElem.textContent = 'x';
  
  const titleElem = document.createElement('h2');
  titleElem.classList.add('modal__title');
  titleElem.textContent = title;

  const compensationElem = document.createElement('p');
  compensationElem.classList.add('modal__compensation');
  compensationElem.textContent = compensation;

  const employerElem = document.createElement('p');
  employerElem.classList.add('modal__employer');
  employerElem.textContent = employer;

  const addressElem = document.createElement('p');
  addressElem.classList.add('modal__address');
  addressElem.textContent = address;

  const experienceElem = document.createElement('p');
  experienceElem.classList.add('modal__experience')
  experienceElem.textContent = experience;
  
  const employmentElem = document.createElement('p');
  employmentElem.classList.add('modal__employment');
  employmentElem.textContent = employment;
  
  const descriptionElem = document.createElement('p');
  descriptionElem.classList.add('modal__description');
  descriptionElem.textContent = description;

  const skillsElem = document.createElement('div');
  skillsElem.classList.add('modal__skills', 'skills');

  const skillsTitleElem = document.createElement('h3');
  skillsTitleElem.classList.add('skills__title');

  const skillsListElem = document.createElement('ul');
  skillsListElem.classList.add('skills__list');

  for (const skill of skills) {
    const skillsItemElem = document.createElement('li');
    skillsItemElem.classList.add('skills__item');
    skillsItemElem.textContent = skill;
    skillsListElem.append(skillsItemElem);
  }

  skillsElem.append(skillsTitleElem, skillsListElem);

  const submutButtonElem = document.createElement('button');
  submutButtonElem.classList.add('modal__response');
  submutButtonElem.textContent = 'Отправить резюме';

  modal.append (
    closeButtonElem,
    titleElem,
    compensationElem,
    employerElem,
    addressElem,
    experienceElem,
    employmentElem,
    descriptionElem,
    skillsElem,
    submutButtonElem,
  );

  return modal;
}

const modalHandler = (): void => {
  let modal = null;
  resultList.addEventListener('click', async (event): Promise<void> => {
    const target = event.target as HTMLElement;
    if (target.dataset.vacancy) {
      event.preventDefault();
      overlayVacancy.classList.add('overlay_active');
      const data = await getData({id: target.dataset.vacancy});
      modal = createModal(data);
      overlayVacancy.append(modal);
    }
  });

  overlayVacancy.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target === overlayVacancy || target.classList.contains('modal__close')) {
      overlayVacancy.classList.remove('overlay_active');
      modal.remove();
    }
  });
};

const searchHandler = (): void => {
  formSearch.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textSearch: string = formSearch.search.value;
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
}

const init = async (): Promise<void> => {
  const data = await getData();
  console.log(data);
  renderCards(data);
  
  optionHandler();
  cityHandler();
  modalHandler();
  searchHandler();
}
init();