import { GeotrekAPI } from 'services/api/client';
import { APIQuery, APIResponseForList } from 'services/api/interface';
import { RawCourseType } from './interface';

export const fetchCourseTypes = (query: APIQuery): Promise<APIResponseForList<RawCourseType>> =>
  GeotrekAPI.url('/trek_route').query(query).get().json();

export const fetchCourseType = (query: APIQuery, id: number): Promise<RawCourseType> =>
  GeotrekAPI.url(`/trek_route/${id}/`).query(query).get().json();
