import {Context, SessionFlavor} from "grammy";
import {HydrateFlavor} from '@grammyjs/hydrate'

export interface MySession {
    step?: 'choose_type' | 'enter_data'
    productType?: 'mail' | 'full'
}

export interface MySession {
    step?: 'choose_type' | 'enter_data'
    productType?: 'mail' | 'full'
}

export type MyContext =
    Context &
    HydrateFlavor<Context> &
    SessionFlavor<MySession>