import Example, { ExampleProps } from './Example';
import type { StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'Example',
  component: Example,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

const Template: StoryFn<ExampleProps> = (args, context) => {
  console.log('context', context);
  return <Example data={context.globals} />;
};

export const Default = Template.bind({});

export const Another = Template.bind({});
