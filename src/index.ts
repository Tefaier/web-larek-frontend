import { Api } from './components/base/api';
import { AppData } from './components/base/appData';
import { EventEmitter, eventNames } from './components/base/events';
import { ProductListController } from './components/controller/productList';
import { OrderApi } from './components/model/order';
import { ProductListAPI } from './components/model/productList';
import { BasketViewUI } from './components/view/basket';
import { FormField } from './components/view/form';
import { ModalWindowUI } from './components/view/modal';
import { OrderFinishUI } from './components/view/orderFinish';
import { ProductBasketUI, ProductListUI, ProductOverviewUI } from './components/view/products';
import './scss/styles.scss';
import { ButtonFieldStat, defaultInputFieldStats, InputFieldStat, SubmitFieldStat } from './types';
import { API_URL } from './utils/constants';

const eventSystem = new EventEmitter();
AppData.eventSystem = eventSystem;

const api = new Api(API_URL);
const productListApi = new ProductListAPI(api);
const order = new OrderApi(api, productListApi);

const modalContainet = document.querySelector("#modal-container") as HTMLElement;
const modal = new ModalWindowUI(modalContainet);

const successTempate = document.querySelector("#success") as HTMLTemplateElement;
const orderFinish = new OrderFinishUI(order);

const inputFields2: InputFieldStat[] = [
    {
        type: "string",
        validation: defaultInputFieldStats[0],
        onInput: (form, value) => {
            order.orderInfo.address = value;
            form.update();
        },
        locateQuery: "input[name='email']"
    },
    {
        type: "string",
        validation: defaultInputFieldStats[3],
        onInput: (form, value) => {
            order.orderInfo.phone = value;
            form.update();
        },
        locateQuery: "input[name='phone']"
    }
];
const buttonFields2: ButtonFieldStat[] = []
const form2Template = document.querySelector("#contacts") as HTMLTemplateElement;
const form2Submit: SubmitFieldStat = {
    onSubmit: () => {
        eventSystem.emit(eventNames.openModal as string, {object: orderFinish});
    },
    locateQuery: "button[type='submit']"
}
const form2 = new FormField(inputFields2, buttonFields2, form2Template, form2Submit);

const inputFields1: InputFieldStat[] = [
    {
        type: "string",
        validation: defaultInputFieldStats[0],
        onInput: (form, value) => {
            order.orderInfo.address = value;
            form.update();
        },
        locateQuery: "input[name='address']"
    }
];
const buttonFields1: ButtonFieldStat[] = [
    {
        validation: () => {
            if (order.orderInfo.payment) {
                return {
                    passed: true
                }
            } else {
                return {
                    passed: false,
                    errorMessage: "Выберите метод оплаты"
                }
            }
        },
        onClick: (form) => {
            order.orderInfo.payment = "cash";
            form.update();
        },
        locateQuery: "button[name='cash']"
    },
    {
        validation: () => {
            if (order.orderInfo.payment) {
                return {
                    passed: true
                }
            } else {
                return {
                    passed: false,
                    errorMessage: "Выберите метод оплаты"
                }
            }
        },
        onClick: (form) => {
            order.orderInfo.payment = "card";
            form.update();
        },
        locateQuery: "button[name='card']"
    }
]
const form1Template = document.querySelector("#order") as HTMLTemplateElement;
const form1Submit: SubmitFieldStat = {
    onSubmit: () => {
        eventSystem.emit(eventNames.openModal as string, {object: form2});
    },
    locateQuery: "button[type='submit']"
}
const form1 = new FormField(inputFields1, buttonFields1, form1Template, form1Submit);

const productListBasket = new ProductListUI(new ProductBasketUI(), {});
const productListControllerBasket = new ProductListController((product) => {return order.order.has(product.id)}, productListApi, productListBasket);
const basketTemplate = document.querySelector("#basket") as HTMLTemplateElement;
const basket = new BasketViewUI(productListControllerBasket, order, form1);

const basketCounter = document.querySelector(".header__basket-counter") as HTMLElement;
eventSystem.on(eventNames.addItemToBasket as string, () => {basketCounter.textContent = order.order.size.toString()});
eventSystem.on(eventNames.removeItemFromBasket as string, () => {basketCounter.textContent = order.order.size.toString()});

const basketOpener = document.querySelector(".header__basket") as HTMLButtonElement;
basketOpener.addEventListener('click', () => {
    eventSystem.emit(eventNames.openModal as string, {object: basket});
});

const gallery = document.querySelector(".gallery") as HTMLElement;
const productListGallery = new ProductListUI(new ProductOverviewUI(), {useExisting: gallery});
const productListControllerGallery = new ProductListController(() => true, productListApi, productListGallery);
productListControllerGallery.render();



