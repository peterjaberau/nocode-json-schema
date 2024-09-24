import React, { FC } from 'react';
import {
  useApp,
  SchemaInitializerItemType, useSchemaInitializer,
  SchemaSettings, SchemaSettingsBlockTitleItem,
  useCollection, useDataBlockRequest,
  withDynamicSchemaProps,
  BlockInitializer, useResourceContext, useBlockContext, useSchemaOptionsContext,
} from '@nocobase/client';
import { CodeOutlined } from '@ant-design/icons';
import 'react18-json-view/src/style.css'
import JsonView from 'react18-json-view';
import { useT } from '../locale'
import { BlockName, BlockNameLowercase } from '../constants';

export interface JsonViewerProps {
  [key: string]: any;
}

export const jsonViewerSettings = new SchemaSettings({
  name: `blockSettings:${BlockNameLowercase}`,
  items: [
    {
      name: 'editBlockTitle',
      Component: SchemaSettingsBlockTitleItem,
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

export function JsonViewerSchema({ dataSource = 'main', collection }) {
  return {
    type: 'void',
    'x-decorator': 'DataBlockProvider',
    "x-toolbar": "BlockSchemaToolbar",
    'x-decorator-props': {
      dataSource,
      collection,
      action: 'list'
    },
    'x-settings': jsonViewerSettings.name,
    'x-component': 'CardItem',
    properties: {
      [BlockNameLowercase]: {
        type: 'void',
        'x-component': BlockName,
        'x-use-component-props': 'useCollectionFn',
      }
    }
  }
}

export const jsonViewerInitializerItem: SchemaInitializerItemType = {
  name: BlockNameLowercase,
  Component: 'DataBlockInitializer',
  useComponentProps() {
    const { insert } = useSchemaInitializer();
    const t = useT();
    return {
      title: t(BlockName),
      icon: <CodeOutlined />,
      componentType: BlockName,
      useTranslationHooks: useT,
      onCreateBlockSchema({ item }) {
        insert(JsonViewerSchema({ dataSource: item.dataSource, collection: item.name }))
      },
    };
  },
}

function extractItems(items: any[]): any[] {
  return items.map((item) => {
    const { name, title, Component, children } = item;
    const filteredItem: any = { name, title, Component };

    if (children && Array.isArray(children)) {
      filteredItem.children = extractItems(children);
    }

    return filteredItem;
  });
}

export const JsonViewer: FC<JsonViewerProps> = withDynamicSchemaProps((props) => {
  const {
    collectionName,
    data,
    displaySize = false,
    collapseObjectsAfterLength = 20,
    collapseStringsAfterLength = 100,
    collapseStringMode = 'word',
    collapsed = false
  } = props

  const app = useApp();

  const blockItems = React.useMemo(
    () => extractItems(app.schemaInitializerManager.get('BlockInitializers').options.items),
    [app.schemaInitializerManager.get('BlockInitializers').options.items]
    );

  return <JsonView
    src={{
      ui: {
        components: blockItems,
        modules: {}
      },
      page: {
        tree: {},
        code: {},
        queries: {},
        transformers: {},
        states: {
          temporary: {},
          components: {},
          global: {
            currentUser: {},
            localStorage: {},
            theme: {},
            urlParams: {},
            viewPort: {},
            settings: {}
          },
          history: {},
          variables: {}
        },
        debug: {
          console: {}
        }
      },
      app: {
        general: {},
        routers: {
          routes: app.router.getRoutes(),
          baseName: app.router.getBasename(),
          routesTree: app.router.getRoutesTree()
        },
        libraries: {},
        databases: {},
        variables: {}
      },
      workspace: {
        workflows: {},
        apps: {},
        state: {},
        database: {},
        connections: {},
        variables: {},
        queries: {}
      },
      resources: {
        providers: {},
        builtins: {},
        schemaRegistry: {}
      },
      glossary: {
        routes: {
          getRoutes: 'Fn ()',
          getBasename: 'Fn ()',
          getRoutesTree: 'Fn ()',
          add: 'Fn (name: string, route: RouteType)',
          get: 'Fn (name: string): RouteType',
          has: 'Fn (name: string): string',
          remove: 'Fn (name: string): void',
          setType: 'Fn (type: browser | memory | hash): void',
          setBasename: 'Fn (basename: string): void',
          useRouter: 'Hook (): RouterManager'
        }
      },
      data: data,
      application: app
  }}
    displaySize={displaySize}
    collapseObjectsAfterLength={collapseObjectsAfterLength}
    collapseStringsAfterLength={collapseStringsAfterLength}
    collapseStringMode={collapseStringMode}
    collapsed={2}
  />
})
