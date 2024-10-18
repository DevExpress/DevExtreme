import registerComponent from '@js/core/component_registrator';
import Editor from '@js/ui/editor/editor';
import type { Properties } from '@js/ui/rating';

class Rating extends Editor<Properties> {

}

// @ts-expect-error
registerComponent('dxRating', Rating);

export default Rating;
