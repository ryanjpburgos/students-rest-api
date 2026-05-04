/** Student record. `id` is a UUID v4 string generated server-side on creation. */
export interface IStudent {
  id: string;
  name: string;
  lastname: string;
  email: string;
  age: number;
}
