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
Интерфейс для данных о заказе
```
 export interface IOrder extends IOrderForm{
    items: IProduct[];
 }
 export type IOrderForm = IOrderContact & IOrderPay;
 ```
Интерфейс корзины
```
export interface IBasketPage {
	items: HTMLElement[];
	total: number;
	selected: string[];
}
 export interface IBasket {
	title: string;
	id: number;
	price: string | number;
}

export interface ISuccessForm {
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
```

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
Нужен для работы с DOM элементами. Класс является дженериком и принимает в переменной T тип данных, которые могут быть использованны для отображения.

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
- toggleClass - переключает классы.
- setText- устанавливает текстовое поле.
- setDisabled - меняет статус блокировки.
- setHidden - скрывает элемент.
- setVisible - показывает элемент.
- setImage - устанавливает изображение с альтернативным текстом.
- render - возвращает корневой DOM элемент.

#### Класс Model
Абстрактный класс модели данных, его наследником является класс AppContent.

Конструктор принимает следующие аргументы: 
- data: Partial<T> — представляет частичные данные модели типа T;
- events: IEvents — является объектом событий (IEvents) для уведомления об изменениях в модели.

Методы:
- emitChanges(event: string, payload?: object) - сообщает, что модель изменилась.
  
#### Класс AppContent 
Класс управления состоянием проекта (списка карточек, корзины, заказов и форм). Наследуется от класса Model.
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
- setCatalog() - определяет каталог карточек
- setPreview() - показ выбранной карточки
- handleBasket() - добавляет/удаляет карточку в/из корзины, исполузуя методы - addBasket()/deleteBasket()
- addBasket() - добавляет карточку в корзину
- deleteBasket() - удаляет карточку из корзины
- clearBasket()- очищает корзину полностью
- deleteFromBasket() - очищает корзину по конкретным лотам
- getBasketProduct - получает все заказанные карточки
- getTotal - пределяет стоимость корзины
- setOrderField- задаёт валидацию способа оплаты/адреса, телефон/почту используя методы validateOrderPay/validateOrderContact
- validateOrderPay - валидация способа оплаты/адреса
- validateOrderContact - - валидация телефона/почты


 ## Компоненты 

 1. Класс Page
 Формирование главной страницы. 

Имеет следующие поля:
- _counter - HTMLElement;
- _catalog- HTMLElement;
- _wrapper- HTMLImageElement;
- _basket - HTMLElement;

Конструктор принимаетследующий аргументы:
- constructor(container: HTMLElement, events: IEvents)

Методы:

- set counter - изменить счетчик товара в корзине на главной странице.
- set catalog - вывести список карточек.
- set locked - установка или снятие блока прокрутки страницы.
  
2. Класс Card 
Описание карточки товара.

Имеет следующие поля:
- _id - HTMLElement;
- _title - HTMLElement;
- _image - HTMLImageElement;
- _description - HTMLElement;
- _button - HTMLButtonElement;
- _category - HTMLElement;
- _price - HTMLElement;

Конструктор:
```
constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardEvent
) 
```
Методы:
- set id - устанавливает id товара.
- set category - принимает строку с сервера, устанавливает категорию.
- set title - принимает строку с сервера, устанавливает заголовок.
- set description - устанавливает описание товара.
- set image - принимает строку с сервера, устанавливает изображение.
- set price - принимает номер с сервера, устанавливает цену.
  
3.  Класс Bascet.   
Отвечает за работу с корзиной. 

Поля класса:
- _list - HTMLElement
- _total - TMLElement 
- _button - HTMLButtonElement
  
Конструктор принимает следующие аргументы:
- constructor(container: HTMLElement, protected events: EventEmitter) - принимает элемент DOM и событие

Методы класса:
- set total - устанавливает итоговую стоимость товаров в корзине
- set items - устанавливает содержимое корзины

4. Класс BasketItem.
Класс отражает информацию о товаре в корзине.

Поля класса:
- _id - HTMLElement 
- _title - HTMLElement 
- _price - HTMLElement 
- _button - HTMLButtonElement

Конструктор класса принимат следующие аргументы:
- constructor(container: HTMLElement, actions?: IClick) - принимает элемент DOM и действие над элементом корзины

Методы класса:
- set title - устанавливает название товара в корзине
- set id - устанавливает id товара в корзине
- set price - устанавливает стомости товара в корзине
  
5. Класс Form.
Класс представления базовой формы. Позволяет задать:

```
interface IFormState {
    valid: boolean;
    errors: string [];
}
```
- submit - кнопку отправки формы
- errors - блок отображения ошибок в форме

6. Класс OrderPay и OrderContact  
Класс описывает форму оплаты товара при оформлении заказа. 

- email - почта для связи
- phone - телефон для связи
- payment - способ оплаты
- address - адрес доставки


7. Класс Success
Класс представления, определяющий отображение основной информации об оформленном заказе.

Имеет следующие поля:
- _close - HTMLElement;
- _description - HTMLElement;
- _title - HTMLElement;

####  Класс для работы с API
 Класс ICardAPI.

Класс взаимодействия с конкретным API-сервером расширяет класс api. 

Реализует такие методы, как:
getCardItem - для чтения информации по конкретному лоту
getCardList - для чтения информации по всем доступным лотам
getOrderCard - оформления заказа через соответствующий запрос на сервер