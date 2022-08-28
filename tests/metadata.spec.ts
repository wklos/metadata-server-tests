import { expect } from 'chai';
import {
  getMetadata,
  validateAllMetadataPropertiesAreNotNullNorUndefined,
} from '../utils/metadataUtils';
import { VALID_SUBJECTS } from '../testData/subjects';

describe('HTTP GET /metadata/{subject}', () => {
  VALID_SUBJECTS.forEach((subject) => {
    it(`should return metadata for existing subject: ${subject} `, async () => {
      const response = await getMetadata(subject);
      expect(response.statusCode).equal(200);
      expect(response.body.subject).to.equal(subject);
      validateAllMetadataPropertiesAreNotNullNorUndefined(response.body);
    });
  });

  it('should return error for nonexistent subject', async () => {
    const subject = 'bogus_subject';
    const expectedErrorMessage = `Requested subject '${subject}' not found`;
    const response = await getMetadata(subject);
    expect(response.statusCode).equal(200);
    expect(response.body).equal(expectedErrorMessage);
  });
});
