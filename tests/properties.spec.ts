import {
  getProperty,
  validatePropertyString,
  validatePropertyObjectFieldsAreNotNullNorUndefined,
} from '../utils/propertyUtils';
import { expect } from 'chai';
import { VALID_SUBJECTS } from '../testData/subjects';
import { ALL_PROPERTIES } from '../config/properties';
import { Property } from '../enums/properties';

describe('HTTP GET /metadata/{subject}/properties/{property}', () => {
  ALL_PROPERTIES.forEach((propertyName) => {
    it(`should return valid value for property: ${propertyName}`, async () => {
      const subject = VALID_SUBJECTS[0];
      const response = await getProperty(subject, propertyName);
      expect(response.statusCode).equal(200);
      if ([Property.POLICY, Property.SUBJECT].includes(propertyName)) {
        validatePropertyString(response.body);
      } else {
        validatePropertyObjectFieldsAreNotNullNorUndefined(response.body);
      }
    });
  });

  it('should return error for nonexistent subject', async () => {
    const subject = 'bogus_subject';
    const propertyName = Property.NAME;
    const expectedErrorMessage = `Requested subject '${subject}' not found`;
    const response = await getProperty(subject, propertyName);
    expect(response.statusCode).equal(200);
    expect(response.body).equal(expectedErrorMessage);
  });

  it('should return error for nonexistent property', async () => {
    const subject = VALID_SUBJECTS[0];
    const propertyName = 'bogus_property';
    const expectedErrorMessage = `Requested property '${propertyName}' not found`;
    const response = await getProperty(subject, propertyName);
    expect(response.statusCode).equal(200);
    expect(response.body).equal(expectedErrorMessage);
  });
});
