import React, { FC } from 'react';
import {
  removeNullCondition,
  SchemaSettings,
  SchemaSettingsBlockHeightItem,
  SchemaSettingsBlockTitleItem,
  SchemaSettingsCascaderItem,
  SchemaSettingsDataScope,
  SchemaSettingsSelectItem,
  SchemaSettingsSwitchItem,
  SchemaSettingsTemplate, useApp, useDesignable, useFormBlockContext,
} from '@nocobase/client';

import {
  DetailsBlockProvider,
  ISchema,
  Plugin,
  SchemaComponent,
  useDetailsPaginationProps,
  useDetailsWithPaginationDecoratorProps,
  useDetailsWithPaginationProps,
} from '@nocobase/client';



import {
  useCollection,
} from '@nocobase/client';

import {
  SchemaInitializerItemType,
  useSchemaComponentContext,
  useSchemaInitializer,
  useSchemaInitializerItem,
  withDynamicSchemaProps,
} from '@nocobase/client';

import {
  useDataBlockRequest,
} from '@nocobase/client';

import { BlockPlaygroundRecordName, BlockPlaygroundRecordLowercase } from '../constants';
import { CodeOutlined } from '@ant-design/icons';
import { useField, useFieldSchema } from '@formily/react';

export interface PlaygroundRecordProps {
  collectionName: string;
  data?: any[];
  loading?: boolean;
  // children?: React.ReactNode;
  // [key: string]: any;
}

export const playgroundRecordSettings = new SchemaSettings({
  name: `blockSettings:${BlockPlaygroundRecordLowercase}`,
  items: [

    {
      name: 'title',
      Component: SchemaSettingsBlockTitleItem,
    },

    {
      name: 'setTheBlockHeight',
      Component: SchemaSettingsBlockHeightItem,
    },

    {
      name: 'divider',
      type: 'divider',
    },

    {
      name: 'dataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const { name } = useCollection();
        const fieldSchema = useFieldSchema();
        const { form } = useFormBlockContext();
        const field = useField();
        const { dn } = useDesignable();
        return {
          collectionName: name,
          defaultFilter: fieldSchema?.['x-decorator-props']?.params?.filter || {},
          form: form,
          onSubmit: ({ filter }) => {
            filter = removeNullCondition(filter);
            const params = field.decoratorProps.params || {};
            params.filter = filter;
            field.decoratorProps.params = params;
            fieldSchema['x-decorator-props']['params'] = params;
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': field.decoratorProps,
              },
            });
          },
        };
      },
    },

    {
      type: 'remove',
      name: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
        breakRemoveOn: {
          'x-component': 'Grid',
        },
      }
    }
  ]
})

export function usePlaygroundRecordProps(): PlaygroundRecordProps {
  const collection = useCollection();
  const { data, loading } = useDataBlockRequest<any[]>();

  return {
    collectionName: collection.name,
    data: data?.data,
    loading: loading
  }
}

export const getPlaygroundRecordSchema = {
    type: 'void',
    'x-decorator': 'DetailsBlockProvider',
    'x-use-decorator-props': 'useDetailsWithPaginationDecoratorProps',
    "x-toolbar": "BlockSchemaToolbar",
    'x-decorator-props': {
      collection: 'roles',
      action: 'get',
      filterByTK: 1,

    },
    'x-settings': playgroundRecordSettings.name,
    'x-component': 'CardItem',
    properties: {
      [BlockPlaygroundRecordLowercase]: {
        'type': 'void',
        'x-pattern': 'readPretty',
        'x-component': BlockPlaygroundRecordName,
        'x-use-component-props': 'usePlaygroundRecordProps',
      }
    }
}



// export const getPlaygroundRecordSchema = ({ dataSource = 'main', collection }) => {
//   return {
//     type: 'void',
//     'x-decorator': 'DataBlockProvider',
//     "x-toolbar": "BlockSchemaToolbar",
//     'x-decorator-props': {
//       dataSource,
//       collection,
//       action: 'list',
//     },
//     'x-settings': playgroundRecordSettings.name,
//     'x-component': 'CardItem',
//     properties: {
//       [BlockPlaygroundRecordLowercase]: {
//         'type': 'void',
//         'x-component': BlockPlaygroundRecordName,
//         'x-use-component-props': 'usePlaygroundRecordProps',
//       }
//     }
//   }
// }


export const playgroundRecordInitializerItem: SchemaInitializerItemType = {
  name: BlockPlaygroundRecordLowercase,
  Component: 'DataBlockInitializer',
  useComponentProps() {
    const { insert } = useSchemaInitializer();
    return {
      title: BlockPlaygroundRecordName,
      icon: <CodeOutlined />,
      componentType: BlockPlaygroundRecordName,
      onClick: ({ item }) => {
        insert(getPlaygroundRecordSchema)
      }
    };

  },
}

export const PlaygroundRecord: FC<any> =() => {



  // console.log('DetailsBlockProvider', DetailsBlockProvider);

  return <div>
    <SchemaComponent
      schema={getPlaygroundRecordSchema}
      scope={{
        useDetailsWithPaginationDecoratorProps,
        useDetailsWithPaginationProps,
        useDetailsPaginationProps,
      }}
    />
    {/*<div>collection: {collectionName}</div>*/}
    {/*<div>data list: <pre>{JSON.stringify(data, null, 2)}</pre></div>*/}
  </div>
}



