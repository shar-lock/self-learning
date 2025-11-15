import { atom } from 'jotai'
import type { DeskInfo } from './Types'

let cookie = document.cookie
export let isLoginAtom = atom(cookie.includes('userid'))

export let deskInfoAtom = atom<null|DeskInfo>(null)
