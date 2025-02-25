import nock from 'nock';
import { render } from 'services/testing/reactTestingLibraryWrapper';
import 'isomorphic-fetch';
import { QueryClient, QueryClientProvider } from 'react-query';
import { mockThemeResponse } from 'components/pages/search/mocks';
import { mockPoiTypeRoute } from 'modules/poiType/mocks';
import { mockPoiRoute } from 'modules/poi/mocks';
import { mockTouristicContentRoute } from 'modules/touristicContent/mocks';
import { mockTouristicContentCategoryRoute } from 'modules/touristicContentCategory/mocks';
import { mockCityRoute } from 'modules/city/mocks';
import { mockAccessibilitiesRoute } from 'modules/accessibility/mocks';
import { mockSourceRoute } from 'modules/source/mocks';
import { mockInformationDeskRoute } from 'modules/informationDesk/mocks';
import { mockLabelRoute } from 'modules/label/mocks';
import { getGlobalConfig } from 'modules/utils/api.config';
import {
  mockNetworksResponse,
  rawActivity,
  rawDetails as rawDetailsMock,
  rawDifficulty,
  rawRoute,
} from 'modules/details/mocks/mocks';
import { DetailsUI } from '../';

describe('Details', () => {
  const idToTest = 2;
  const titleToTest = 'Col de Font Froide';

  const queryClient = new QueryClient();

  it('AAU, I can see details of the trek', async () => {
    nock(getGlobalConfig().apiUrl)
      .get(`/trek/${idToTest}/`)
      .query({
        language: 'fr',
        fields:
          'id,name,departure,attachments,practice,public_transport,access,advised_parking,description_teaser,ambiance,themes,duration,length_2d,ascent,difficulty,route,networks,description,geometry,parking_location,pdf,gpx,kml,cities,disabled_infrastructure,accessibilities,source,information_desks,labels,advice,points_reference,children',
        format: 'geojson',
      })
      .reply(200, rawDetailsMock);

    nock(getGlobalConfig().apiUrl)
      .get(`/trek_practice/${rawDetailsMock.properties.practice}/`)
      .query({
        language: 'fr',
      })
      .reply(200, rawActivity);

    nock(getGlobalConfig().apiUrl)
      .get(`/trek_difficulty/${rawDetailsMock.properties.difficulty as number}/`)
      .query({
        language: 'fr',
      })
      .reply(200, rawDifficulty);

    nock(getGlobalConfig().apiUrl)
      .get(`/trek_route/${rawDetailsMock.properties.route}/`)
      .query({
        language: 'fr',
      })
      .reply(200, rawRoute);

    nock(getGlobalConfig().apiUrl)
      .get(`/theme`)
      .query({
        language: 'fr',
      })
      .reply(200, mockThemeResponse);

    nock(getGlobalConfig().apiUrl)
      .get(`/trek_network`)
      .query({
        language: 'fr',
      })
      .reply(200, mockNetworksResponse);

    mockPoiTypeRoute(1);
    mockPoiRoute(1, rawDetailsMock.properties.id);

    mockTouristicContentCategoryRoute(1);
    mockTouristicContentRoute(1, rawDetailsMock.properties.id);

    mockCityRoute(1);
    mockAccessibilitiesRoute(1);
    mockSourceRoute(1);
    mockInformationDeskRoute(1);
    mockLabelRoute(1);

    const component = render(
      <QueryClientProvider client={queryClient}>
        <DetailsUI detailsId={`${idToTest}-Col-de-Font-Froide`} language={'fr'} />
      </QueryClientProvider>,
    );
    await component.findAllByText(titleToTest);
    await component.findByText('La Motte-en-Champsaur');
    await component.findAllByText('Lagopède alpin');
    await component.findAllByText('Refuge de la Lavey');
    await component.findByText('Auberge Gaillard');
    await component.findByText(
      "L'auberge propose, dans un hameau de montagne en bout de route, en pleine nature, un hébergement de séjour, nuitée, demi-pension et pension complète dans un décor de la vie d'antan et d'aujourd'hui.",
    );
    const download = await component.findByText('Télécharger');
    expect(download).toHaveAttribute('href', rawDetailsMock.properties.pdf);
    await component.findAllByText('Accessibilité');
    await component.findByText('Poussette');
    await component.findByText('Source');
  });
});
