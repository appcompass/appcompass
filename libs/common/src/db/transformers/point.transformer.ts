import { ValueTransformer } from 'typeorm';

import { LatLongPoint } from '../db.types';

export class PointTransformer implements ValueTransformer {
  to(value: LatLongPoint) {
    const { lat, lon } = value;
    return `${lat}, ${lon}`;
  }

  from(value): LatLongPoint {
    const { x: lat, y: lon } = value;
    return { lat, lon };
  }
}
