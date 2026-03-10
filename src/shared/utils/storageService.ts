import type { AttributeValue } from '../../features/swatches/model/types';
import type { IProductCart } from '../../features/MultiProduct/model/types';

const STORAGE_KEYS = {
  SELECTED_MATERIALS: 'swatchcart_selected_materials',
  MULTI_PRODUCT_ITEMS: 'swatchcart_multi_product_items',
  CURRENT_ASSET_ID: 'swatchcart_current_asset_id',
} as const;

const STORAGE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface StoredData<T> {
  data: T;
  timestamp: number;
}

/**
 * Service for persisting and retrieving swatch selections from localStorage.
 * Data expires after 24 hours to prevent stale selections.
 */
export const StorageService = {
  /**
   * Stores selected materials (single product mode) to localStorage.
   */
  setSelectedMaterials(materials: AttributeValue[]): void {
    try {
      const storedData: StoredData<AttributeValue[]> = {
        data: materials,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        STORAGE_KEYS.SELECTED_MATERIALS,
        JSON.stringify(storedData),
      );
    } catch (error) {
      console.warn('Failed to persist selected materials:', error);
    }
  },

  /**
   * Retrieves selected materials from localStorage.
   * Returns empty array if data is expired or invalid.
   */
  getSelectedMaterials(): AttributeValue[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SELECTED_MATERIALS);
      if (!raw) return [];

      const stored: StoredData<AttributeValue[]> = JSON.parse(raw);
      const isExpired = Date.now() - stored.timestamp > STORAGE_EXPIRY_MS;

      if (isExpired) {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_MATERIALS);
        return [];
      }

      return Array.isArray(stored.data) ? stored.data : [];
    } catch (error) {
      console.warn('Failed to retrieve selected materials:', error);
      return [];
    }
  },

  /**
   * Clears selected materials from localStorage.
   */
  clearSelectedMaterials(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_MATERIALS);
    } catch (error) {
      console.warn('Failed to clear selected materials:', error);
    }
  },

  /**
   * Stores multi-product cart items to localStorage.
   */
  setMultiProductItems(items: IProductCart[]): void {
    try {
      const storedData: StoredData<IProductCart[]> = {
        data: items,
        timestamp: Date.now(),
      };
      localStorage.setItem(
        STORAGE_KEYS.MULTI_PRODUCT_ITEMS,
        JSON.stringify(storedData),
      );
    } catch (error) {
      console.warn('Failed to persist multi-product items:', error);
    }
  },

  /**
   * Retrieves multi-product cart items from localStorage.
   * Returns empty array if data is expired or invalid.
   */
  getMultiProductItems(): IProductCart[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.MULTI_PRODUCT_ITEMS);
      if (!raw) return [];

      const stored: StoredData<IProductCart[]> = JSON.parse(raw);
      const isExpired = Date.now() - stored.timestamp > STORAGE_EXPIRY_MS;

      if (isExpired) {
        localStorage.removeItem(STORAGE_KEYS.MULTI_PRODUCT_ITEMS);
        return [];
      }

      return Array.isArray(stored.data) ? stored.data : [];
    } catch (error) {
      console.warn('Failed to retrieve multi-product items:', error);
      return [];
    }
  },

  /**
   * Clears multi-product cart items from localStorage.
   */
  clearMultiProductItems(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.MULTI_PRODUCT_ITEMS);
    } catch (error) {
      console.warn('Failed to clear multi-product items:', error);
    }
  },

  /**
   * Stores the current product assetId.
   */
  setCurrentAssetId(assetId: string): void {
    try {
      const prevAssetId = this.getCurrentAssetId();

      if (prevAssetId && prevAssetId !== assetId) this.clearSelectedMaterials();

      localStorage.setItem(STORAGE_KEYS.CURRENT_ASSET_ID, assetId);
    } catch (error) {
      console.warn('Failed to persist current assetId:', error);
    }
  },

  /**
   * Retrieves the stored product assetId.
   */
  getCurrentAssetId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_ASSET_ID);
    } catch (error) {
      console.warn('Failed to retrieve current assetId:', error);
      return null;
    }
  },

  /**
   * Clears all stored swatch selections.
   */
  clearAll(): void {
    this.clearSelectedMaterials();
    this.clearMultiProductItems();
  },
};
