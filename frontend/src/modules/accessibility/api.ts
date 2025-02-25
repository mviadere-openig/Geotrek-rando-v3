import { GeotrekAPI } from 'services/api/client';
import { APIQuery, APIResponseForList } from 'services/api/interface';
import { RawAccessibility } from './interface';

export const fetchAccessibilities = (
  query: APIQuery,
): Promise<APIResponseForList<RawAccessibility>> =>
  GeotrekAPI.url(`/trek_accessibility`).query(query).get().json();
