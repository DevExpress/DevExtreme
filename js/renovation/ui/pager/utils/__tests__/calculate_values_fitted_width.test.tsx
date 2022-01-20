import { calculateValuesFittedWidth } from '../calculate_values_fitted_width';
import { isMaterial, isCompact } from '../../../../../ui/themes';

jest.mock('../../../../../ui/themes');

describe('calculateValuesFittedWidth depends on theme', () => {
  it('material theme', () => {
    (isMaterial as jest.Mock).mockReturnValue(true);
    (isCompact as jest.Mock).mockReturnValue(false);

    const width = calculateValuesFittedWidth(10, [10, 100]);
    expect(width).toBe(62);
  });

  it('material compact theme', () => {
    (isMaterial as jest.Mock).mockReturnValue(true);
    (isCompact as jest.Mock).mockReturnValue(true);

    const width = calculateValuesFittedWidth(10, [10, 100]);
    expect(width).toBe(40);
  });

  it('generic theme', () => {
    (isMaterial as jest.Mock).mockReturnValue(false);
    (isCompact as jest.Mock).mockReturnValue(false);

    const width = calculateValuesFittedWidth(10, [10, 100]);
    expect(width).toBe(40);
  });

  it('generic compact theme', () => {
    (isMaterial as jest.Mock).mockReturnValue(false);
    (isCompact as jest.Mock).mockReturnValue(true);

    const width = calculateValuesFittedWidth(10, [10, 100]);
    expect(width).toBe(40);
  });
});
