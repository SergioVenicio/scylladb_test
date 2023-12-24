export interface Product {
  sku: string
  description: string
  price: number
  stock: number
}

export interface Repository {
  save: (param: any) => Promise<any>
  get: (param: any) => Promise<any>
  list: (params: any) => Promise<any>
}
