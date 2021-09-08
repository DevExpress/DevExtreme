import { getAugmentedLocation } from '../utils/get_augmented_location';

describe('Ensure location', () => {
  it('should convert number type to Location type', () => {
    expect(getAugmentedLocation(350)).toMatchObject({ top: 350, left: 350 });
  });

  it('should return Location type if input type is Location', () => {
    const location = { top: 345, left: 10 };
    expect(getAugmentedLocation(location)).toMatchObject(location);
  });

  it('should fill undefined value with value by default', () => {
    expect(getAugmentedLocation({ top: 100 })).toMatchObject({ top: 100, left: 0 });
    expect(getAugmentedLocation({ left: 100 })).toMatchObject({ left: 100, top: 0 });
    expect(getAugmentedLocation({})).toMatchObject({ top: 0, left: 0 });
  });
});
