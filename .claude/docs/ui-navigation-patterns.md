# UI & Navigation Patterns

Conventions établies pour la navigation, les headers et le layout de l'app mobile.

## Tab Bar

- Custom **floating glass tab bar** (`GlassBubbleTabBar`) positionnée en `absolute`, fond transparent.
- La tab bar remonte sa hauteur réelle via `BottomTabBarHeightCallbackContext` (React Navigation) avec `onLayout` → `onTabBarHeight?.(insets.bottom + 8 + height)`.
- Le contenu scrollable doit consommer `BottomTabBarHeightContext` pour calculer son `paddingBottom` et éviter d'être masqué.

## Headers des onglets

| Onglet | Header | Comportement |
|---|---|---|
| **Home (`index`)** | Custom `HomeClassifiedHeader` | Collapsible : titre « Accueil » se rétracte au scroll, seule la barre de recherche reste sticky |
| **Activité** | Header natif React Navigation | Titre centré « Activité » |
| **Glass** | Header natif React Navigation | Titre centré « Glass » |
| **Paramètres** | Header natif React Navigation | Titre centré « Paramètres » |

- Dans le tabs `_layout.tsx` : `screenOptions.headerShown: true` par défaut, **sauf** `index` qui a `headerShown: false` (gère son propre header).
- Les headers natifs utilisent `Fonts.sans`, `fontWeight: '600'`, `fontSize: 17`, `headerShadowVisible: false`.

## Collapsible Header (Home)

Pattern à réutiliser pour tout écran nécessitant un header qui se collapse au scroll :

1. **Écran** : ne pas utiliser `AppShell` mais un `View flex:1` avec le header au-dessus et `Animated.ScrollView` en dessous.
2. **Shared value** : `const scrollY = useSharedValue(0)` + `useAnimatedScrollHandler` sur le scroll.
3. **Header component** : reçoit `scrollY: SharedValue<number>` en prop.
4. **Animation** : `useAnimatedStyle` avec `interpolate(scrollY.value, [0, TITLE_HEIGHT], [0, 1], 'clamp')` pour animer `height`, `opacity`, `transform` de la zone collapsible.
5. **Search bar** reste fixe (pas animée), le titre au-dessus se rétracte.
6. **Border separator** : un `Animated.View` avec `opacity` liée au progress pour faire apparaître un `borderBottomWidth: hairlineWidth` quand le titre a disparu.

### Référence d'implémentation

```
components/app/home-classified-header.tsx  → composant header collapsible
app/(app)/(tabs)/index.tsx                 → écran Home (Animated.ScrollView + scrollY)
```

## AppShell

Composant wrapper réutilisable pour les écrans standards (tout sauf Home) :

- `scroll` : active le `ScrollView` interne.
- `safeAreaEdges` : par défaut `['left', 'right']` quand un header natif gère le top.
- `bottomInsetMode: 'tabBar'` : utilise `BottomTabBarHeightContext` pour le padding bas.
- `topInset` : petit gap entre le header et le premier contenu (défaut `8`).

## Bottom padding (tab screens)

- Tout écran dans les tabs doit réserver un `paddingBottom` = `tabBarHeight + 28` (ou fallback `max(24, insets.bottom + 12)` hors tabs).
- Sur Home (`index.tsx`), ce calcul est fait manuellement via `useContext(BottomTabBarHeightContext)`.
- Sur les autres onglets, `AppShell` le fait automatiquement.

## SafeArea

- Les écrans dans les tabs avec header natif : `safeAreaEdges={['left', 'right']}` (le header gère le top).
- La Home : pas de SafeArea sur top (le header custom gère `insets.top + 8` lui-même).
- Les écrans publics (auth) : `safeAreaEdges` selon besoin, pas de tab bar.
