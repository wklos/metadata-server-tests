import { expect } from 'chai';
import { Property } from '../enums/properties';
import { Metadata } from '../interfaces/Metadata';
import { makeGETCall } from './apiUtils';
import {
  validatePropertyObjectFieldsAreNotNullNorUndefined,
  validatePropertyString,
} from './propertyUtils';

export const getMetadata = async (subject: string) => {
  return makeGETCall(`metadata/${subject}`);
};

export const validateMandatoryMetadataPropertiesAreNotNullNorUndefined = (
  metadata: Metadata
) => {
  expect(metadata.policy).not.to.be.null.and.not.to.be.undefined;
  expect(metadata.subject).not.to.be.null.and.not.to.be.undefined;
  validatePropertyObjectFieldsAreNotNullNorUndefined(metadata.decimals);
};

export const validateAllMetadataPropertiesAreNotNullNorUndefined = (
  metadata: Metadata
) => {
  validateMandatoryMetadataPropertiesAreNotNullNorUndefined(metadata);
  validatePropertyObjectFieldsAreNotNullNorUndefined(metadata.description);
  validatePropertyObjectFieldsAreNotNullNorUndefined(metadata.logo);
  validatePropertyObjectFieldsAreNotNullNorUndefined(metadata.name);
  validatePropertyObjectFieldsAreNotNullNorUndefined(metadata.ticker);
  validatePropertyObjectFieldsAreNotNullNorUndefined(metadata.url);
};

export const validateUnneededMetadataPropertiesDoNotExist = (
  metadata: Metadata,
  excludedProperties?: string[]
) => {
  const unneededProperties = [
    Property.DESCRIPTION,
    Property.NAME,
    Property.LOGO,
    Property.TICKER,
    Property.URL,
  ];

  const propertiesToBeVerified = excludeElementsFromArray(
    unneededProperties,
    excludedProperties
  );

  propertiesToBeVerified.forEach((property: string) => {
    validateMetadataPropertyDoesNotExist(metadata, property);
  });
};

export const validateExpectedMetadataPropertiesAreNotNullNorUndefined = (
  metadata: Metadata,
  properties: string[]
) => {
  const uniqueProperties = [...new Set(properties)];
  uniqueProperties.forEach((property) => {
    if ([Property.SUBJECT, Property.POLICY].includes(property as Property)) {
      validatePropertyString(property);
    }
    if (
      [
        Property.DECIMALS,
        Property.DESCRIPTION,
        Property.NAME,
        Property.LOGO,
        Property.TICKER,
        Property.URL,
      ].includes(property as Property)
    ) {
      validatePropertyObjectFieldsAreNotNullNorUndefined(metadata[property]);
    }
  });
};

export const validateMetadataPropertyDoesNotExist = (
  metadata: Metadata,
  property: string
) => {
  expect(metadata).to.not.have.property(property);
};

const excludeElementsFromArray = (originalArray, itemsToBeExcluded) => {
  itemsToBeExcluded?.forEach((itemToBeExcluded) => {
    const index = originalArray.indexOf(itemToBeExcluded);
    if (index > -1) {
      originalArray.splice(index, 1);
    }
  });

  return originalArray;
};
