import { StateViewModel } from "./state";

export class Contact{
    id: number;
    firstName:string;
    lastName: string;
    phone: string
    street: string
    state: string
    city: string
    zip: string
    email: string
}


export class ContactInfoViewModel{
    items: Contact[]
    states: StateViewModel[]
    freqStrings: string[]
}