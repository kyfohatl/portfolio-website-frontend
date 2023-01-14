export type WithRequiredType<T, K extends keyof T> = T & { [P in K]-?: T[P] }