const Obj = {
  a: {
    b: {
      c: 1,
    },
  },
  d: 2,
  e: {
    f: 3,
    g: {
      h: 4,
    },
  },
} as const

type Paths<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? T[K] extends object
          ? `${K}.${Paths<T[K]>}`
          : `${K}`
        : never
    }[keyof T]
  : ''

type PickWithPath<
  T,
  K extends Paths<T>,
> = K extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? // @ts-expect-error - TS can't infer the type of Rest - @TODO - when new version of TS is released, check if this is fixed
      { [P in Key]: PickWithPath<T[Key], Rest> }
    : never
  : K extends keyof T
  ? { [P in K]: T[K] }
  : never

type Test = PickWithPath<typeof Obj, 'a.b.c'> // { a: { b: { c: 1 } } }
