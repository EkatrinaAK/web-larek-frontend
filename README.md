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

Карточка
```
export interface ICard{
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
    address: string;
    payment: string;
    email: string;
    phone: string;
}
```

Контактные данные 
```
export type IOrderContact = Pick <IOrder, 'email'| 'phone'>;
```

Интерфейс оплаты 
```
export type IOrderPay = Pick <IOrder, 'address'|'payment'>;
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

handleResponse - обрабатывает ответы сервера, преобразуя их в данные формата JSON или выдавая ошибки
get - выполняет GET-запросы на сервер
post - выполняет запрос с использованием предоставленого метода POST/PUT/DELETE

  
  #### Класс EventEmitter
Обеспечивает возможность установки и удаления слушателей для событий, а также вызов слушателей при возникновении этих событий.

Методы класса:

- on - устанавливает обработчик на событие
- off - сбрасывает обработчик с события
- emit - инициирует событие с данными
- onAll - устанавливает обработчик на все события
- offAll - сбрасывает обработчик на всех событиях
- trigger - устанавливает коллбэк-триггер, генерирующий заданное     событие при вызове
  
####
