import {
  useChannel,
  useParameter,
  useStorybookApi,
} from '@storybook/manager-api';
import { STORY_RENDERED } from '@storybook/core-events';
import type { StoryFn } from '@storybook/react';
import { DEFAULT_CONFIG, PARAM_KEY } from '../constants';
import { Separator } from '@storybook/components';
import MultiToolbar from './MultiToolbar';
import React, { Fragment, useState } from 'react';
import { MultiToolbarParams } from '../types';

const createToolbars = (toolbars: MultiToolbarParams[], story: StoryFn) => {
  return toolbars.filter((toolbar) => {
    if (toolbar.filter) {
      if (typeof toolbar.filter === 'function') {
        return toolbar.filter(story);
      }
      // @ts-ignore
      return toolbar.filter.test(story.kind);
    }
    return true;
  });
};

const MultiTool: React.FC = () => {
  const multiToolbarConfig = useParameter(PARAM_KEY, DEFAULT_CONFIG);
  const [toolbars, setToolbars] = useState([] as MultiToolbarParams[]);
  const api = useStorybookApi();

  useChannel(
    {
      [STORY_RENDERED]: () =>
        setToolbars(
          createToolbars(
            multiToolbarConfig.toolbars,
            api.getCurrentStoryData() as unknown as StoryFn
          )
        ),
    },
    [multiToolbarConfig]
  );

  if (multiToolbarConfig.disable || toolbars.length === 0) {
    return null;
  }

  return (
    <>
      <Separator />

      {toolbars.map((toolbar, index) => (
        <Fragment key={toolbar.param}>
          {index !== 0 && toolbar.separator && <Separator />}
          <MultiToolbar toolbar={toolbar} />
        </Fragment>
      ))}
    </>
  );
};

export default MultiTool;
