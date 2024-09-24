import React, { FC } from 'react';
import {
  SchemaComponent,
  SchemaInitializerItemType,
  SchemaSettings, useCollection, useDataBlockRequest, useSchemaComponentContext,
  useSchemaInitializer, useSchemaInitializerItem,
  withDynamicSchemaProps,
} from '@nocobase/client';
import { BlockPlaygroundName, BlockPlaygroundLowercase, BlockPlaygroundRecordName } from '../constants';
import { CodeOutlined } from '@ant-design/icons';

export interface PlaygroundProps {
  collectionName: string;
  data?: any[];
  loading?: boolean;
  // children?: React.ReactNode;
  // [key: string]: any;
}

export const playgroundSettings = new SchemaSettings({
  name: `blockSettings:${BlockPlaygroundLowercase}`,
  items: [
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

export function usePlaygroundProps(): PlaygroundProps {
  const collection = useCollection();
  const { data, loading } = useDataBlockRequest<any[]>();

  return {
    collectionName: collection.name,
    data: data?.data,
    loading: loading
  }
}

// export function getPlaygroundSchema({ dataSource = 'main', collection }) {
//   // const { dataSource, collectionName} = useSchemaInitializerItem();
//   return {
//     type: 'void',
//     'x-decorator': 'DataBlockProvider',
//     "x-toolbar": "BlockSchemaToolbar",
//     'x-decorator-props': {
//       // 'datasource': dataSource,
//       // 'collection': collectionName,
//       dataSource,
//       collection,
//       action: 'list',
//     },
//     'x-settings': playgroundSettings.name,
//     'x-component': 'CardItem',
//     properties: {
//       [BlockPlaygroundLowercase]: {
//         type: 'void',
//         'x-component': BlockPlaygroundName,
//         'x-use-component-props': 'usePlaygroundProps',
//       }
//     }
//   }
// }

export const getPlaygroundSchema = ({ dataSource = 'main', collection }) => {
  return {
    type: 'void',
    'x-decorator': 'DataBlockProvider',
    "x-toolbar": "BlockSchemaToolbar",
    'x-decorator-props': {
      dataSource,
      collection,
      action: 'list',
    },
    'x-settings': playgroundSettings.name,
    'x-component': 'CardItem',
    properties: {
      [BlockPlaygroundLowercase]: {
        'type': 'void',
        'x-component': BlockPlaygroundName,
        'x-use-component-props': 'usePlaygroundProps',
      }
    }
  }
}


export const playgroundInitializerItem: SchemaInitializerItemType = {
  name: BlockPlaygroundLowercase,
  Component: 'DataBlockInitializer',
  useComponentProps() {
    const { insert } = useSchemaInitializer();
    return {
      title: BlockPlaygroundName,
      icon: <CodeOutlined />,
      componentType: BlockPlaygroundName,
      onClick: ({ item }) => {
        insert(getPlaygroundSchema({ dataSource: item.dataSource, collection: item.name }))
      }
      // onClick: ({ item }) => {
      //   insert(getPlaygroundSchema({ dataSource: item.dataSource, collection: item.name}))
      // }
    };

    // return {
    //   title: t(BlockPlaygroundName),
    //   icon: <CodeOutlined />,
    //   componentType: BlockPlaygroundName,
    //   useTranslationHooks: useT,
    //   onCreateBlockSchema({ item }) {
    //     insert(getPlaygroundSchema({ dataSource: item.dataSource, collection: item.name }))
    //   },
    // };
  },
}

export const Playground: FC<PlaygroundProps> = withDynamicSchemaProps(({ collectionName, data }) => {

  // const playgroundContext = useSchemaComponentContext();
  //
  // console.log('playgroundContext', playgroundContext);

  return <div>
    <div>collection: {collectionName}</div>
    <div>data list: <pre>{JSON.stringify(data, null, 2)}</pre></div>
  </div>
}, { displayName: BlockPlaygroundName })
