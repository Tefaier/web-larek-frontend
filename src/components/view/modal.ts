import { AppData } from "../base/appData";
import { eventNames, IEvents } from "../base/events";
import { UIElement } from "../base/view";

export class ModalWindowUI<T extends UIElement<any>> extends UIElement<T> {
    container: HTMLElement
    activeObjectContainer: HTMLElement | undefined
    openedObject: T | undefined;

    constructor(container: HTMLElement) {
        super()
        this.container = container;
        this.activeObjectContainer = this.container.querySelector(".modal__content")
        this.openedObject = undefined;
        this.init();
    }

    init() {
        const eventSystem = AppData.eventSystem;
        
        eventSystem.on(eventNames.openModal, (data: T) => this.render(data));
        eventSystem.on(eventNames.updateModal, () => this.update());
        eventSystem.on(eventNames.closeModal, this.hide);

        this.container.querySelector(".modal__close").addEventListener('click', this.closeEvent)
        this.activeObjectContainer.addEventListener('click', (e) => e.stopPropagation)
        document.addEventListener('click', this.closeEvent);
    }

    render(data: T): HTMLElement {
        this.openedObject = data;
        this.show();
        this.activeObjectContainer.appendChild(data.render());
        return this.container;
    }

    update(): void {
        this.openedObject.update();
    }

    closeEvent(e: MouseEvent) {
        e.preventDefault();

        this.hide();
    }

    hide() {
        this.openedObject = undefined;
        this.activeObjectContainer.innerHTML = "";
        // hide self as well
    }

    show() {
        // unhide self
    }
}