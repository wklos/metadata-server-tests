import { QueryRequest } from 'interfaces/QueryRequest';
import { makePOSTCall } from './apiUtils';

export const postMetadataQuery = async (
  subjects: string[],
  properties?: string[]
) => {
  const metadataQueryPayload: QueryRequest = {
    subjects,
  };

  if (properties && properties.length > 0) {
    metadataQueryPayload['properties'] = properties;
  }

  return makePOSTCall('metadata/query', metadataQueryPayload);
};
