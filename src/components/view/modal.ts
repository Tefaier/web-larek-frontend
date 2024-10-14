import { ModalOpenInfo } from "../../types";
import { AppData } from "../base/appData";
import { eventNames, IEvents } from "../base/events";
import { UIElement } from "../base/view";

export class ModalWindowUI extends UIElement<ModalOpenInfo<any>> {
    container: HTMLElement
    activeObjectContainer: HTMLElement | undefined
    openedObject: UIElement<any> | undefined;
    closeListener: EventListener
    closeIgnore: boolean = true

    constructor(container: HTMLElement) {
        super()
        this.container = container;
        this.activeObjectContainer = this.container.querySelector(".modal__content")
        this.openedObject = undefined;
        this.init();
    }

    init() {
        const eventSystem = AppData.eventSystem;
        
        eventSystem.on(eventNames.openModal, (data: ModalOpenInfo<any>) => this.render(data));
        eventSystem.on(eventNames.updateModal, () => this.update());
        eventSystem.on(eventNames.closeModal, () => this.hide());

        this.container.querySelector(".modal__close").addEventListener('click', (e) => this.closeEvent(e))
        this.activeObjectContainer.addEventListener('click', (e) => e.stopPropagation())
        this.closeListener = this.closeEvent.bind(this);
    }

    render(data: ModalOpenInfo<any>): HTMLElement {
        this.openedObject = data.object;
        this.activeObjectContainer.innerHTML = "";
        this.activeObjectContainer.appendChild(data.object.render(data.data));
        this.show();
        return this.container;
    }

    update(): void {
        this.openedObject.update();
    }

    closeEvent(e: Event) {
        e.preventDefault();
        this.hide();
    }

    hide() {
        if (this.closeIgnore) {
            this.closeIgnore = false;
            return;
        }
        this.openedObject = undefined;
        this.activeObjectContainer.innerHTML = "";
        document.removeEventListener('click', this.closeListener);
        this.container.classList.remove("modal_active");
    }

    show() {
        this.preventInstaClose();
        document.addEventListener('click', this.closeListener);
        this.container.classList.add("modal_active");
    }

    async preventInstaClose() {
        this.closeIgnore = true;
        await new Promise(resolve => setTimeout(resolve, 200));
        this.closeIgnore = false;
    }
}