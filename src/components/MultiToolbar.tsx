import type { MultiToolbarList, MultiToolbarParams } from '../types';
import { addons } from '@storybook/manager-api';
import { useGlobals, useGlobalTypes } from '@storybook/manager-api';
import { FORCE_RE_RENDER } from '@storybook/core-events';
import React, { useCallback, useEffect, useState } from 'react';
import { IconButton, Icons, WithTooltip } from '@storybook/components';
import MultiToolbarLists from './MultiToolbarLists';

type Props = { toolbar: MultiToolbarParams };

const createToolbarValues = (
  values: Record<string, unknown>
): Record<string, unknown> => {
  return Object.entries(values).reduce((acc, [key, value]) => {
    acc[key] = value;

    if (typeof value === 'string') {
      try {
        acc[key] = JSON.parse(value);
      } catch (err) {
        // ignore
      }
    }

    return acc;
  }, {} as Record<string, unknown>);
};

const MultiToolbar: React.FC<Props> = ({ toolbar }) => {
  const [globals, updateGlobals] = useGlobals();
  const [active, setActive] = useState(false);
  const globalTypes = useGlobalTypes();

  const values = React.useMemo(
    () => createToolbarValues(globals[toolbar.param] || {}),
    [globals]
  );

  useEffect(() => {
    if (globalTypes[toolbar.param]) {
      setActive(
        JSON.stringify(globalTypes[toolbar.param].defaultValue) !==
          JSON.stringify(values)
      );
    }
  }, [globals, values]);

  useEffect(() => {
    updateGlobals({
      ...globals,
      [toolbar.param]: {
        ...globalTypes[toolbar.param].defaultValue,
        ...values,
      },
    });
    addons.getChannel().emit(FORCE_RE_RENDER);
  }, []);

  const onChange = useCallback(
    (list: MultiToolbarList, value: unknown, param: string) => {
      const newValues = {
        ...globals,
        [toolbar.param]: {
          ...values,
          [param]: value,
        },
      };
      // toggle
      if (list.type === 'toggle') {
        if (typeof value === 'undefined') {
          if (
            Object.prototype.hasOwnProperty.call(
              globals?.[toolbar.param],
              param
            )
          ) {
            newValues[toolbar.param][param] = !globals[toolbar.param][param];
          } else {
            newValues[toolbar.param][param] =
              !globalTypes[toolbar.param].defaultValue[param];
          }
        } else if (globals?.[toolbar.param]?.[param] === value) {
          delete newValues[toolbar.param][param];
        } else {
          newValues[toolbar.param][param] = value;
        }
      }
      updateGlobals(newValues);
      addons.getChannel().emit(FORCE_RE_RENDER);
    },
    [values, globals]
  );

  return (
    <WithTooltip
      tooltip={({ onHide }) => (
        <MultiToolbarLists
          activeValue={values}
          lists={toolbar.lists}
          onChange={(list, value, param) => {
            onChange(list, value, param);
            onHide();
          }}
        />
      )}
      trigger="click"
      closeOnOutsideClick
    >
      {/* @ts-ignore */}
      <IconButton active={active} title={toolbar.description || toolbar.name}>
        <Icons icon={toolbar.icon || 'structure'} />
        {toolbar.title ? `\xa0${toolbar.title}` : null}
      </IconButton>
    </WithTooltip>
  );
};

export default MultiToolbar;
