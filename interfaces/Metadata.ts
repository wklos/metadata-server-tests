import { Property } from '../interfaces/Property';

export interface Metadata {
  decimals: Property;
  description?: Property;
  name?: Property;
  logo?: Property;
  policy: string;
  subject: string;
  ticker?: Property;
  url?: Property;
}
