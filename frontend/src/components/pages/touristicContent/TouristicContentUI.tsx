import { Layout } from 'components/Layout/Layout';
import Loader from 'react-loader';
import { colorPalette, sizes, zIndex } from 'stylesheet';
import parse from 'html-react-parser';
import { FormattedMessage, useIntl } from 'react-intl';
import { TouristicContentMapDynamicComponent } from 'components/Map';
import { PageHead } from 'components/PageHead';
import { Footer } from 'components/Footer';
import { OpenMapButton } from 'components/OpenMapButton';
import { MobileMapContainer } from 'components/pages/search';
import { useTouristicContent } from './useTouristicContent';
import { DetailsPreview } from '../details/components/DetailsPreview';
import { DetailsSection } from '../details/components/DetailsSection';
import { ErrorFallback } from '../search/components/ErrorFallback';
import { DetailsTopIcons } from '../details/components/DetailsTopIcons';
import { DetailsSource } from '../details/components/DetailsSource';
import { DetailsCoverCarousel } from '../details/components/DetailsCoverCarousel';
import { ImageWithLegend } from '../details/components/DetailsCoverCarousel/DetailsCoverCarousel';
import { marginDetailsChild } from '../details/Details';
import { HtmlText } from '../details/utils';

interface TouristicContentUIProps {
  touristicContentUrl: string | string[] | undefined;
  language: string;
}

export const TouristicContentUI: React.FC<TouristicContentUIProps> = ({
  touristicContentUrl,
  language,
}) => {
  const {
    id,
    touristicContent,
    isLoading,
    refetch,
    mobileMapState,
    displayMobileMap,
    hideMobileMap,
    path,
  } = useTouristicContent(touristicContentUrl, language);

  const intl = useIntl();

  const titleRegex = RegExp(/(^\d+-)(.*)/).exec(path);
  const title = titleRegex ? titleRegex[2].replace(/-/g, ' ') : '';

  return (
    <Layout>
      <PageHead
        title={`${title} - ${intl.formatMessage({
          id: 'home.title',
        })}`}
      />
      {touristicContent === undefined ? (
        isLoading ? (
          <Loader
            loaded={!isLoading}
            options={{
              top: `${sizes.desktopHeader + sizes.filterBar}px`,
              color: colorPalette.primary1,
              zIndex: zIndex.loader,
            }}
          />
        ) : (
          <ErrorFallback refetch={refetch} />
        )
      ) : (
        <>
          <div className="flex flex-1">
            <div className="flex flex-col w-full desktop:w-3/5">
              <OpenMapButton displayMap={displayMobileMap} />
              <div className="h-coverDetailsMobile desktop:h-coverDetailsDesktop">
                {touristicContent.attachments.length > 1 ? (
                  <DetailsCoverCarousel attachments={touristicContent.attachments} />
                ) : (
                  <ImageWithLegend attachment={touristicContent.attachments[0]} />
                )}
              </div>
              <div
                className="desktop:py-0
                relative -top-6 desktop:-top-9
                flex flex-col"
              >
                <DetailsTopIcons
                  className={marginDetailsChild}
                  pdfUri={touristicContent.pdf}
                  practice={{
                    pictogram: touristicContent.category.pictogramUri,
                    name: touristicContent.category.label,
                  }}
                />
                <DetailsPreview
                  className={marginDetailsChild}
                  informations={{
                    duration: null,
                    distance: null,
                    elevation: null,
                    difficulty: null,
                    courseType: null,
                    networks: [],
                    types: touristicContent.types,
                    logoUri: touristicContent.logoUri,
                  }}
                  place={touristicContent.place}
                  tags={touristicContent.themes}
                  title={touristicContent.name}
                  teaser={touristicContent.descriptionTeaser}
                  ambiance={touristicContent.description}
                  id={id}
                />
                {(!!touristicContent.contact?.length ||
                  !!touristicContent.email?.length ||
                  !!touristicContent.website?.length) && (
                  <DetailsSection titleId="touristicContent.contact" className={marginDetailsChild}>
                    <HtmlText>{parse(touristicContent.contact)}</HtmlText>
                    {!!touristicContent.email?.length && (
                      <div className="mt-2 desktop:mt-4">
                        <FormattedMessage id="touristicContent.email" />
                        <span>{` :`}</span>
                        <a
                          href={`mailto:${touristicContent.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary1 underline hover:text-primary1-light"
                        >
                          <p>{touristicContent.email}</p>
                        </a>
                      </div>
                    )}
                    {!!touristicContent.website?.length && (
                      <div className="mt-2 desktop:mt-4">
                        <FormattedMessage id="touristicContent.website" />
                        <span>{` :`}</span>
                        <a
                          href={touristicContent.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary1 underline
                      hover:text-primary1-light"
                        >
                          <p>{touristicContent.website}</p>
                        </a>
                      </div>
                    )}
                  </DetailsSection>
                )}
                {touristicContent.sources.length > 0 && (
                  <DetailsSection titleId="details.source" className={marginDetailsChild}>
                    <div>
                      {touristicContent.sources.map((source, i) => (
                        <DetailsSource
                          key={i}
                          name={source.name}
                          website={source.website}
                          pictogramUri={source.pictogramUri}
                        />
                      ))}
                    </div>
                  </DetailsSection>
                )}
              </div>
              <Footer />
            </div>
            <div
              className="hidden desktop:flex desktop:z-content desktop:w-2/5
              desktop:bottom-0 desktop:fixed desktop:right-0 desktop:top-desktopHeader"
            >
              <TouristicContentMapDynamicComponent
                type="DESKTOP"
                bbox={touristicContent.bbox}
                touristicContentGeometry={{
                  geometry: touristicContent.geometry,
                  pictogramUri: touristicContent.category.pictogramUri,
                  name: touristicContent.name,
                }}
              />
            </div>
          </div>
          <MobileMapContainer
            className={`desktop:hidden fixed right-0 left-0 h-full z-map ${
              mobileMapState === 'HIDDEN' ? 'hidden' : 'flex'
            }`}
            displayState={mobileMapState}
          >
            <TouristicContentMapDynamicComponent
              type="MOBILE"
              bbox={touristicContent.bbox}
              touristicContentGeometry={{
                geometry: touristicContent.geometry,
                pictogramUri: touristicContent.category.pictogramUri,
                name: touristicContent.name,
              }}
              hideMap={hideMobileMap}
            />
          </MobileMapContainer>
        </>
      )}
    </Layout>
  );
};
