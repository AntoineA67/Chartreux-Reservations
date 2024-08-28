export { default } from "next-auth/middleware";
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['fr-fr', 'en', 'en-US']
let defaultLocale = 'fr-fr'

export const config = {
	matcher: ["/((?!register|api|login).*)"],
};


match(languages, locales, defaultLocale)