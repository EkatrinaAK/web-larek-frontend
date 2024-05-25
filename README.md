# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start 
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных используемые в приложении

Интерфейс для карточки
```
export interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    select: boolean;  
}
```

Форма заказа 
```
export interface IOrder {
    items: string[];
    total: number;
}
```

Контактные данные 
```
export interface IOrderContact {
    email: string;
    phone: string
}
```

Интерфейс оплаты 
```
export interface IOrderPay {
  address: string;
	payment: string;
}
```
Интерфейс корзины
export interface IBasket {
	list: HTMLElement[];
	total: number;
}
```
Итерфейс главной страницы 
export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}
```
Интерфейс приложения
export interface IContent {
    catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
    formErrors: IFormErrors;
}

## Архитектура приложения
Код приложения разденен на слои согласно парадигме MVP:

- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранеие и изменение данных,
- презентер, отвечает за связь представления данных.
    
### Базовый код

#### Класс Api
Служит для взаимодействия с API запросами. В его методах реализовано выполнение GET и POST запросов.

Конструктор класса:
- constructor(baseUrl: string, options: RequestInit = {}) - принимает URL подключения к серверу и опции с запроса.

Методы класса:
- handleResponse - обрабатывает ответы сервера, преобразуя их в данные формата JSON или выдавая ошибки
- get - выполняет GET-запросы на сервер
- post - выполняет запрос с использованием предоставленого метода POST/PUT/DELETE

  
  #### Класс EventEmitter
Обеспечивает возможность установки и удаления слушателей для событий, а также вызов слушателей при возникновении этих событий.

Методы класса:
- on - устанавливает обработчик на событие
- off - сбрасывает обработчик с события
- emit - инициирует событие с данными
- onAll - устанавливает обработчик на все события
- offAll - сбрасывает обработчик на всех событиях
- trigger - устанавливает коллбэк-триггер, генерирующий заданное     событие при вызове
  
#### Класс Component
Абстрактный класс, нужен для работы с DOM элементами.

Кноструктор принимает один аргумент:
- container: HTMLElement — представляет корневой элемент.
  
От этого класса наследуют все классы отображения:
- Page;
- Card;
- Basket;
- Modal;
- Form;
- Success;

Имеет следующие методы:
- toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает классы.
- setText(element: HTMLElement, value: unknown) - устанавливает текстовое поле.
- setDisabled(element: HTMLElement, state: boolean) - меняет статус блокировки.
- setHidden(element: HTMLElement) - скрывает элемент.
- setVisible(element: HTMLElement) - показывает элемент.
- setImage(element: HTMLImageElement, src: string, alt?: string) - устанавливает изображение с альтернативным текстом.
- render(data?: Partial): HTMLElement - возвращает корневой DOM элемент.

#### Класс Model
Абстрактный класс модели данных, его наследником является класс AppContent.

Конструктор принимает следующие аргументы: 
- data: Partial<T> — представляет частичные данные модели типа T;
- events: IEvents — является объектом событий (IEvents) для уведомления об изменениях в модели.

Методы:
- emitChanges(event: string, payload?: object) - сообщает, что модель изменилась.
  
Класс AppContent - класс управления состоянием проекта (списка карточек, корзины, заказов и форм). Наследуется от класса Model.
```
export interface IContent {
  catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
  formErrors: IFormErrors;
}
```
Имеет следующие методы:
- setCatalog - устанавливает список карточек.
- setPreview - устанавливает предпросомотр карточек.
- addCardBasket - добавляет товар в заказ.
- setCardToBasket - добавляет товар в корзину.
- basketList - вернуть список товара в корзине.
- statusBasket - вернуть информацию по составу в корзине.
- total - вывести сумму заказа.
- getTotal - вернуть общую сумму заказов.
- deleteCardToBasket - удалить товар из корзины.
- setOrderField - Вывести данные введенные в поле доставки.
- setContactsField - Вывести данные введенные в поле контакты.
- validateOrder - Валидация введенных данных.
- validateContacts - Валидация введенных формы котактов.
- clearOrder - отчистка заказа.
 
 ## Компоненты 

 1. Класс Page - формирование главной страницы. 

Имеет следующие поля:
- _counter - HTMLElement;
- _catalog- HTMLElement;
- _wrapper- HTMLImageElement;
- _basket- HTMLElement;

Конструктор принимаетследующий аргумент:
- constructor(container: HTMLElement, events: IEvents)

Методы:

- set counter(value: number) - изменить счетчик товара в корзине на главной странице.
- set catalog(items: HTMLElement[]) - вывести список карточек.
- set locked(value: boolean) - установка или снятие блока прокрутки страницы.
  
2. Класс Card - описание карточки товара.

Имеет следующие поля:
- _title: HTMLElement;
- _image: HTMLImageElement;
- _description: HTMLElement;
- _button: HTMLButtonElement;
- _categoty: HTMLElement;
- _price: HTMLElement;

Конструктор:
```
constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardEvent
) 
```
Методы:
- set id(value: string) - устанавливает id товара.
- set category(value: string) - принимает строку с сервера, устанавливает категорию.
- set title(value: string) - принимает строку с сервера, устанавливает заголовок.
- set description(value: string | string[]) - устанавливает описание товара.
- set image(value: string) - принимает строку с сервера, устанавливает изображение.
- set price(value: number) - принимает номер с сервера, устанавливает цену.
  
3.  Класс Bascet.
   
Отвечает за работу с корзиной, отражает информацию по товарам в корзине, стоимости каждой единицы товара, дает возможность удалить товар из корзины, считает и показывает общую сумму заказа. Класс расширяется интерфейсом IBasket. 

Поля класса:
- _list: HTMLElement - DOM элемент списка товаров в корзине
- _total: HTMLElement - DOM элемент общей стоимости товаров в корзине
- _button: HTMLButtonElement - DOM элемент кнопки корзины оформления заказа
  
Конструктор принимает следующие аргументы:
- blockName - имя блока
- container- DOM элемент компонента корзины
- events - ссылка на менеджер событий для управления товарами в корзине

Методы класса:
- set total(price: number) - устанавливает итоговую стоимость товаров в корзине
- set list(items: HTMLElement[]) - устанавливает содержимое корзины
- toggleButton(isDisabled: boolean) - управляет блокировкой кнопки "оформить"


4. Класс ProductItemBasket.
   
Класс отражает информацию о товаре в корзине, его названии, стоимости и индексе. Расширяетсч интерфейсом IProductBascket.

Поля класса:
- _index: HTMLElement - DOM элемент индекса товара в корзине
- _title: HTMLElement - DOM элемент названия товара
- _price: HTMLElement - DOM элемент стоимости товара
- _button: HTMLButtonElement - DOM элемент кнопки удалить товар из корзины

Конструктор класса:
``````
constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: IBasketActions
	)
``````
Методы класса:
- set title(value: string) - устанавливает название товара в корзине
- set index(value: number) - устанавливает индекс товара в корзине
- set price(value: number) - устанавливает стомости товара в корзине
  
5. Класс Form.
   
Этот класс позволяет создавать и управлять формами на веб-странице, обрабатывать ввод данных, валидировать форму и обновлять состояние формы и ее элементы в зависимости от введенных данных и ошибок валидации.

Конструктор класса:
- constructor(container: HTMLFormElement, events: IEvents) - конструктор класса, который инициализирует компонент формы, получая контейнер формы и объект событий events. В конструкторе устанавливаются обработчики событий на изменение полей формы и отправку формы.

Методы класса:
- protected onInputChange(field: keyof T, value: string) - защищенный метод, который вызывается при изменении значения поля ввода формы. Он генерирует событие с информацией о поле и его значении;
- set valid(value: boolean) - метод для установки состояния валидности формы;
- set errors(value: string) - метод для установки текста ошибок валидации формы;
- render(state: Partial<T> & IFormState) - метод для отображения состояния формы.
  
6. Класс Success.
   
Этот класс позволяет создавать и управлять успешными сообщениями или состояниями на веб-странице, и предоставляет возможность закрыть сообщение путем клика на соответствующий элемент.

Конструктор класса:
- constructor(container: HTMLElement, actions: ISuccessEvent) - конструктор класса, который инициализирует компонент успешного сообщения, получая контейнер сообщения и объект действий (actions). В конструкторе устанавливается обработчик события клика на элемент закрытия сообщения.
  
Методы сласса:
- set title(value: string) - метод для установки заголовка;
- set description(value: string) - метод для установки описания.

7. Класс OrderPay. 
   
Класс описывает форму оплаты товара при оформлении заказа. Класс наследуется от базового класса Form и расширяется интерфейсом IOrderPay. 

Поля класса:
- _card: HTMLButtonElement - DOM элемент оплаты заказа картой
- _cash: HTMLButtonElement - DOM элемент оплаты заказа при получении
- _address: HTMLInputElement - DOM элемент адреса доставки

Конструктор класса:
- blockName string - имя блока
- container: HTMLFormElement - элемент формы оплаты
- events: IEvents - ссылка на менеджер событий

Метод класса:
-clear()- удаляет информацию из полей формы

8. Класс OrderContact.
   
Класс описывает форму ввода контактных данных. Класс наследуется от базового класса Form и расширяется интерфейсом IOrderContact. 

Конструктор класса:
- container: HTMLFormElement - DOM элемент формы с контактными данными
events - ссылка на менеджер событий

Метод класса:
- clear()- удаляет информацию из полей формы

####  Класс для работы с API
 Класс ICardAPI.

Класс взаимодействия с конкретным API-сервером расширяет класс api. 

Реализует такие методы, как:
getCardItem - для чтения информации по конкретному лоту
getCardList - для чтения информации по всем доступным лотам
getOrderCard - оформления заказа через соответствующий запрос на сервер
