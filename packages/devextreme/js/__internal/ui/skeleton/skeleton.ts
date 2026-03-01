import registerComponent from '@js/core/component_registrator';
import type { Properties } from '@js/ui/skeleton';
import Widget from '@ts/core/widget/widget';

class Skeleton extends Widget<Properties> { }

registerComponent('dxSkeleton', Skeleton);

export default Skeleton;
