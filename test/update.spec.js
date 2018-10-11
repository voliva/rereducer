import { compose as c, inc, propEq } from 'ramda'
import { update, fromAction, innerReducer } from '../src'

const isActionId = c(propEq('id'), fromAction(['id']))
const reducer = update(isActionId, innerReducer(['count'], inc))

describe('update', () => {
  describe('arrays', () => {
    const state = [
      { id: 1, count: 2 },
      { id: 2, count: 3 },
      { id: 3, count: 4 }
    ]

    test('it updates the correct instance', () => {
      const output = reducer(state, { id: 2 })
      expect(output).toEqual([
        { id: 1, count: 2 },
        { id: 2, count: 4 },
        { id: 3, count: 4 }
      ])
    })

    test('it updates the correct instances', () => {
      const output = reducer(state.concat({ id: 2, count: 5 }), { id: 2 })
      expect(output).toEqual([
        { id: 1, count: 2 },
        { id: 2, count: 4 },
        { id: 3, count: 4 },
        { id: 2, count: 6 }
      ])
    })

    test('if nothing changes it returns the input', () => {
      const output = reducer(state, { id: 4 })
      expect(output).toBe(state)
    })
  })

  describe('objects', () => {
    const state = {
      a: { id: 1, count: 2 },
      b: { id: 2, count: 3 },
      c: { id: 3, count: 4 }
    }

    test('it updates the correct instance', () => {
      const output = reducer(state, { id: 2 })
      expect(output).toEqual({
        a: { id: 1, count: 2 },
        b: { id: 2, count: 4 },
        c: { id: 3, count: 4 }
      })
    })

    test('it updates the correct instances', () => {
      const output = reducer(
        {
          ...state,
          d: { id: 2, count: 5 }
        },
        { id: 2 }
      )

      expect(output).toEqual({
        a: { id: 1, count: 2 },
        b: { id: 2, count: 4 },
        c: { id: 3, count: 4 },
        d: { id: 2, count: 6 }
      })
    })

    test('if nothing changes it returns the input', () => {
      const output = reducer(state, { id: 4 })
      expect(output).toBe(state)
    })
  })
})