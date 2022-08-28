import { postMetadataQuery } from '../utils/queryUtils';
import { VALID_SUBJECTS } from '../testData/subjects';
import { expect } from 'chai';
import {
  validateAllMetadataPropertiesAreNotNullNorUndefined,
  validateMandatoryMetadataPropertiesAreNotNullNorUndefined,
  validateMetadataPropertyDoesNotExist,
  validateUnneededMetadataPropertiesDoNotExist,
  validateExpectedMetadataPropertiesAreNotNullNorUndefined,
} from '../utils/metadataUtils';
import { Metadata } from '../interfaces/Metadata';
import { Property } from '../enums/properties';

describe('HTTP POST /metadata/query', () => {
  [[VALID_SUBJECTS[0]], VALID_SUBJECTS].forEach((subjects) => {
    it(`should return ${subjects.length} subject[s] with all metadata properties if properties were not specified`, async () => {
      const res = await postMetadataQuery(subjects);

      expect(res.statusCode).equal(200);
      expect(res.body.subjects).to.have.length(subjects.length);
      res.body.subjects.forEach((metadata: Metadata) => {
        expect(metadata.subject).to.be.oneOf(subjects);
        validateAllMetadataPropertiesAreNotNullNorUndefined(metadata);
      });
    });
  });

  it(`should return 1 subject with all metadata properties if 1 valid and 1 invalid subjects were passed `, async () => {
    const subjects = [VALID_SUBJECTS[0], 'bogus_subject'];

    const res = await postMetadataQuery(subjects);

    expect(res.statusCode).equal(200);
    expect(res.body.subjects).to.have.length(1);
    expect(res.body.subjects[0].subject).to.equal(VALID_SUBJECTS[0]);
    validateAllMetadataPropertiesAreNotNullNorUndefined(res.body.subjects[0]);
  });

  [
    { validProperties: [Property.NAME], invalidProperties: [] },
    {
      validProperties: [Property.DESCRIPTION, Property.SUBJECT],
      invalidProperties: [],
    },
    {
      validProperties: [Property.TICKER],
      invalidProperties: ['bogus_property_1'],
    },
    {
      validProperties: [Property.DESCRIPTION, Property.SUBJECT],
      invalidProperties: ['bogus_property_1', 'bogus_property_2'],
    },
  ].forEach((properties) => {
    const concatenatedProperties = [
      ...properties.validProperties,
      ...properties.invalidProperties,
    ];
    it(`should return results with mandatory properties and valid user-provided properties (valid:${properties.validProperties.join(
      ','
    )}, invalid:${properties.invalidProperties.join(',')})`, async () => {
      const subjects = [VALID_SUBJECTS[0]];

      const res = await postMetadataQuery(subjects, concatenatedProperties);

      expect(res.statusCode).equal(200);
      expect(res.body.subjects).to.have.length(subjects.length);
      res.body.subjects.forEach((metadata: Metadata) => {
        validateExpectedMetadataPropertiesAreNotNullNorUndefined(
          metadata,
          properties.validProperties
        );
        validateMandatoryMetadataPropertiesAreNotNullNorUndefined(metadata);
        validateUnneededMetadataPropertiesDoNotExist(
          metadata,
          concatenatedProperties
        );
        properties.invalidProperties.forEach((invalidProperty) => {
          validateMetadataPropertyDoesNotExist(metadata, invalidProperty);
        });
      });
    });
  });

  it('should return results with mandatory properties if only invalid properties were passed', async () => {
    const subjects = [VALID_SUBJECTS[0]];
    const invalidProperties = ['bogus_property_1', 'bogus_property_2'];
    const properties = [...invalidProperties];

    const res = await postMetadataQuery(subjects, properties);

    expect(res.statusCode).equal(200);
    expect(res.body.subjects).to.have.length(subjects.length);
    res.body.subjects.forEach((metadata: Metadata) => {
      validateMandatoryMetadataPropertiesAreNotNullNorUndefined(metadata);
      validateUnneededMetadataPropertiesDoNotExist(metadata);
      invalidProperties.forEach((invalidProperty) => {
        validateMetadataPropertyDoesNotExist(metadata, invalidProperty);
      });
    });
  });

  it('should not return any metadata for nonexistent subject', async () => {
    const subjects = ['bogus_subject'];
    const res = await postMetadataQuery(subjects);

    expect(res.statusCode).equal(200);
    expect(res.body.subjects).to.be.empty;
  });
});
