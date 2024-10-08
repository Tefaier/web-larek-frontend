import { ListSettings, ModalOpenInfo } from "../../types";
import { Product } from "../../types/api/api";
import { cloneTemplate, ensureElement } from "../../utils/utils";
import { AppData } from "../base/appData";
import { eventNames } from "../base/events";
import { UIElement } from "../base/view";

export abstract class ProductUI extends UIElement<Product> {
}

export class ProductOverviewUI extends ProductUI {
    static template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>("#card-catalog");

    render(data: Product): HTMLElement {
        const copy = cloneTemplate(ProductOverviewUI.template);
        const category = copy.querySelector(".card__category");
        const title = copy.querySelector(".card__title");
        const image = copy.querySelector(".card__image") as HTMLImageElement;
        const price = copy.querySelector(".card__price");
        (copy.querySelector(".card") as HTMLButtonElement).addEventListener('click', () => AppData.eventSystem.emit(eventNames.openModal as string, {object: new ProductDetailedUI(), data: data}))
        category.textContent = data.category;
        title.textContent = data.title;
        image.src = data.image;
        price.textContent = data.price.toString();
        return copy;
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
}

export class ProductDetailedUI extends ProductUI {
    static template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>("#card-preview");

    render(data: Product): HTMLElement {
        const copy = cloneTemplate(ProductDetailedUI.template);
        const category = copy.querySelector(".card__category");
        const title = copy.querySelector(".card__title");
        const text = copy.querySelector(".card__text");
        const image = copy.querySelector(".card__image") as HTMLImageElement;
        const price = copy.querySelector(".card__price");
        const basketButton = copy.querySelector(".card__button");
        category.textContent = data.category;
        title.textContent = data.title;
        text.textContent = data.description;
        image.src = data.image;
        price.textContent = data.price.toString();
        basketButton.addEventListener('onClick', () => AppData.eventSystem.emit(eventNames.addItemToBasket as string, data))
        return copy;
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
}

export class ProductBasketUI extends ProductUI {
    static template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>("#card-basket");

    render(data: Product): HTMLElement {
        const copy = cloneTemplate(ProductBasketUI.template);
        const title = copy.querySelector(".card__title");
        const price = copy.querySelector(".card__price");
        const deleteButton = copy.querySelector(".card__button");
        title.textContent = data.title;
        price.textContent = data.price.toString();
        deleteButton.addEventListener('onClick', () => {
            AppData.eventSystem.emit(eventNames.removeItemFromBasket as string, data);
            AppData.eventSystem.emit(eventNames.updateModal as string);
    });
        return copy;
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
}

export class ProductListUI extends UIElement<Product[]> {
    productUI: ProductUI
    settings: ListSettings

    constructor(productUI: ProductUI, settings: ListSettings) {
        super();
        this.productUI = productUI;
        this.settings = settings;
    }

    render(data: Product[]): HTMLElement {
        const ul = this.settings.useExisting ? this.settings.useExisting : document.createElement('ul');
        ul.innerHTML = '';
        for (const product of data) {
            ul.appendChild(this.productUI.render(product));
        }

        if (this.settings.countWithClass) {
            ul.querySelectorAll(this.settings.countWithClass).forEach((value, key) => {
                value.textContent = (key + 1).toString();
            })
        }

        return ul;
    }

    update(): void {
        throw new Error("Method not implemented.");
    }
}