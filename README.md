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
- src/styles/styles.scss — корневой файл стилей
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

## Компоненты модели
Была выбрана модель MVC при комбинации с брокером событий для некоторых взаимодействий view и model.

### Model
1. Интерфейс IProductList
Отвечает за получение, хранение и возврат по запросы активных продуктов
- init() - загружает ифнормацию о продуктах и сохраняет их у себя в переменной для последующего возврата. Должен вызываться из конструктора. Когда заканчивает создает событие, так как является асинхронным.
- getProduct(id: string): Product? - позволяет получать продукт если он есть (вызов событием)
- getProducts(filter?: ProductFilter): Product[] - позволяет получать список всех продуктов или только тех, которые подходят под фильтр (вызов контроллером)

2. Класс ProductListAPI implements IProductList
Класс реализующий интерфейс на основе взаимодействия с сервером по api

3. Абстрактный класс Order
Отвечает за обработку запроса платежа и выдачу ответа, хранение состояния заказа
- order: Set<string> - текущий список в корзине по id предметов
- productList: IProductList - объект, откуда брать информацию о товарах
- orderInfo: Partial<ProductOrderRequest> - информация о текущей заполненной информации для заказа
- makeOrder(order: ProductOrderRequest): Promise<ProductOrderResponse> - делает запрос и возвращает промис с ответом (вызов напрямую)
- init() - вызывается в конструкторе, подписывается на события
- addProduct(id: string) - добавляет продукт и проверяет, что в productList есть такой id (вызов событием)
- removeProduct(id: string) - убирает продукт (вызов событием)
- totalCost() - вычисляет суммарную цену заказа

4. Класс OrderAPI extends Order
Класс совершающй покупку на основе взаимодействия с сервером по api

### View
1. Абстрактный класс UIElement<T extends Object>
Базовый класс для всех отображаемых js элементов
- render(data?: T): HTMLElement - возвращает свой HTMLElement, где подставлено необходимое содержание из data
- update() - обновляет отображаемое содержимое, поддерживается только теми у кого экземпляр привязан к элементам на странице

2. Класс ModalWindowUI extends UIElement<ModalOpenInfo<any>>
Создает модальное окно, которое может отображать произвольное содержание
- container: HTMLElement - родитель для отобрадежения
- activeWindow: HTMLElement | undefined - существующий элемент модального окна в html
- openedObject: T | undefined - что сейсас открыто
- constructor(container: HTMLElement) - конструктор с передачей контейнера, где модальное окно должно лежать в html
- init() - вызывается к конструкторе, подписывается на соответствующие события
- close() - вызывается для закрытия окна (вызов напрямую)
- render(data: T): HTMLElement - создает окружение модального окна, ивенты на закрытия, ставит в содержимое результат data.object.render(), заполняет activeWindow и openedObject
- update() - вызывает openedObject.update() (вызов событием)
- preventInstaClose() - используется вместе с открытием/закрытием окна, чтобы не закрываться сразу же в ответ на событие, которое его открыло же (открытие через eventSystem, потом клик всплывает до document и закрывает его - эта функция правит баг)

3. Класс BasketViewUI extends UIElement<undefined>
Окно корзины, экземпляр корзины привязан к отображаемой единице, потому что нужно обновлять данные
- productListController: ProductListController - контроллер для вывода содержимого корзины
- render(): HTMLElement - создает корзину вместе с общей ценой и onClick
- update() - обновляет список продуктов и общую цену

5. Класс FormField extends UIElement<undefined>
Произвольное поле формы
- inputFields: InputFieldStat[] - информация о полях ввода
- buttonFields: ButtonFieldStat[] - информация о кнопках
- submitField: SubmitFieldStat - информация о кнопке submit
- используются вместе для конфигурации через конструктор экземпляра формы
- render(): HTMLElement - создает поля, пишет ссылки в inputFields, создает вызовы (update у себя на изменение значений)
- validate() - валидирует поля и активирует sumbit
- update() - вызывает validate, вызывается при input у inputFields

7. Класс OrderFinishUI extends UIElement<T extends UIElement>
- constructor(order: Order) - конструктор с заказом, к которому прикреплена UI
- render(): HTMLElement - вызывает выполнение заказа и создает окно с соответствующим ответу результатом

8. Класс ProductListUI extends UIElement<Product[]>
Отображает список продуктов UI методом, указанным в конструкторе.
- productUI: ProductUI - чем отображать продукт
- settings: ListSettings - настройки для контейнера списка
- constructor(productUI: ProductUI, settings: ListSettings)
- render(data: Product[]): HTMLElement - возвращает html

9. Абстрактный класс ProductUI extends UIElement<Product>
Абстрактный класс для отображения информации о продукте
- render(data: Product): HTMLElement - возвращает вид продукта, как html

10. Класс ProductOverviewUI extends ProductUI
Класс для отображения продукта, как на главной страничке

11. Класс ProductDetailedUI extends ProductUI
Класс для отображения продукта с деталями

12. Класс ProductBasketUI extends ProductUI
Класс для отображения продукта, как часть списка в корзине

### Controller
1. Класс ProductListController
Контроллер для связи источника продуктов, фильтра продуктов и нужного ui списком с нужным типом отображения продуктов
- constructor(filter: ProductFilter, productsSource: IProductList, productsList: ProductListUI, renderOn?: string) - получение компонентов и строка ивента, на который обновлять содержимое
- render(): HTMLElement - вызывает productsList.render() подставляя результат фильтра
- getFiltered(): Product[] - результат фильтра или то, что сейсас показывается в render

### Types
Некоторые из типов, используемые в проекте
- ProductFilter = (arg: Product) => boolean
- ListSettings - возможные настройки для списка
- InputValue = string | number
- InputFieldStat - для передачи информации о полях ввода
- ButtonFieldStat - для передачи информации о кнопках в форме
- SubmitFieldStat - для передачи информации о кнопке submit в форме
- ModalOpenInfo<T> - используется для передачи информации модальному окну для рендера
- defaultInputFieldStats: {[key: number]: ValidationFunction} - для значений по умолчанию различных типов полей ввода