import { makeGETCall } from './apiUtils';
import { expect } from 'chai';
import { Property } from '../interfaces/Property';
import { Signature } from '../interfaces/Signature';

export const getProperty = async (subject: string, propertyName: string) => {
  return makeGETCall(`metadata/${subject}/properties/${propertyName}`);
};

export const validatePropertyObjectFieldsAreNotNullNorUndefined = (
  propertyContent: Property | undefined
) => {
  expect(propertyContent).to.not.be.null.and.to.not.be.undefined;
  if (propertyContent) {
    expect(propertyContent.sequenceNumber).to.not.be.null.and.to.not.be
      .undefined;
    expect(propertyContent.value).to.not.be.null.and.to.not.be.undefined;
    expect(propertyContent.signatures.length).to.be.greaterThan(0);
    propertyContent.signatures.forEach((signature: Signature) => {
      expect(signature.publicKey).to.not.be.null.and.to.not.be.undefined;
      expect(signature.signature).to.not.be.null.and.to.not.be.undefined;
    });
  }
};

export const validatePropertyString = (propertyContent: string) => {
  expect(propertyContent).not.empty.and.to.be.string;
};
