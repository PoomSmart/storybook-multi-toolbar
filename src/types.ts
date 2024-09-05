import type { IconsProps } from '@storybook/components';
import type { StoryFn } from '@storybook/react';

type MultiToolbarListItemBase = {
  title: string;
  left?: string;
  /**
   * Prepare with 'icon:<icon-key>' to display icon.
   * @see https://storybook.js.org/docs/react/faq#what-icons-are-available-for-my-toolbar-or-my-addon
   */
  right?: string;
  center?: string;
};

export type MultiToolbarListItemNormal = MultiToolbarListItemBase & {
  value: unknown;
  param?: never;
};

export type MultiToolbarListItemToggle = MultiToolbarListItemBase & {
  value?: unknown;
  param: string;
};

type MultiToolbarListBase = {
  title?: string;
};

type MultiToolbarListNormal = MultiToolbarListBase & {
  items: MultiToolbarListItemNormal[];
  param: string;
  type?: never;
};

type MultiToolbarListToggle = MultiToolbarListBase & {
  type: 'toggle';
  param?: never;
  items: MultiToolbarListItemToggle[];
};

export type MultiToolbarList = MultiToolbarListNormal | MultiToolbarListToggle;

export type MultiToolbarParams = {
  param: string;
  name: string;
  title?: string;
  description?: string;
  icon?: IconsProps['icon'];
  lists: MultiToolbarList[];
  /** Show separator between previous toolbar */
  separator?: boolean;
  /** Filter stories. RegExp tests against <code>StoryFn.kind</code>. */
  filter?: ((story: StoryFn) => boolean) | RegExp;
};

export type MultiToolbarParameters = {
  disable?: boolean;
  toolbars: MultiToolbarParams[];
};
