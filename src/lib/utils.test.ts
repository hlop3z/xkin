// @ts-nocheck

import { describe, it, expect } from 'vitest';
import { isString, blankForm, objectToClass, objectToStyle } from './utils';

describe('isString', () => {
  it('returns true for string primitives', () => {
    expect(isString('hello')).toBe(true);
  });

  it('returns true for String objects', () => {
    expect(isString(new String('hello'))).toBe(true);
  });

  it('returns false for non-string values', () => {
    expect(isString(123)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString([])).toBe(false);
  });
});

describe('blankForm', () => {
  it('executes functions in the object', () => {
    const input = {
      name: 'John',
      age: () => 30,
      isActive: () => true
    };
    
    const result = blankForm(input);
    expect(result).toEqual({
      name: 'John',
      age: 30,
      isActive: true
    });
  });

  it('preserves non-function values', () => {
    const input = {
      a: 1,
      b: 'string',
      c: true,
      d: null
    };
    
    const result = blankForm(input);
    expect(result).toEqual(input);
  });
});

describe('objectToClass', () => {
  it('returns a trimmed string as is', () => {
    expect(objectToClass('  class1 class2  ')).toBe('class1 class2');
  });

  it('processes arrays by joining truthy values', () => {
    expect(objectToClass(['class1', false && 'class2', 'class3'])).toBe('class1 class3');
  });

  it('processes objects by joining keys with truthy values', () => {
    expect(objectToClass({
      class1: true,
      class2: false,
      class3: true
    })).toBe('class1 class3');
  });

  it('returns empty string for non-object, non-array, non-string inputs', () => {
    expect(objectToClass(null)).toBe('');
    expect(objectToClass(undefined)).toBe('');
    expect(objectToClass(123)).toBe('');
  });
});

describe('objectToStyle', () => {
  it('processes strings by ensuring a trailing semicolon', () => {
    expect(objectToStyle('color: red')).toBe('color: red;');
    expect(objectToStyle('color: red;')).toBe('color: red;');
  });

  it('processes objects by formatting key-value pairs as CSS rules', () => {
    expect(objectToStyle({
      color: 'red',
      'background-color': 'blue',
      display: '',
    })).toBe('color: red; background-color: blue;');
  });

  it('processes arrays by joining all style rules', () => {
    expect(objectToStyle(['color: red', { 'font-size': '12px' }])).toBe('color: red; font-size: 12px;');
  });

  it('returns empty string for non-object, non-array, non-string inputs', () => {
    expect(objectToStyle(null)).toBe('');
    expect(objectToStyle(undefined)).toBe('');
    expect(objectToStyle(123)).toBe('');
  });
}); 