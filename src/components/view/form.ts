import { InputFieldStat, SubmitFieldStat } from "../../types";
import { cloneTemplate } from "../../utils/utils";
import { UIElement } from "../base/view";

export class FormField extends UIElement<undefined> {
    template: HTMLTemplateElement;
    formField: HTMLElement | null;
    inputFields: InputFieldStat[];
    submitField: SubmitFieldStat;
    errorsField: HTMLElement | null;

    constructor(inputFields: InputFieldStat[], template: HTMLTemplateElement, submitField: SubmitFieldStat) {
        super();
        this.template = template;
        this.inputFields = inputFields;
        this.submitField = submitField;
    }

    render(data?: undefined): HTMLElement {
        const copy = cloneTemplate(this.template);
        this.inputFields.forEach((field) => {
            field.element = copy.querySelector(field.locateQuery);
            field.element.addEventListener('focusout', () => {
                field.onInput(this, field.element.value);
                this.update();
            });
        });

        this.submitField.element = copy.querySelector(this.submitField.locateQuery);
        this.submitField.element.addEventListener('submit', this.submitField.onSubmit);

        this.errorsField = copy.querySelector(".form__errors");

        this.validate();
        return copy;
    }

    update(): void {
        this.validate();
    }

    validate() {
        let passed = true;
        const errorMessages: string[] = [];

        for (const field of this.inputFields) {
            const result = field.validation(field.element.value);
            if (result.errorMessage) errorMessages.push(result.errorMessage);
            passed = passed && result.passed;
        }

        this.submitField.element.disabled = !passed;
        this.setErrorMessage(errorMessages);
    }

    setErrorMessage(errorMessages: string[]) {
        this.errorsField.textContent = '';
        errorMessages.forEach((message, index) => {
            this.errorsField.textContent = message + (index == errorMessages.length - 1 ? '' : '\n');
        });
    }
}