import { cloneTemplate, ensureElement } from "../../utils/utils";
import { AppData } from "../base/appData";
import { eventNames } from "../base/events";
import { UIElement } from "../base/view";
import { ProductListController } from "../controller/productList";
import { Order } from "../model/order";

export class BasketViewUI extends UIElement<undefined> {
    static template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>("#basket");

    productListController: ProductListController;
    container: HTMLElement;
    order: Order;

    priceField: HTMLElement | null;
    buttonField: HTMLButtonElement | null;
    listField: HTMLElement | null;

    constructor(productListController: ProductListController, container: HTMLElement, order: Order) {
        super();
        this.productListController = productListController;
        this.container = container;
        this.order = order;
    }

    render(data?: undefined): HTMLElement {
        const copy = cloneTemplate(BasketViewUI.template);
        this.priceField = copy.querySelector(".basket__price"); 
        this.listField = copy.querySelector(".basket__list");
        this.buttonField = copy.querySelector(".basket__button"); 
        this.productListController.productsList.settings.useExisting = this.listField;
        this.update();

        this.buttonField.addEventListener('submit', (e) => {
            e.preventDefault();

            // initiate form rendering
            AppData.eventSystem.emit(eventNames.openModal as string, );
        })

        return copy;
    }

    update(): void {
        this.priceField.textContent = this.order.totalCost().toString();
        // using settings places list as needed
        this.productListController.render();
    }
}