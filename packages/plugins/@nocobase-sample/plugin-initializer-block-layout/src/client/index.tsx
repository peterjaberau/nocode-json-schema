import React, { createContext, FC, useState } from 'react';
import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
import {
  Plugin, SchemaComponent, SchemaComponentOptions,
  SchemaInitializer,
  SchemaInitializerItem, SchemaInitializerItemType, SchemaSettings, ActionInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem, useSchemaInitializerRender, withDynamicSchemaProps,
  SchemaInitializerContext, SchemaToolbar, useDesignable, Grid, SchemaSettingsBlockTitleItem, SchemaSettingsItemType,
} from '@nocobase/client';
import { ISchema, observer, useField, useFieldSchema } from '@formily/react';
import { Field } from '@nocobase/database';
import { uid } from '@formily/shared';
import { useMemoizedFn } from 'ahooks'


interface LayoutComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}

//ChartRenderer
const LayoutComponent: React.FC<LayoutComponentProps>  = ({ children, ...rest }) => {
  const field = useField<Field>();
  return (
    <div style={{ marginBottom: 20, padding: '0 20px', height: 50, lineHeight: '50px', background: '#f1f1f1' }}>
      {field.title}
    </div>
  )}

const WidgetComponent: React.FC<LayoutComponentProps>  = ({ children, ...rest }) => {
  const fieldSchema =useFieldSchema();
  return (
    <div style={{ marginBottom: 20, padding: '0 20px', height: 50, lineHeight: '50px', background: '#f1f1f1' }}>
      {fieldSchema.name}
    </div>
  )}
const WidgetInitializerComponent: React.FC<LayoutComponentProps> = ({ children, ...rest }) => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<LineChartOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-decorator' : 'BlockItem',
          'x-component': 'WidgetComponent',
          'x-settings': 'widgetSettings'
        });
      }}
    />
  );
}

const widgetSettings = new SchemaSettings({
  name: 'widgetSettings',
  items: [
    {
      type: 'remove',
      name: 'remove'
    }
  ]
})


//ChartBlock - ChartV2Block
const LayoutComponentBlock: React.FC<LayoutComponentProps> = ({ children, ...rest }) => {
  const [initialVisible, setInitialVisible] = useState(false);
  const schemaInitializerContextData = useSchemaInitializer();
  return (
    <SchemaInitializerContext.Provider
      value={{ ...schemaInitializerContextData, visible: initialVisible, setVisible: setInitialVisible }}
    >
      <SchemaComponentOptions
        components={{ LayoutComponent }}
      >
          {children}
      </SchemaComponentOptions>
    </SchemaInitializerContext.Provider>
  );
};

//ChartBlockInitializer - ChartV2BlockInitializer
const LayoutInitializerComponent: React.FC<LayoutComponentProps> = ({ children, ...rest }) => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<LineChartOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-component': 'CardItem',
          'x-component-props': {
            name: 'layouts',
          },
          'x-settings': 'blockSettings:layoutcomponent',
          properties: {
            actions: {
              type: 'void',
              name: 'test',
              'x-component': 'ActionBar',
              'x-initializer': 'addActionButton',
              'x-component-props': {
                layout: 'two-columns',
              },
              properties: {
                a1: {
                  title: 'Action 1',
                  'x-component': 'Action',
                  'x-action': 'a1',
                  'x-align': 'right',
                },
                a2: {
                  title: 'Action 2',
                  'x-component': 'Action',
                  'x-action': 'a2',
                  'x-align': 'right',
                },
              },
            },
            [uid()]: {
              type: 'void',
              'x-decorator': 'Grid',
              'x-component': 'LayoutComponentBlock',
                'x-initializer': 'layoutInitializers',
            },
          },
        });
      }}
    />
  );
};

const addActionButton = new SchemaInitializer({
  name: 'addActionButton',
  designable: true,
  title: 'Configure actions',
  style: {
    marginLeft: 8,
  },
  items: [
    {
      type: 'itemGroup',
      title: 'Enable actions',
      name: 'enableActions',
      children: [
        {
          name: 'action1',
          title: '{{t("Action drawer")}}',
          Component: 'ActionInitializer',
          schema: {
            type: 'void',
            'title': 'Action drawer',
            'x-component': 'Action',
            'x-action': 'a1',
            'x-align': 'right',
            properties: {
              tip: {
                type: 'void',
                'x-component': 'Markdown.Void',
                'x-editable': false,
                'x-component-props': {
                  content: 'drawer content here',
                },
            }

            }
          }
        },
        {
          name: 'action2',
          title: '{{t("Action confirm")}}',
          Component: 'ActionInitializer',
          schema: {
            title: 'Action confirm',
            'x-component': 'Action',
            // 'x-use-component-props': 'useBulkDestroyActionProps',
            'x-component-props': {
              icon: 'DeleteOutlined',
              confirm: {
                title: "{{t('Delete record')}}",
                content: "{{t('Are you sure you want to delete it?')}}",
              },
            },
            'x-action': 'a2',
            'x-align': 'right',
          },
        },
      ],
    },
  ],
});

const layoutSettings = new SchemaSettings({
  name: 'blockSettings:layoutcomponent',
  items: [
    {
      name: 'editBlockTitle',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      name: 'divider',
      type: 'divider'
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

// chartInitializers
const layoutInitializers = new SchemaInitializer({
  name: 'layoutInitializers',
  icon: 'PlusOutlined',
  title: 'Add layout block',
  popover: true,
  onSuccess: (data) => {console.log('onSuccess: ', data)},
  designable: true,
  wrap: Grid.wrap,
  // insertPosition: 'beforeBegin',
  items:[
    {
      name:'layouts',
      title:'Layout block',
      // type: 'item', //item, itemGroup, subMenu, divider, switch, actionModal
      Component: () => {
        const { insert } = useSchemaInitializer()
        return (
          <LayoutInitializerComponent />
        )
      }
    },
    {
      name:'componentA',
      title:'Component A',
      Component: () => {
        const { insert } = useSchemaInitializer()
        return (
          <WidgetInitializerComponent />
        )
      }
    },
    {
      name:'componentB',
      title: 'Component B',
      Component: () => {
        const { insert } = useSchemaInitializer()
        return (
          <WidgetInitializerComponent />
        )
      }
    },
  ]
})




import { SchemaBasicComponent, SchemaInitializerBasic } from './demos/schema-initializer-basic';

export class PluginInitializerBlockClient extends Plugin {
  async load() {

    this.app.addComponents({
      LayoutComponent, LayoutComponentBlock, LayoutInitializerComponent, WidgetComponent, WidgetInitializerComponent,
      SchemaInitializerBasic, SchemaBasicComponent

    })
    this.app.schemaSettingsManager.add(layoutSettings)
    this.app.schemaSettingsManager.add(widgetSettings)
    this.app.schemaInitializerManager.add(addActionButton)
    this.app.schemaInitializerManager.add(layoutInitializers);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    blockInitializers?.add('dataBlocks.layoutcomponent', {
      title: 'Layouts',
      Component: 'LayoutInitializerComponent'
    });


    const demoInitializers = this.app.schemaInitializerManager.get('page:addBlock');


    demoInitializers?.add(
      'dataBlocks.demos',
      {
        title: 'Demos',
        type: 'subMenu',
        children: [
          {
            title: 'SchemaInitializerBasic',
            type: 'item',
            Component: 'SchemaInitializerBasic'
          }
        ]

      }
    )

  }
}

export default PluginInitializerBlockClient;
