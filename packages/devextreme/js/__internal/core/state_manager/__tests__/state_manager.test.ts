/* eslint-disable @typescript-eslint/init-declarations */
import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { StateManager } from '../state_manager';
import { deepCopy } from '../utils';
import {
  MockArrayStatePlugin,
  MockControllerRegistry,
  MockDevToolsConnector,
  MockLogger,
  MockObjectStatePlugin,
  MockStateHistory,
  MockStateTracker,
} from './mocks';

interface ProductItem {
  id: number;
  name: string;
  price: number;
}

interface CartItem extends ProductItem {
  quantity: number;
}

interface CartTotal {
  [key: string]: unknown;
  value: number;
  currency: string;
}

describe('StateManager', () => {
  let controllerRegistry: MockControllerRegistry;
  let objectPlugin: MockObjectStatePlugin;
  let arrayPlugin: MockArrayStatePlugin;
  let stateTracker: MockStateTracker;
  let stateHistory: MockStateHistory;
  let devToolsConnector: MockDevToolsConnector;
  let logger: MockLogger;
  let stateManager: StateManager;

  beforeEach(() => {
    controllerRegistry = new MockControllerRegistry();
    objectPlugin = new MockObjectStatePlugin();
    arrayPlugin = new MockArrayStatePlugin();
    stateTracker = new MockStateTracker([objectPlugin, arrayPlugin]);
    stateHistory = new MockStateHistory();
    devToolsConnector = new MockDevToolsConnector();
    logger = new MockLogger();

    stateManager = new StateManager({
      controllerRegistry,
      stateTracker,
      stateHistory,
      devToolsConnector,
      logger,
    });
  });

  describe('Base functionality', () => {
    it('should persist and restore application state', () => {
      const userPreferences = {
        settings: { theme: 'light', fontSize: 14 },
      };

      const cartController = {
        items: [] as CartItem[],
        total: { value: 0, currency: 'USD' } as CartTotal,
      };

      stateManager.registerController(userPreferences, 'userPreferences');
      stateManager.registerController(cartController, 'cart');

      const initialState = {
        userPreferences: {
          settings: deepCopy(userPreferences.settings),
        },
        cart: {
          items: deepCopy(cartController.items),
          total: deepCopy(cartController.total),
        },
      };

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'dark',
      );

      cartController.items.push({
        id: 1, name: 'Product 1', price: 10, quantity: 1,
      });
      objectPlugin.simulatePropertyChange(
        cartController.total,
        'total',
        'value',
        10,
      );

      expect(userPreferences.settings.theme).toBe('dark');
      expect(cartController.items).toHaveLength(1);
      expect(cartController.total.value).toBe(10);

      stateManager.restoreState(initialState);

      expect(userPreferences.settings.theme).toBe('light');
      expect(cartController.items).toHaveLength(0);
      expect(cartController.total.value).toBe(0);
    });

    it('should reset state to initial values', () => {
      const userPreferences = {
        settings: { theme: 'light', fontSize: 14 },
      };

      const cartController = {
        items: [] as CartItem[],
        total: { value: 0, currency: 'USD' } as CartTotal,
      };

      stateManager.registerController(userPreferences, 'userPreferences');
      stateManager.registerController(cartController, 'cart');

      const initialStateChange = {
        actionType: 'INITIALIZE',
        payload: {
          path: 'userPreferences.settings',
          newValue: deepCopy(userPreferences.settings),
          timestamp: Date.now(),
          source: 'initialization',
          previousValue: undefined,
        },
      } as const;
      stateHistory.recordChange(initialStateChange);

      const initialCartItemsChange = {
        actionType: 'INITIALIZE',
        payload: {
          path: 'cart.items',
          newValue: deepCopy(cartController.items),
          timestamp: Date.now(),
          previousValue: undefined,
          source: 'initialization',
        },
      } as const;
      stateHistory.recordChange(initialCartItemsChange);

      const initialCartTotalChange = {
        actionType: 'INITIALIZE',
        payload: {
          path: 'cart.total',
          newValue: deepCopy(cartController.total),
          timestamp: Date.now(),
          previousValue: undefined,
          source: 'initialization',
        },
      } as const;
      stateHistory.recordChange(initialCartTotalChange);

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'dark',
      );

      cartController.items.push({
        id: 1, name: 'Product 1', price: 10, quantity: 1,
      });
      objectPlugin.simulatePropertyChange(
        cartController.total,
        'total',
        'value',
        10,
      );

      expect(userPreferences.settings.theme).toBe('dark');
      expect(cartController.items).toHaveLength(1);
      expect(cartController.total.value).toBe(10);

      stateManager.resetState();

      expect(userPreferences.settings.theme).toBe('light');
      expect(cartController.items).toHaveLength(0);
      expect(cartController.total.value).toBe(0);
    });

    it('should update state using different path formats', () => {
      const userPreferences = {
        settings: { theme: 'light', fontSize: 14 },
      };

      const cartController = {
        items: [] as CartItem[],
        total: { value: 0, currency: 'USD' } as CartTotal,
      };

      stateManager.registerController(userPreferences, 'userPreferences');
      stateManager.registerController(cartController, 'cart');

      stateManager.updateState('userPreferences.settings', { theme: 'dark', fontSize: 16 });

      expect(userPreferences.settings.theme).toBe('dark');
      expect(userPreferences.settings.fontSize).toBe(16);

      stateManager.updateState('cart.items', [
        {
          id: 1, name: 'Product 1', price: 10, quantity: 1,
        },
      ]);

      expect(cartController.items).toHaveLength(1);
      expect(cartController.items[0].name).toBe('Product 1');

      stateManager.updateState('cart.total', { value: 10, currency: 'EUR' });
      expect(cartController.total.value).toBe(10);
      expect(cartController.total.currency).toBe('EUR');
    });

    it('should detect and track different types of state properties', () => {
      const controller = {
        preferences: { theme: 'light', fontSize: 14 },
        recentItems: ['item1', 'item2'],
        isOrdered: false,
        callback: () => {},
      };

      stateManager.registerController(controller, 'mixedController');

      const state = stateTracker.getState();
      expect(state).toHaveProperty('mixedController.preferences');
      expect(state).toHaveProperty('mixedController.recentItems');

      expect(state.mixedController).not.toHaveProperty('isOrdered');

      objectPlugin.simulatePropertyChange(
        controller.preferences,
        'preferences',
        'theme',
        'dark',
      );

      controller.recentItems.push('item3');

      expect(stateHistory.getHistory()).toHaveLength(2);
    });
  });

  describe('History and time travel', () => {
    it('should track a sequence of state changes', () => {
      const userPreferences = {
        settings: { theme: 'light', fontSize: 14 },
      };

      const cartController = {
        items: [] as CartItem[],
        total: { value: 0, currency: 'USD' } as CartTotal,
      };

      stateManager.registerController(userPreferences, 'userPreferences');
      stateManager.registerController(cartController, 'cart');

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'dark',
      );

      cartController.items.push({
        id: 1, name: 'Product 1', price: 10, quantity: 1,
      });

      objectPlugin.simulatePropertyChange(
        cartController.total,
        'total',
        'value',
        10,
      );

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'fontSize',
        16,
      );

      const history = stateHistory.getHistory();
      expect(history).toHaveLength(4);

      expect(history[0].payload.path).toContain('userPreferences');
      expect(history[1].payload.path).toContain('cart.items');
      expect(history[2].payload.path).toContain('cart.total');
      expect(history[3].payload.path).toContain('userPreferences');

      const currentState = stateManager.getState();

      const userPreferencesState = currentState.userPreferences as
        Record<string, Record<string, unknown>>;
      const { settings } = userPreferencesState;
      expect(settings.theme).toBe('dark');
      expect(settings.fontSize).toBe(16);

      const cartState = currentState.cart;
      expect((cartState.items as unknown[]).length).toBe(1);
      expect((cartState.total as Record<string, unknown>).value).toBe(10);
    });

    it('should manage history with clear functionality', () => {
      const userPreferences = {
        settings: { theme: 'light', fontSize: 14 },
      };

      stateManager.registerController(userPreferences, 'userPreferences');

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'dark',
      );

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'fontSize',
        16,
      );

      expect(stateHistory.getHistory()).toHaveLength(2);

      stateManager.clearHistory();

      expect(userPreferences.settings.theme).toBe('dark');
      expect(userPreferences.settings.fontSize).toBe(16);

      expect(stateHistory.getHistory()).toHaveLength(0);

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'light',
      );

      expect(stateHistory.getHistory()).toHaveLength(1);
    });

    it('should integrate with observable collections', () => {
      const productListController = {
        items: [
          { id: 1, name: 'Product 1', price: 10 },
          { id: 2, name: 'Product 2', price: 20 },
        ] as ProductItem[],
      };

      const cartController = {
        items: [] as CartItem[],
        total: { value: 0, currency: 'USD' } as CartTotal,
      };

      stateManager.registerController(productListController, 'products');
      stateManager.registerController(cartController, 'cart');

      cartController.items.push(
        { ...productListController.items[0], quantity: 1 },
      );

      expect(stateHistory.getHistory()).toHaveLength(1);
      expect(stateHistory.getHistory()[0].payload.path).toBe('cart.items');

      cartController.items.pop();

      expect(stateHistory.getHistory()).toHaveLength(2);

      cartController.items.push(
        { ...productListController.items[0], quantity: 1 },
      );
      cartController.items.push(
        { ...productListController.items[1], quantity: 2 },
      );

      const stateToRestore = {
        cart: {
          items: [{
            id: 3, name: 'Product 3', price: 30, quantity: 3,
          }],
        },
      };

      stateManager.restoreState(stateToRestore);

      expect(cartController.items).toHaveLength(1);
      expect(cartController.items[0].id).toBe(3);

      const emptyCartState = stateHistory.getStateAt(1);
      stateManager.restoreState(emptyCartState);

      expect(cartController.items).toHaveLength(0);
    });
  });

  describe('External tools integration', () => {
    it('should interact with development tools', () => {
      const userPreferences = {
        settings: { theme: 'light', fontSize: 14 },
      };

      stateManager.registerController(userPreferences, 'userPreferences');

      const sendActionSpy = jest.spyOn(devToolsConnector, 'sendAction');

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'dark',
      );

      expect(sendActionSpy).toHaveBeenCalled();

      const stateFromDevTools = {
        userPreferences: {
          settings: { theme: 'system', fontSize: 18 },
        },
      };

      devToolsConnector.triggerExternalAction('JUMP_TO_STATE', stateFromDevTools);

      expect(userPreferences.settings.theme).toBe('system');
      expect(userPreferences.settings.fontSize).toBe(18);
    });
  });

  describe('Error handling and recovery', () => {
    it('should handle invalid or corrupted state gracefully', () => {
      const userPreferences = {
        settings: { theme: 'light', fontSize: 14 },
      };

      const cartController = {
        items: [] as CartItem[],
        total: { value: 0, currency: 'USD' } as CartTotal,
      };

      stateManager.registerController(userPreferences, 'userPreferences');
      stateManager.registerController(cartController, 'cart');

      const invalidState = {
        userPreferences: {
          settings: { theme: 'dark', fontSize: 16 },
        },
        nonExistentController: {
          someProperty: 'value',
        },
        cart: {
          nonExistentProperty: 'value',
          total: { value: 10, currency: 'EUR' },
        },
      };

      const warnSpy = jest.spyOn(logger, 'warn');

      stateManager.restoreState(invalidState);

      expect(warnSpy).toHaveBeenCalled();

      expect(userPreferences.settings.theme).toBe('dark');
      expect(userPreferences.settings.fontSize).toBe(16);
      expect(cartController.total.value).toBe(10);
      expect(cartController.total.currency).toBe('EUR');

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'light',
      );

      expect(userPreferences.settings.theme).toBe('light');

      stateManager.registerController(userPreferences, 'userPreferences');

      const errorSpy = jest.spyOn(logger, 'error');

      stateManager.updateState('invalidPath', 'value');
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockClear();

      stateManager.updateState('nonExistent.property', 'value');
      expect(errorSpy).toHaveBeenCalled();
      errorSpy.mockClear();

      stateManager.updateState('userPreferences.nonExistent', 'value');
      expect(errorSpy).toHaveBeenCalled();

      expect(userPreferences.settings.theme).toBe('light');
      expect(userPreferences.settings.fontSize).toBe(16);

      objectPlugin.simulatePropertyChange(
        userPreferences.settings,
        'settings',
        'theme',
        'dark',
      );

      expect(userPreferences.settings.theme).toBe('dark');
    });
  });
});
