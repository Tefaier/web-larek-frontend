import { UIElement } from "../components/base/view";
import { FormField } from "../components/view/form";
import { Product } from "./api/api"

export type ModalOpenInfo<T> = {
    object: UIElement<T>,
    data?: T
}

export type ProductFilter = (arg: Product) => boolean;

export type InputValue = string | number;

export type ValidationResponse = {
    passed: boolean
    errorMessage?: string
}

export type ValidationFunction = (value: InputValue) => ValidationResponse;

export var InputFieldType: {[key: string]: number} = {
    password: 0
};

export type InputFieldStat = {
    options?: object[]
    element?: HTMLInputElement
    type: string
    validation: ValidationFunction
    onInput: (form: FormField, value: string) => void
    locateQuery: string
};

export type ButtonFieldStat = {
    element?: HTMLInputElement
    validation: () => ValidationResponse
    onClick: (form: FormField) => void
    locateQuery: string
};

export type SubmitFieldStat = {
    element?: HTMLButtonElement
    locateQuery: string
    onSubmit: () => void
}

export const defaultInputFieldStats: {[key: number]: ValidationFunction} = {
    0: (value: string) => {
        const result = value.indexOf('@') != -1 && value.indexOf('@') == value.lastIndexOf('@');
        return {
            passed: result
        };
    }, // email
    1: (value: InputValue) => {
        const result = value.toString().length >= 1;
        return {
            passed: result
        };
    }, // not empty
    2: (value: InputValue) => {
        return {passed: true};
    }, // always true
    3: (value: InputValue) => {
        const pattern = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;
        const result = pattern.test(value.toString());
        if (result) {
            return {passed: result};
        } else {
            return {
                passed: false,
                errorMessage: "Неправильный формат номера телефона"
            }
        }
    } // phone
};

export type ListSettings = {
    useExisting?: HTMLElement,
    countWithClass?: string
}


