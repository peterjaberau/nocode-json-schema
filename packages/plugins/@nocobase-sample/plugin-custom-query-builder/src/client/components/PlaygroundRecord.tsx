import React, { FC } from 'react';
import { ArrayItems } from '@formily/antd-v5';

import {
  FilterBlockType,
  removeNullCondition,
  SchemaComponent,
  SchemaInitializerItemType,
  SchemaSettings,
  SchemaSettingsBlockHeightItem,
  SchemaSettingsBlockTitleItem, SchemaSettingsConnectDataBlocks,
  SchemaSettingsDataScope,
  SchemaSettingsFormItemTemplate,
  SchemaSettingsItemType,
  SchemaSettingsLinkageRules, SchemaSettingsTemplate, setDataLoadingModeSettingsItem,
  useCollection,
  useCollection_deprecated, useCollectionManager_deprecated,
  useCollectionRecordData,
  useDataBlockRequest, useDesignable, useFormBlockContext,
  useSchemaComponentContext,
  useSchemaInitializer,
  useSchemaInitializerItem, useSortFields, useTableBlockContext,
  withDynamicSchemaProps,
} from '@nocobase/client';
import { BlockPlaygroundRecordName, BlockPlaygroundRecordLowercase } from '../constants';
import { CodeOutlined } from '@ant-design/icons';
import { useCollectionRecord, CollectionRecordProvider, useCollectionParentRecordData, useCollectionParentRecord } from '@nocobase/client';
import { ISchema, useField, useFieldSchema } from '@formily/react';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

const commonSettingsItems: SchemaSettingsItemType[] = [
  {
    name: 'title',
    Component: SchemaSettingsBlockTitleItem,
  },
  {
    name: 'setTheBlockHeight',
    Component: SchemaSettingsBlockHeightItem,
  },
  {
    name: 'linkageRules',
    Component: SchemaSettingsLinkageRules,
    useComponentProps() {
      const { name } = useCollection_deprecated();
      return {
        collectionName: name,
        readPretty: true,
      };
    },
  },
  {
    name: 'formItemTemplate',
    Component: SchemaSettingsFormItemTemplate,
    useComponentProps() {
      const { name } = useCollection_deprecated();
      const fieldSchema = useFieldSchema();
      const defaultResource =
        fieldSchema?.['x-decorator-props']?.resource || fieldSchema?.['x-decorator-props']?.association;
      return {
        insertAdjacentPosition: 'beforeEnd',
        componentName: 'ReadPrettyFormItem',
        collectionName: name,
        resourceName: defaultResource,
      };
    },
  },
  {
    name: 'divider',
    type: 'divider',
  },
  {
    name: 'remove',
    type: 'remove',
    componentProps: {
      removeParentsIfNoChildren: true,
      breakRemoveOn: {
        'x-component': 'Grid',
      },
    },
  },
];


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
      name: 'EditBlockTitle',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      name: 'setTheBlockHeight',
      Component: SchemaSettingsBlockHeightItem,
    },
    {
      name: 'treeTable',
      type: 'switch',
      useComponentProps: () => {
        const { getCollectionField, getCollection } = useCollectionManager_deprecated();
        const field = useField();
        const fieldSchema = useFieldSchema();
        const { service } = useTableBlockContext();
        const { t } = useTranslation();
        const { dn } = useDesignable();
        const collection = useCollection_deprecated();
        const { resource } = field.decoratorProps;
        const collectionField = resource && getCollectionField(resource);
        const treeCollection = resource?.includes('.')
          ? getCollection(collectionField?.target)?.tree
          : !!collection?.tree;

        return {
          title: t('Tree table'),
          defaultChecked: true,
          checked: treeCollection ? field.decoratorProps.treeTable : false,
          onChange: (flag) => {
            field.decoratorProps.treeTable = flag;
            fieldSchema['x-decorator-props'].treeTable = flag;

            if (flag === false) {
              fieldSchema['x-decorator-props'].expandFlag = false;
            }

            const params = {
              ...service.params?.[0],
              tree: flag ? true : null,
            };
            dn.emit('patch', {
              schema: fieldSchema,
            });
            dn.refresh();
            service.run(params);
          },
        };
      },
      useVisible: () => {
        const { getCollectionField } = useCollectionManager_deprecated();
        const field = useField();
        const collection = useCollection_deprecated();
        const { resource } = field.decoratorProps;
        const collectionField = resource && getCollectionField(resource);

        return collection?.tree && collectionField?.collectionName === collectionField?.target;
      },
    },
    {
      name: 'SetTheDataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const { name } = useCollection_deprecated();
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
            _.set(fieldSchema, 'x-decorator-props.params.filter', filter);
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params, page: 1 };
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': fieldSchema['x-decorator-props'],
              },
            });
          },
        };
      },
    },
    {
      name: 'SetDefaultSortingRules',
      type: 'modal',
      useComponentProps() {
        const { name } = useCollection_deprecated();
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();
        const sortFields = useSortFields(name);
        const defaultSort = fieldSchema?.['x-decorator-props']?.params?.sort || [];
        const sort = defaultSort?.map((item: string) => {
          return item.startsWith('-')
            ? {
              field: item.substring(1),
              direction: 'desc',
            }
            : {
              field: item,
              direction: 'asc',
            };
        });

        return {
          title: t('Set default sorting rules'),
          components: { ArrayItems },
          schema: {
            type: 'object',
            title: t('Set default sorting rules'),
            properties: {
              sort: {
                type: 'array',
                default: sort,
                'x-component': 'ArrayItems',
                'x-decorator': 'FormItem',
                items: {
                  type: 'object',
                  properties: {
                    space: {
                      type: 'void',
                      'x-component': 'Space',
                      properties: {
                        sort: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.SortHandle',
                        },
                        field: {
                          type: 'string',
                          enum: sortFields,
                          'x-decorator': 'FormItem',
                          'x-component': 'Select',
                          'x-component-props': {
                            style: {
                              width: 260,
                            },
                          },
                        },
                        direction: {
                          type: 'string',
                          'x-decorator': 'FormItem',
                          'x-component': 'Radio.Group',
                          'x-component-props': {
                            optionType: 'button',
                          },
                          enum: [
                            {
                              label: t('ASC'),
                              value: 'asc',
                            },
                            {
                              label: t('DESC'),
                              value: 'desc',
                            },
                          ],
                        },
                        remove: {
                          type: 'void',
                          'x-decorator': 'FormItem',
                          'x-component': 'ArrayItems.Remove',
                        },
                      },
                    },
                  },
                },
                properties: {
                  add: {
                    type: 'void',
                    title: t('Add sort field'),
                    'x-component': 'ArrayItems.Addition',
                  },
                },
              },
            },
          } as ISchema,
          onSubmit: ({ sort }) => {
            const sortArr = sort.map((item) => {
              return item.direction === 'desc' ? `-${item.field}` : item.field;
            });

            _.set(fieldSchema, 'x-decorator-props.params.sort', sortArr);
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params, page: 1 };
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': fieldSchema['x-decorator-props'],
              },
            });
          },
        };
      },
    },
    setDataLoadingModeSettingsItem,
    {
      name: 'RecordsPerPage',
      type: 'select',
      useComponentProps() {
        const { t } = useTranslation();
        const fieldSchema = useFieldSchema();
        const field = useField();
        const { dn } = useDesignable();

        return {
          title: t('Records per page'),
          value: field.decoratorProps?.params?.pageSize || 20,
          options: [
            { label: '1', value: 1 },
            { label: '5', value: 5 },
            { label: '10', value: 10 },
            { label: '20', value: 20 },
            { label: '50', value: 50 },
            { label: '80', value: 80 },
            { label: '100', value: 100 },
          ],
          onChange: (pageSize) => {
            _.set(fieldSchema, 'x-decorator-props.params.pageSize', pageSize);
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params, page: 1 };
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-decorator-props': fieldSchema['x-decorator-props'],
              },
            });
          },
        };
      },
    },
    {
      name: 'ConnectDataBlocks',
      Component: SchemaSettingsConnectDataBlocks,
      useComponentProps() {
        const { t } = useTranslation();
        return {
          type: FilterBlockType.TABLE,
          emptyDescription: t('No blocks to connect'),
        };
      },
    },

    {
      name: 'ConvertReferenceToDuplicate',
      Component: SchemaSettingsTemplate,
      useComponentProps() {
        const { name } = useCollection_deprecated();
        const fieldSchema = useFieldSchema();
        const defaultResource =
          fieldSchema?.['x-decorator-props']?.resource || fieldSchema?.['x-decorator-props']?.association;

        return {
          componentName: 'List',
          collectionName: name,
          resourceName: defaultResource,
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      type: 'remove',
      useComponentProps() {
        return {
          removeParentsIfNoChildren: true,
          breakRemoveOn: {
            'x-component': 'Grid',
          },
        };
      },
    },
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


export const getPlaygroundRecordSchema = ({ dataSource = 'main', collection }) => {
  return {
    type: 'void',
    'x-decorator': 'DataBlockProvider',
    "x-toolbar": "BlockSchemaToolbar",
    'x-decorator-props': {
      dataSource,
      collection,
      action: 'list',
    },
    'x-settings': playgroundRecordSettings.name,
    'x-component': 'CardItem',
    properties: {
      [BlockPlaygroundRecordLowercase]: {
        'type': 'void',
        'x-component': BlockPlaygroundRecordName,
        'x-use-component-props': 'usePlaygroundRecordProps',
      }
    }
  }
}


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
        insert(getPlaygroundRecordSchema({ dataSource: item.dataSource, collection: item.name }))
      }

    };


  },
}

const myrecord = {
  "createdAt": "2024-09-12T21:38:01.539Z",
  "updatedAt": "2024-09-12T22:41:49.435Z",
  "host": "www.wrike.com",
  "id": 1,
  "identifier": "APP_WRIKE",
  "inDev": true,
  "inProd": true,
  "name": "Wrike",
  "notes": "Paid Plan Required, Jira Issue Link: https://cloudanalyser.atlassian.net/browse/EC-160",
  "pathsCount": 1,
  "previewIcon": "https://easyflow-assets.s3-us-west-2.amazonaws.com/stencils/APP_WRIKE_128x128.svg",
  "securityType": null,
  "url": "https://www.wrike.com/vas/",
  "createdById": 1,
  "updatedById": 1
}


export const PlaygroundRecord: FC<PlaygroundRecordProps> = withDynamicSchemaProps(({ collectionName, data }) => {
  // const data = useCollectionRecordData();
  // const record = useCollectionRecord();

  return (
    // <CollectionRecordProvider record={myrecord}>
      <div>
        <div>collection: {collectionName}</div>
        <div>data list: <pre>{JSON.stringify(data, null, 2)}</pre></div>
        {/*<div>record: {JSON.stringify(record)}</div>*/}
      </div>
    // </CollectionRecordProvider>
  )


}, { displayName: BlockPlaygroundRecordName })
