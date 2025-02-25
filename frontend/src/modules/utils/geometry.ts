import {
  Coordinate2D,
  LineStringGeometry,
  PointGeometry,
  PolygonGeometry,
  RawCoordinate2D,
  RawLineStringGeometry2D,
  RawPointGeometry2D,
  RawPolygonGeometry,
} from 'modules/interface';

export const adaptGeometry2D = (geometry: RawCoordinate2D): { x: number; y: number } => ({
  x: geometry[0],
  y: geometry[1],
});

/** Adapt any type of raw geometry */
export const adaptGeometry = (
  geometry: RawPolygonGeometry | RawLineStringGeometry2D | RawPointGeometry2D,
): PolygonGeometry | LineStringGeometry | PointGeometry => {
  switch (geometry.type) {
    case 'Polygon':
      return {
        type: geometry.type,
        coordinates: geometry.coordinates.map(line => line.map(point => adaptGeometry2D(point))),
      };

    case 'LineString':
      return {
        type: geometry.type,
        coordinates: geometry.coordinates.map(point => adaptGeometry2D(point)),
      };

    case 'Point':
      return {
        type: geometry.type,
        coordinates: adaptGeometry2D(geometry.coordinates),
      };
  }
};

export const extractFirstPointOfGeometry = (
  geometry: RawPolygonGeometry | RawLineStringGeometry2D | RawPointGeometry2D | null,
): Coordinate2D | null => {
  if (geometry === null) return null;
  switch (geometry.type) {
    case 'Polygon':
      return adaptGeometry2D(geometry.coordinates[0][0]);

    case 'LineString':
      return adaptGeometry2D(geometry.coordinates[0]);

    case 'Point':
      return adaptGeometry2D(geometry.coordinates);
  }
};
