import { cloneTemplate, ensureElement } from "../../utils/utils";
import { AppData } from "../base/appData";
import { eventNames } from "../base/events";
import { UIElement } from "../base/view"
import { Order } from "../model/order"

export class OrderFinishUI extends UIElement<undefined> {
    static template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>("#success");

    order: Order;
    
    constructor(order: Order) {
        super();
        this.order = order;
    }
    
    render(): HTMLElement {
        const copy = cloneTemplate(OrderFinishUI.template);

        const messageField = copy.querySelector(".order-success__description");
        this.order.makeOrder().then((value) => {
            messageField.textContent = value.error == undefined ? `Списано ${value.total} синапсов` : "Заказ провалился: " + value.error;
        });
        
        const buttonField = copy.querySelector(".order-success__close");
        buttonField.textContent = "За новыми покупками!";
        buttonField.addEventListener('click', (e) => {
            e.preventDefault();
            AppData.eventSystem.emit(eventNames.closeModal as string);
        })
        return copy;
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
}
