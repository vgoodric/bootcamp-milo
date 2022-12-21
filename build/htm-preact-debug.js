import 'preact/debug'; // eslint-disable-line import/extensions
import { h, Component, createContext, createRef, render } from 'preact';
import { signal } from '@preact/signals';
import {
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useDebugValue,
  useErrorBoundary,
  useId,
} from 'preact/hooks'; // eslint-disable-line import/extensions
import htm from 'htm';

const html = htm.bind(h);

export {
  h,
  html,
  signal,
  render,
  Component,
  createContext,
  createRef,
  useState,
  useReducer,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  useContext,
  useDebugValue,
  useErrorBoundary,
  useId,
};
