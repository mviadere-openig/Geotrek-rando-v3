import { getAccessibilities } from 'modules/accessibility/connector';
import { getActivity } from 'modules/activities/connector';
import { getCities } from 'modules/city/connector';
import { getCourseType } from 'modules/filters/courseType/connector';
import { getDifficulty } from 'modules/filters/difficulties/connector';
import { getThemes } from 'modules/filters/theme/connector';
import { getInformationDesks } from 'modules/informationDesk/connector';
import { getLabels } from 'modules/label/connector';
import { getNetworks } from 'modules/networks/connector';
import { getPois } from 'modules/poi/connector';
import { getTrekResultsById } from 'modules/results/connector';
import { getSources } from 'modules/source/connector';
import { getTouristicContentsNearTrek } from 'modules/touristicContent/connector';
import { adaptChildren, adaptResults, adaptTrekChildGeometry } from './adapter';
import { fetchDetails, fetchTrekChildren, fetchTrekGeometry, fetchTrekName } from './api';
import { Details, TrekChild, TrekChildGeometry } from './interface';

export const getDetails = async (id: string, language: string): Promise<Details> => {
  try {
    const rawDetails = await fetchDetails({ language }, id);
    // Typescript limit for Promise.all is for 10 promises
    const [
      activity,
      difficulty,
      courseType,
      networks,
      themes,
      pois,
      touristicContents,
      cityDictionnary,
      accessibilityDictionnary,
      sourceDictionnary,
    ] = await Promise.all([
      getActivity(rawDetails.properties.practice, language),
      getDifficulty(rawDetails.properties.difficulty, language),
      getCourseType(rawDetails.properties.route, language),
      getNetworks(language),
      getThemes(language),
      getPois(rawDetails.properties.id, language),
      getTouristicContentsNearTrek(rawDetails.properties.id, language),
      getCities(language),
      getAccessibilities(language),
      getSources(language),
    ]);
    const [informationDeskDictionnary, labelsDictionnary, children] = await Promise.all([
      getInformationDesks(language),
      getLabels(language),
      getTrekResultsById(rawDetails.properties.children, language),
    ]);
    const childrenGeometry = await Promise.all(
      rawDetails.properties.children.map(childId => getChildGeometry(`${childId}`, language)),
    );
    return adaptResults({
      rawDetails,
      activity,
      difficulty,
      courseType,
      networks,
      themes,
      pois,
      touristicContents,
      cityDictionnary,
      accessibilityDictionnary,
      sourceDictionnary,
      informationDeskDictionnary,
      labelsDictionnary,
      children,
      childrenGeometry,
    });
  } catch (e) {
    console.error('Error in details/connector principal', e);
    throw e;
  }
};

export const getTrekChildren = async (parentId: string, language: string): Promise<TrekChild[]> => {
  try {
    const childrenIdsResult = await fetchTrekChildren({ language }, parentId);
    const childrenNames = await Promise.all(
      childrenIdsResult.children.map(childId => getName(childId, language)),
    );
    return adaptChildren({ childrenIds: childrenIdsResult.children, childrenNames });
  } catch (e) {
    console.error('Error in details/connector', e);
    throw e;
  }
};

export const getName = async (id: string, language: string): Promise<string> => {
  try {
    const result = await fetchTrekName({ language }, id);
    return result.name;
  } catch (e) {
    console.error('Error in details/connector', e);
    throw e;
  }
};

const getChildGeometry = async (id: string, language: string): Promise<TrekChildGeometry> => {
  try {
    const result = await fetchTrekGeometry({ language }, id);
    return adaptTrekChildGeometry(id, result.geometry);
  } catch (e) {
    console.error('Error in details/connector', e);
    throw e;
  }
};
