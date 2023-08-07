import { keyboardNavigationModule } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import { keyboardNavigationScrollableA11yModule } from '@ts/grids/grid_core/keyboard_navigation/scrollable_a11y';

import gridCore from '../m_core';

gridCore.registerModule('keyboardNavigation', keyboardNavigationModule);
gridCore.registerModule('keyboardNavigationScrollableA11y', keyboardNavigationScrollableA11yModule);
