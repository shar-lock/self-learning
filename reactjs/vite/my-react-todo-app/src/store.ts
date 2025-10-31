import { atom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
const visibleTypeAtom = atomWithImmer('all')

const editingIdxAtom = atomWithImmer(-1)

export type Todo = {
  id: number | string
  text: string
  completed: boolean
}
const todosAtom = atomWithImmer<Todo[]>([
  {
    id: 1995,
    text: 'Ghost in the Shell',
    completed: true
  },
  {
    id: 1998,
    text: 'Serial Experiments Lain',
    completed: false
  }
])
const leftCountAtom = atom((get) => {
  return get(todosAtom).filter((item) => !item.completed).length 
})
const isAllCompletedAtom = atom((get) => {
  return get(todosAtom).every((item) => item.completed)
})
const hasCompletedAtom = atom((get) => {
  return get(todosAtom).some((item) => item.completed)
})

export { visibleTypeAtom, editingIdxAtom, todosAtom ,leftCountAtom, isAllCompletedAtom, hasCompletedAtom}