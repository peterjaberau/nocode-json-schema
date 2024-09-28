import React, { FC, useContext, useEffect } from 'react';
import {
  useApp,
  SchemaInitializerItemType,
  useSchemaInitializer,
  SchemaSettings,
  SchemaSettingsBlockTitleItem,
  useCollection,
  useDataBlockRequest,
  withDynamicSchemaProps,
  BlockInitializer,
  useResourceContext,
  useBlockContext,
  useSchemaOptionsContext,
  useCurrentRoles,
  useCurrentUserSettingsMenu,
  useCurrentUserVariable,
  useCurrentUserContext,
  useCurrentSchema,
  useCurrentRoleVariable,
  useCurrentAppInfo,
  useCurrentDocumentTitle,
  useDataSourceManager,
  useCollectionManager,
  useRouter,
  useDesignable,
  useFieldComponentOptions,
  useSchemaToolbar,
  useActionContext,
  useSchemaComponentContext,
  useGlobalTheme,
  useStyles,
  SchemaSettingsModalItem,
  useProps,
  SchemaSettingsItemType,
} from '@nocobase/client';
import _ from 'lodash';
import { CodeOutlined } from '@ant-design/icons';
import 'react18-json-view/src/style.css'
import JsonView from 'react18-json-view';
import { useSearchParams, useLocation } from 'react-router-dom';
import { BlockName, BlockNameLowercase } from '../constants';
import { ISchema, SchemaOptionsContext, useField, useFieldSchema } from '@formily/react';
import { Switch } from '@formily/antd-v5';
import { useTranslation } from 'react-i18next';

export interface JsonViewerProps {
  collectionName: string
  data?: any[]
  loading?: boolean;
  displaySize?: boolean
  collapseObjectsAfterLength?: number
  collapseStringsAfterLength?: number
  collapseStringMode?: 'address' | 'word' | 'directly'
  collapsed?: boolean | number
  [key: string]: any
}


export function SchemaSettingsCollapsedItem() {
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();

  return (
    <SchemaSettingsModalItem
      title={'Edit collapsed'}
      schema={
        {
          type: 'object',
          title: 'Edit collapsed',
          properties: {
            collapsed: {
              title: 'Collapsed',
              type: 'boolean',
              default: fieldSchema?.['x-component-props']?.['collapsed'],
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
          },
        } as ISchema
      }
      onSubmit={({ collapsed = true }) => {

        console.log('onSubmit-collapsed', collapsed)

        const componentProps = fieldSchema['x-component-props'] || {};
        componentProps['collapsed'] = collapsed;

        fieldSchema['x-component-props'] = componentProps;
        field.componentProps.collapsed = { ...componentProps };

        dn.emit('patch', {
          schema: {
            ['x-uid']: fieldSchema['x-uid'],
            'x-component-props': componentProps,
          },
        });
        dn.refresh();
      }}
    />
  );
}

export const collapsedSchemaSettingsItem: SchemaSettingsItemType = {
  name: 'collapsed',
  type: 'switch',
  useComponentProps() {
    const filedSchema = useFieldSchema();
    const { deepMerge } = useDesignable();

    return {
      title: 'Collapsed',
      checked: !!filedSchema['x-decorator-props']?.[BlockNameLowercase]?.collapsed,
      onChange(v) {
        deepMerge({
          'x-uid': filedSchema['x-uid'],
          'x-decorator-props': {
            ...filedSchema['x-decorator-props'],
            [BlockNameLowercase]: {
              ...filedSchema['x-decorator-props']?.[BlockNameLowercase],
              collapsed: v,
            },
          },
        })
      },
    };
  },
};

export const displaySizeSchemaSettingsItem: SchemaSettingsItemType = {
  name: 'displaySize',
  type: 'switch',
  useComponentProps() {
    const filedSchema = useFieldSchema();
    const { deepMerge } = useDesignable();

    return {
      title: 'Display Size',
      checked: !!filedSchema['x-decorator-props']?.[BlockNameLowercase]?.displaySize,
      onChange(v) {
        deepMerge({
          'x-uid': filedSchema['x-uid'],
          'x-decorator-props': {
            ...filedSchema['x-decorator-props'],
            [BlockNameLowercase]: {
              ...filedSchema['x-decorator-props']?.[BlockNameLowercase],
              displaySize: v,
            },
          },
        })
      },
    };
  },
};


export const jsonViewerSettings = new SchemaSettings({
  name: `blockSettings:${BlockNameLowercase}`,
  items: [
    {
      name: 'editBlockTitle',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      name: 'divider1',
      type: 'divider'
    },
    collapsedSchemaSettingsItem,
    displaySizeSchemaSettingsItem,
    {
      type: 'remove',
      name: 'remove'
    }
  ]
})




// export const jsonViewerSettings = new SchemaSettings({
//   name: `blockSettings:${BlockNameLowercase}`,
//   items: [
//     {
//       name: 'editBlockTitle',
//       Component: SchemaSettingsBlockTitleItem,
//     },
//     {
//       name: 'divider1',
//       type: 'divider'
//     },
//     {
//       name: 'editCollapsed',
//       Component: SchemaSettingsCollapsedItem,
//     },
//     {
//       type: 'remove',
//       name: 'remove',
//       componentProps: {
//         removeParentsIfNoChildren: true,
//         breakRemoveOn: {
//           'x-component': 'Grid',
//         },
//       }
//     }
//   ]
// })





// export function useJsonViewerProps(): JsonViewerProps | any {
//
//   const collection = useCollection();
//   const fieldSchema = useFieldSchema();
//
//   const { data, loading } = useDataBlockRequest<any[]>();
//
//   return {
//     collectionName: collection.name,
//     data: data?.data,
//     loading: loading,
//     ...fieldSchema.parent?.['x-decorator-props']?.[BlockNameLowercase]
//   }
// }

// export function getJsonViewerSchema(props) {
//
//   const { dataSource = 'main', collection } = props;
//
//   return {
//     type: 'void',
//     "x-toolbar": "BlockSchemaToolbar",
//     'x-decorator': 'DataBlockProvider',
//     'x-decorator-props': {
//       dataSource,
//       collection,
//       action: 'list'
//     },
//     'x-component': 'CardItem',
//     'properties': {
//       [BlockNameLowercase]: {
//         'x-component': BlockName,
//         'x-use-component-props': 'useJsonViewerProps'
//       }
//     },
//     'x-settings': jsonViewerSettings.name,
//
//   }
// }

export function useJsonViewerProps(): JsonViewerProps | any {

  const fieldSchema = useFieldSchema();
  return fieldSchema.parent?.['x-decorator-props']?.[BlockNameLowercase];

}

export const JsonViewerSchema: ISchema = {
  type: 'void',
  'x-component': 'CardItem',
  'x-decorator-props': {
    [BlockNameLowercase]: {}
  },
  'properties': {
    [BlockNameLowercase]: {
      'x-component': BlockName,
      'x-use-component-props': 'useJsonViewerProps'
    }
  },
  'x-settings': jsonViewerSettings.name,

}

export const jsonViewerInitializerItem: SchemaInitializerItemType = {
  type: 'item',
  name: BlockNameLowercase,
  // Component: 'DataBlockInitializer',
  useComponentProps() {
    const { insert } = useSchemaInitializer();
    return {
      title: BlockName,
      onClick: () => {
        insert(JsonViewerSchema);
      },
      // onClick({ item }) {
      //   insert(getJsonViewerSchema({ dataSource: item.dataSource, collection: item.name }))
      // },
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
    displaySize = false,
    collapseObjectsAfterLength = 20,
    collapseStringsAfterLength = 100,
    collapseStringMode = 'word',
    collapsed = false,
    ...rest
  } = props;

  const propsObjects = { displaySize, collapseObjectsAfterLength, collapseStringsAfterLength, collapseStringMode, collapsed, ...rest }


  const app = useApp();
  const [getDataSources, setDatasources] = React.useState(useDataSourceManager().getDataSources());
  const [getSchemaInitializer, setSchemaInitializer] = React.useState(app.schemaInitializerManager.getAll());
  const [getPluginSettingsManager, setPluginSettingsManager] = React.useState(app.pluginSettingsManager.getList());

  const dataSources = React.useMemo(() => getDataSources.map((dsItem) => dsItem.getOptions()), [getDataSources]);
  const pluginSettingsManager = React.useMemo(() => getPluginSettingsManager.map(item => _.omit(item, ['Component', 'children', 'title', 'label', 'icon', 'path', 'aclSnippet'])), [app.pluginSettingsManager.getList()]);

    const schemaInitializers = React.useMemo(
    () => _.keys(getSchemaInitializer).map(
      (key) => {
        const item = getSchemaInitializer[key];
        return {
          name: item?.name,
          items: item?.items.map((obj) => _.omit(obj, ['useChildren'])),
          options: {
            ..._.omit(item?.options, ['wrap', 'useInsert']),
            items: item?.options?.items.map((obj) => _.omit(obj, ['useChildren'])),
          },
        }
      }
    ),
    [getSchemaInitializer]
  );

  const { t } = useTranslation();
  const options = useContext(SchemaOptionsContext);
  const { theme } = useGlobalTheme();
  const useStylesVal = useStyles();

    const blockItems = React.useMemo(
    () => extractItems(app.schemaInitializerManager.get('BlockInitializers').options.items),
    [app.schemaInitializerManager.get('BlockInitializers').options.items]
  );



  return <JsonView
    src={{
      props: _.omit(propsObjects, ['onChange', 'onFocus', 'onBlur', 'children']),
      listing: {
        PluginSettingsManager: pluginSettingsManager.map(item => item.key).sort(),
        SchemaInitializerManager: _.keys(getSchemaInitializer).sort(),
        routerManager: _.keys(app.router.getRoutes()).sort()
      },
      use: {
        theme: _.pick({...theme}, ['token', 'name']),
        useStyles: _.pick({...useStylesVal}, ['styles', 'theme', 'prefixCls']),
      },

      page: {
        databases: dataSources,
        uiSchema: {
          useFieldSchema: useFieldSchema().toJSON(),
        },
        tree: {

        },
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
      current: {
        currentRoles: useCurrentRoles(),
        currentAppInfo: {
          ...useCurrentAppInfo().data
        },
        currentUserContext: {
          ...useCurrentUserContext().data.data
        }
      },
      internal: {
        routerManager: {
          getRoutesTree: app.router.getRoutesTree(),
          getRoutes: app.router.getRoutes(),
        },
        PluginSettingsManager: {
          getList:  pluginSettingsManager,
        },
        schemaInitializerManager: {
          getAll: schemaInitializers,

        }
      },
      app: {
        general: {},
        routers: {
          useLocation: useLocation()
        },
        libraries: {},
        databases: {},
        variables: {}
      },
      ui: {
        components: blockItems,
        modules: {}
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
      data: [],
      application: app
    }}
    displaySize={displaySize}
    collapseObjectsAfterLength={collapseObjectsAfterLength}
    collapseStringsAfterLength={collapseStringsAfterLength}
    collapseStringMode={collapseStringMode}
    collapsed={collapsed ? collapsed : 3}
  />
}, { displayName: BlockName })



// export const JsonViewer: FC<JsonViewerProps> = withDynamicSchemaProps((props) => {
//
//   const { fieldNames } = useProps(props);
//   const {
//     collectionName,
//     data,
//     collapsed = true,
//     ...rest
//   } = props
//   console.log('props', props)
//   const app = useApp();
//
//
//   const [getDataSources, setDatasources] = React.useState(useDataSourceManager().getDataSources());
//   const [getSchemaInitializer, setSchemaInitializer] = React.useState(app.schemaInitializerManager.getAll());
//   const [getPluginSettingsManager, setPluginSettingsManager] = React.useState(app.pluginSettingsManager.getList());
//
//   const dataSources = React.useMemo(() => getDataSources.map((dsItem) => dsItem.getOptions()), [getDataSources]);
//
//   const pluginSettingsManager = React.useMemo(() => getPluginSettingsManager.map(item => _.omit(item, ['Component', 'children', 'title', 'label', 'icon', 'path', 'aclSnippet'])), [app.pluginSettingsManager.getList()]);
//
//   const schemaInitializers = React.useMemo(
//     () => _.keys(getSchemaInitializer).map(
//       (key) => {
//
//         const item = getSchemaInitializer[key];
//
//         return {
//           name: item?.name,
//           items: item?.items.map((obj) => _.omit(obj, ['useChildren'])),
//           options: {
//             ..._.omit(item?.options, ['wrap', 'useInsert']),
//             items: item?.options?.items.map((obj) => _.omit(obj, ['useChildren'])),
//           },
//
//
//         }
//       }
//     ),
//     [getSchemaInitializer]
//   );
//
//   const { t } = useTranslation();
//   const options = useContext(SchemaOptionsContext);
//   const { theme } = useGlobalTheme();
//   const useStylesVal = useStyles();
//
//
//   const blockItems = React.useMemo(
//     () => extractItems(app.schemaInitializerManager.get('BlockInitializers').options.items),
//     [app.schemaInitializerManager.get('BlockInitializers').options.items]
//   );
//
//   return <JsonView
//     src={{
//       props: rest,
//       listing: {
//         PluginSettingsManager: pluginSettingsManager.map(item => item.key).sort(),
//         SchemaInitializerManager: _.keys(getSchemaInitializer).sort(),
//         routerManager: _.keys(app.router.getRoutes()).sort()
//       },
//       use: {
//         theme: _.pick({...theme}, ['token', 'name']),
//         useStyles: _.pick({...useStylesVal}, ['styles', 'theme', 'prefixCls']),
//       },
//
//       page: {
//         databases: dataSources,
//         uiSchema: {
//           useFieldSchema: useFieldSchema().toJSON(),
//         },
//         tree: {
//
//         },
//         code: {},
//         queries: {},
//         transformers: {},
//         states: {
//           temporary: {},
//           components: {},
//           global: {
//             currentUser: {},
//             localStorage: {},
//             theme: {},
//             urlParams: {},
//             viewPort: {},
//             settings: {}
//           },
//           history: {},
//           variables: {}
//         },
//         debug: {
//           console: {}
//         }
//       },
//       current: {
//         currentRoles: useCurrentRoles(),
//         currentAppInfo: {
//           ...useCurrentAppInfo().data
//         },
//         currentUserContext: {
//           ...useCurrentUserContext().data.data
//         }
//       },
//       internal: {
//         routerManager: {
//           getRoutesTree: app.router.getRoutesTree(),
//           getRoutes: app.router.getRoutes(),
//         },
//         PluginSettingsManager: {
//           getList:  pluginSettingsManager,
//         },
//         schemaInitializerManager: {
//           getAll: schemaInitializers,
//
//         }
//       },
//       app: {
//         general: {},
//         routers: {
//           useLocation: useLocation()
//         },
//         libraries: {},
//         databases: {},
//         variables: {}
//       },
//       ui: {
//         components: blockItems,
//         modules: {}
//       },
//
//       workspace: {
//         workflows: {},
//         apps: {},
//         state: {},
//         database: {},
//         connections: {},
//         variables: {},
//         queries: {}
//       },
//       resources: {
//         providers: {},
//         builtins: {},
//         schemaRegistry: {}
//       },
//       glossary: {
//         routes: {
//           getRoutes: 'Fn ()',
//           getBasename: 'Fn ()',
//           getRoutesTree: 'Fn ()',
//           add: 'Fn (name: string, route: RouteType)',
//           get: 'Fn (name: string): RouteType',
//           has: 'Fn (name: string): string',
//           remove: 'Fn (name: string): void',
//           setType: 'Fn (type: browser | memory | hash): void',
//           setBasename: 'Fn (basename: string): void',
//           useRouter: 'Hook (): RouterManager'
//         }
//       },
//       data: data,
//       application: app
//     }}
//     displaySize={rest['displaySize']}
//     collapseObjectsAfterLength={rest['collapseObjectsAfterLength']}
//     collapseStringsAfterLength={rest['collapseStringsAfterLength']}
//     collapseStringMode={rest['word']}
//     collapsed={false}
//
//     // collapsed={collapsed ? collapsed : 2}
//   />
// }, { displayName: BlockName })
