import { isUrlString } from 'modules/utils/string';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { getOutdoorCourseDetails } from '../../../modules/outdoorCourse/connector';
import { OutdoorCourseDetails } from '../../../modules/outdoorCourse/interface';

export const useOutdoorCourse = (
  outdoorCourseUrl: string | string[] | undefined,
  language: string,
) => {
  const id = isUrlString(outdoorCourseUrl) ? outdoorCourseUrl.split('-')[0] : '';
  const path = isUrlString(outdoorCourseUrl) ? decodeURI(outdoorCourseUrl) : '';
  const { data, refetch, isLoading } = useQuery<OutdoorCourseDetails, Error>(
    ['outdoorCourseDetails', id, language],
    () => getOutdoorCourseDetails(id, language),
    {
      enabled: isUrlString(outdoorCourseUrl),
    },
  );

  const [mobileMapState, setMobileMapState] = useState<'DISPLAYED' | 'HIDDEN'>('HIDDEN');
  const displayMobileMap = () => setMobileMapState('DISPLAYED');
  const hideMobileMap = () => setMobileMapState('HIDDEN');

  return {
    id,
    outdoorCourseContent: data,
    refetch,
    isLoading,
    mobileMapState,
    displayMobileMap,
    hideMobileMap,
    path,
  };
};
