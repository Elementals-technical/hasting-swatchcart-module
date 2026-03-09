# План тестування проблеми FETCH_DATA_PRODUCT

## Опис проблеми

- **Тип даних**: `EDataInputType.FETCH_DATA_PRODUCT`
- **Симптоми**: Іноді вибір свотчів зберігається при переході між продуктами, іноді - скидається
- **Спостереження**: `swatchcart_current_asset_id` завжди змінюється при відкритті нового продукту
- **Середовище**: Сторінка перезагружається при переході між продуктами

## Виявлені потенційні проблеми

### 1. **Race Condition у useEffect hooks**

**Локація**: [lib/components/SwatchesModule.tsx](lib/components/SwatchesModule.tsx#L63-L177)

**Проблема**:

- Два useEffect виконуються незалежно:
  - useEffect #1 (L63-70): Перевіряє assetId і робить reset
  - useEffect #2 (L72-177): Завантажує дані продукту
- Немає гарантії порядку виконання

**Сценарій помилки**:

```
1. Користувач відкриває Product A → localStorage зберігає swatches
2. Відкривається Product B:
   a. useEffect #2 може почати завантаження до useEffect #1
   b. useEffect #1 викликає resetSelectedMaterials()
   c. Дані скидаються після/під час завантаження
   → Нестабільна поведінка
```

---

### 2. **UUID генерація при кожній трансформації даних**

**Локація**: [src/features/DataAdapter/lib/DataAdapterServices.ts](src/features/DataAdapter/lib/DataAdapterServices.ts#L135-L148)

**Проблема**:

- `uuidv4()` генерує новий ID для кожного матеріалу при КОЖНОМУ виклику `getTransformedFetchProductData`
- При порівнянні з localStorage (де збережені старі UUID) - співпадіння не знайдеться
- Один і той же матеріал має різні ID при різних завантаженнях

**Код проблеми**:

```typescript
const allMaterialValues = materialsWithGroup.flatMap((item) => {
  return (item.valuesArray ?? []).map((v) => ({
    ...v,
    parentName,
    optionName: optionName,
    productInformation: selectedProduct || "Product wasn't found",
    id: uuidv4(), // ⚠️ Новий UUID щоразу!
  }));
});
```

**Наслідки**:

- Збережені свотчі мають старі ID
- Нові дані мають інші ID
- Система не може ідентифікувати що це той самий матеріал

---

### 3. **Async timing при зміні продукту**

**Проблема**:

- `resetSelectedMaterials()` виконується синхронно
- `fetchProductDetails()` виконується асинхронно
- `StorageService.setCurrentAssetId()` виконується синхронно
- Middleware зберігає зміни асинхронно

**Можливий flow помилки**:

```
1. assetId змінюється на Product B
2. setCurrentAssetId("B") → localStorage
3. resetSelectedMaterials() → dispatch → middleware → localStorage (async)
4. fetchProductDetails() починається
5. getTransformedData генерує нові UUID
6. Middleware ще не встиг записати reset в localStorage
   → Старі дані все ще там
```

---

### 4. **Cleanup функція в useEffect**

**Локація**: [lib/components/SwatchesModule.tsx](lib/components/SwatchesModule.tsx#L167-177)

**Проблема**:

```typescript
return () => {
  filteredConfigData?.forEach((item) => {
    dispatch(setSelectedMaterial({ ... })); // ⚠️ Dispatch при unmount!
  });
};
```

**Проблеми**:

- Dispatch викликається при unmount компонента
- `filteredConfigData` може бути undefined
- Може викликати dispatch на вже неактивний компонент

---

### 5. **Відсутність clear матеріалів при зміні продукту**

**Проблема**:

- `resetSelectedMaterials()` очищає Redux state
- Але `allMaterialsValues` та `productElementOptions` НЕ очищаються
- При швидкому переключенні можливий мікс даних з різних продуктів

---

## План тестування

### A. Тестування Race Condition

#### Test 1: Швидке перемикання між продуктами

**Кроки**:

1. Відкрити Product A (записати assetId)
2. Вибрати 2-3 свотчі
3. ОДРАЗУ відкрити Product B (не чекати)
4. Перевірити localStorage: `swatchcart_selected_materials`
5. Перевірити Redux state: `selectedMaterials`

**Очікуваний результат**: Має бути порожньо (reset спрацював)
**Можливий баг**: Залишились старі дані з Product A

**Логування**:

```javascript
// Додати в useEffect (L63-70)
console.log('[RESET-CHECK] storedAssetId:', storedAssetId);
console.log('[RESET-CHECK] new assetId:', assetId);
console.log('[RESET-CHECK] Will reset:', storedAssetId !== assetId);
console.log('[RESET-CHECK] Timestamp:', Date.now());

// Додати в useEffect (L72)
console.log('[DATA-LOAD] Started at:', Date.now());
```

---

#### Test 2: Затримка між відкриттям продуктів

**Кроки**:

1. Відкрити Product A
2. Вибрати 2-3 свотчі
3. Зачекати 2-3 секунди
4. Відкрити Product B
5. Перевірити чи очистились дані

**Очікуваний результат**: Має бути порожньо
**Мета**: Перевірити чи проблема в timing

---

### B. Тестування UUID consistency

#### Test 3: Перевірка UUID матеріалів

**Кроки**:

1. Відкрити Product A
2. Отримати allMaterialValues з Redux
3. Записати ID першого матеріалу: `materialId1`
4. Закрити і заново відкрити Product A
5. Отримати allMaterialValues знову
6. Порівняти ID того ж матеріалу: `materialId2`

**Очікуваний результат**: ID має бути різним (баг!)
**Тест підтверджує**: UUID генерується щоразу заново

**Код для console**:

```javascript
// В Redux DevTools або console
const materials = store.getState().swatches.allMaterialsValues;
console.log(
  'Material IDs:',
  materials.map((m) => ({ label: m.label, id: m.id })),
);
```

---

#### Test 4: Порівняння збережених даних

**Кроки**:

1. Відкрити Product A
2. Вибрати матеріал "Red Fabric" (id: uuid-123)
3. Перевірити localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('swatchcart_selected_materials'));
   ```
4. Закрити і відкрити Product A знову
5. Перевірити чи новий "Red Fabric" має інший UUID

**Очікуваний баг**: Система не розпізнає що це той самий матеріал

---

### C. Тестування persistence logic

#### Test 5: Перевірка порядку операцій

**Кроки**:

1. Додати interceptor у localStorage:
   ```javascript
   const originalSetItem = localStorage.setItem;
   localStorage.setItem = function (key, value) {
     console.log('[LS-SET]', key, value, new Date().toISOString());
     return originalSetItem.apply(this, arguments);
   };
   ```
2. Відкрити Product A → вибрати свотчі → відкрити Product B
3. Проаналізувати порядок записів у localStorage

**Очікуваний порядок**:

```
[LS-SET] swatchcart_current_asset_id "product-B" 10:00:00.100
[LS-SET] swatchcart_selected_materials [] 10:00:00.150
```

**Можливий баг**:

```
[LS-SET] swatchcart_current_asset_id "product-B" 10:00:00.100
[LS-SET] swatchcart_selected_materials [старі дані] 10:00:00.050 ← запис до reset!
```

---

#### Test 6: Middleware timing

**Кроки**:

1. Додати логування в storageMiddleware:
   ```typescript
   if (SWATCHES_PERSIST_ACTIONS.has(actionType)) {
     console.log(
       '[MIDDLEWARE]',
       actionType,
       Date.now(),
       state.swatches.selectedMaterials,
     );
     StorageService.setSelectedMaterials(state.swatches.selectedMaterials);
   }
   ```
2. Відкрити Product A → вибрати → Product B
3. Подивитись timing між action і записом

**Мета**: Виявити асинхронність між dispatch і localStorage

---

### D. Тестування cleanup функції

#### Test 7: Unmount behavior

**Кроки**:

1. Додати console.log в cleanup (L167):
   ```typescript
   return () => {
     console.log('[CLEANUP] filteredConfigData:', filteredConfigData);
     console.log('[CLEANUP] Running at:', Date.now());
     filteredConfigData?.forEach((item) => {
       console.log('[CLEANUP] Dispatching:', item);
       dispatch(setSelectedMaterial({ ... }));
     });
   };
   ```
2. Відкрити Product A з configurationData
3. Швидко перейти на Product B
4. Перевірити чи cleanup викликається і коли

**Можливий баг**: Cleanup додає дані ПІСЛЯ того як відбувся reset

---

### E. Реальні user scenarios

#### Test 8: Типовий user flow

**Кроки**:

1. Користувач відкриває Product A
2. Вибирає 3 свотчі
3. Закриває панель (isOpen=false)
4. Відкриває Product B
5. Перевірити: чи порожня панель?

**Повторити**: 10 разів для виявлення нестабільності

---

#### Test 9: Швидке перемикання (stress test)

**Кроки**:

1. Відкрити Product A → вибрати свотчі
2. За 1 секунду відкрити Product B
3. За 1 секунду відкрити Product C
4. За 1 секунду повернутись до Product A
5. Перевірити стан

**Очікуваний результат**: Product A має бути порожнім (новий assetId)
**Можливий баг**: Залишились старі свотчі або мікс даних

---

#### Test 10: Перезавантаження сторінки

**Кроки**:

1. Відкрити Product A
2. Вибрати свотчі
3. Перезавантажити сторінку (F5)
4. Відкрити той же Product A знову
5. Перевірити чи завантажились свотчі

**Варіація A**: Відкрити інший Product B після reload
**Очікувано**: Порожньо

---

### F. Edge cases

#### Test 11: Однаковий продукт повторно

**Кроки**:

1. Відкрити Product A
2. Вибрати свотчі
3. Закрити панель
4. Відкрити той же Product A знову
5. Перевірити: чи свотчі збереглись?

**Очікувано**: ТАК (assetId не змінився)
**Можливий баг**: Скинулось через помилку в порівнянні

---

#### Test 12: Порожній assetId

**Кроки**:

1. Передати `assetId={undefined}` або `assetId={''}`
2. Спробувати вибрати свотчі
3. Перевірити localStorage

**Очікувано**: Помилка або skip логіки

---

#### Test 13: Дуже довгий assetId

**Кроки**:

1. Передати `assetId={'a'.repeat(10000)}`
2. Перевірити чи працює localStorage
3. Відкрити інший продукт

**Мета**: Перевірити edge case storage limits

---

## Інструменти для тестування

### 1. Redux DevTools

```javascript
// Відстежити actions
swatches / resetSelectedMaterials;
swatches / setSelectedMaterial;
swatches / setAllMaterialsOptions;
```

### 2. Browser DevTools

```javascript
// Моніторинг localStorage
window.addEventListener('storage', (e) => {
  console.log('[STORAGE-EVENT]', e.key, e.oldValue, e.newValue);
});
```

### 3. Custom logger

```typescript
// Додати в SwatchesModule
useEffect(() => {
  console.group('🔍 Product Change Detection');
  console.log('assetId:', assetId);
  console.log('storedAssetId:', StorageService.getCurrentAssetId());
  console.log('selectedMaterials count:', selectedMaterials.length);
  console.log(
    'localStorage:',
    localStorage.getItem('swatchcart_selected_materials'),
  );
  console.groupEnd();
}, [assetId, selectedMaterials]);
```

### 4. Performance timeline

```javascript
performance.mark('product-opened');
performance.mark('data-loaded');
performance.mark('materials-set');
performance.measure('load-time', 'product-opened', 'materials-set');
console.log(performance.getEntriesByType('measure'));
```

---

## Метрики успішності тестування

### Критерії PASS

- ✅ При зміні продукту: selectedMaterials завжди порожній
- ✅ UUID стабільні для одного продукту в межах сесії (бажано)
- ✅ localStorage синхронізований з Redux state
- ✅ Немає race conditions (10/10 тестів проходять однаково)
- ✅ При поверненні до того ж продукту: дані зберігаються

### Критерії FAIL

- ❌ 1+ з 10 повторень дає різний результат
- ❌ Старі дані залишаються після зміни assetId
- ❌ localStorage не синхронізований
- ❌ Помилки в console при перемиканні
- ❌ Cleanup викликає unexpected state changes

---

## Очікувані результати

### Гіпотеза #1: UUID Problem

**Ймовірність**: 🔴 ВИСОКА (80%)

При зміні продукту:

1. localStorage зберігає старі UUID
2. Reset очищає state
3. Нові дані мають інші UUID
4. При спробі restore - не знаходить співпадінь
5. → Виглядає як "іноді працює, іноді ні"

**Рішення**: Використовувати стабільний ключ для ідентифікації (optionName + value замість UUID)

### Гіпотеза #2: Race Condition

**Ймовірність**: 🟡 СЕРЕДНЯ (50%)

Reset і data loading виконуються в різному порядку залежно від:

- Швидкості мережі
- React render timing
- Browser event loop

**Рішення**: Об'єднати useEffect або додати async/await контроль

### Гіпотеза #3: Middleware Timing

**Ймовірність**: 🟢 НИЗЬКА (20%)

Middleware може записувати в localStorage з затримкою

**Рішення**: Зробити синхронний запис або додати await

---

## Рекомендації по виправленню

### Fix #1: Stable Material ID (ПРІОРИТЕТ 1)

```typescript
// Замість uuid()
id: `${optionName}_${v.value}_${parentName}`; // Детермінований ID
```

### Fix #2: Unified useEffect (ПРІОРИТЕТ 2)

```typescript
useEffect(() => {
  if (!assetId || !isSingleProduct) return;

  const storedAssetId = StorageService.getCurrentAssetId();

  // Спочатку перевірка і reset
  if (storedAssetId && storedAssetId !== assetId) {
    dispatch(resetSelectedMaterials());
  }
  StorageService.setCurrentAssetId(assetId);

  // ПОТІМ завантаження даних
  if (uiDataType === EDataInputType.FETCH_DATA_PRODUCT) {
    fetchProductDetails();
  }
}, [assetId, uiDataType]);
```

### Fix #3: Remove cleanup dispatch (ПРІОРИТЕТ 3)

```typescript
// Видалити cleanup або перенести логіку
```

### Fix #4: Add loading state (ПРІОРИТЕТ 4)

```typescript
const [isResetting, setIsResetting] = useState(false);

// Не показувати UI поки не завершено reset
if (isResetting) return <Loader />;
```

---

## Чек-лист тестування

- [ ] Test 1: Швидке перемикання
- [ ] Test 2: Затримка між продуктами
- [ ] Test 3: UUID consistency
- [ ] Test 4: Збережені дані
- [ ] Test 5: Порядок операцій
- [ ] Test 6: Middleware timing
- [ ] Test 7: Unmount behavior
- [ ] Test 8: Типовий flow (x10)
- [ ] Test 9: Stress test
- [ ] Test 10: Reload сторінки
- [ ] Test 11: Той самий продукт
- [ ] Test 12: Edge case: empty assetId
- [ ] Test 13: Edge case: довгий assetId

---

## Додаткові нотатки

### Важливі файли для debugging

- [lib/components/SwatchesModule.tsx](lib/components/SwatchesModule.tsx)
- [src/features/DataAdapter/lib/DataAdapterServices.ts](src/features/DataAdapter/lib/DataAdapterServices.ts)
- [src/app/store/storageMiddleware.ts](src/app/store/storageMiddleware.ts)
- [src/shared/utils/storageService.ts](src/shared/utils/storageService.ts)
- [src/features/swatches/model/swatchesSlice.ts](src/features/swatches/model/swatchesSlice.ts)

### localStorage keys

- `swatchcart_current_asset_id` - ID поточного продукту
- `swatchcart_selected_materials` - Вибрані свотчі (з timestamp)
- `swatchcart_multi_product_items` - Multi-product кошик

### Redux actions для моніторингу

- `swatches/resetSelectedMaterials`
- `swatches/setSelectedMaterial`
- `swatches/setAllMaterialsOptions`
- `swatches/removeItem`
- `swatches/setCount`
