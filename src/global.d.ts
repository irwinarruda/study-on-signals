export {};

import * as solid from "solid-js";

declare global {
  const createSignal: typeof solid.createSignal;
  const createEffect: typeof solid.createEffect;
  const createMemo: typeof solid.createMemo;
  const createRoot: typeof solid.createRoot;
  const createRenderEffect: typeof solid.createRenderEffect;
  const createDeferred: typeof solid.createDeferred;
  const createResource: typeof solid.createResource;
  const createSelector: typeof solid.createSelector;
  const createComputed: typeof solid.createComputed;
  const createReaction: typeof solid.createReaction;
  const on: typeof solid.on;
  const onCleanup: typeof solid.onCleanup;
  const onMount: typeof solid.onMount;
  const onError: typeof solid.onError;
  const untrack: typeof solid.untrack;
  const batch: typeof solid.batch;
  const startTransition: typeof solid.startTransition;
  const enableScheduling: typeof solid.enableScheduling;
  const enableExternalSource: typeof solid.enableExternalSource;
  const getListener: typeof solid.getListener;
  const getOwner: typeof solid.getOwner;
  const runWithOwner: typeof solid.runWithOwner;
  const useContext: typeof solid.useContext;
  const createContext: typeof solid.createContext;
  const children: typeof solid.children;
  const equalFn: typeof solid.equalFn;
  const $DEVCOMP: typeof solid.$DEVCOMP;
  const $PROXY: typeof solid.$PROXY;
  const $TRACK: typeof solid.$TRACK;
}
