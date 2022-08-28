import { Signature } from '../interfaces/Signature';

export interface Property {
  sequenceNumber: number;
  value: string;
  signatures: Signature[];
}
