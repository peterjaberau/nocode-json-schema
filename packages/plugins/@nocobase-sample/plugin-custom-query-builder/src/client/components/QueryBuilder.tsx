import * as React from 'react';
import {
  useApp,
  SchemaInitializerItemType, useSchemaInitializer,
  SchemaSettings, SchemaSettingsBlockTitleItem,
  useCollection, useDataBlockRequest,
  withDynamicSchemaProps,
  BlockInitializer, useResourceContext, useBlockContext, useSchemaOptionsContext,
} from '@nocobase/client';
import { CodeOutlined } from '@ant-design/icons';
import { useT } from '../locale'
import { BlockName, BlockNameLowercase } from '../constants';


import type { JsonGroup, Config, ImmutableTree, BuilderProps } from '@react-awesome-query-builder/ui'
import { Utils as QbUtils, Query, Builder, BasicConfig } from '@react-awesome-query-builder/ui';
import '@react-awesome-query-builder/ui/css/styles.css';

import { ISchema, useFieldSchema } from '@formily/react';

const InitialConfig = BasicConfig;

export interface QueryBuilderProps {
  [key: string]: any;
}

const config: Config = {
  ...InitialConfig,
  fields: {
    qty: {
      label: 'Qty',
      type: 'number',
      fieldSettings: {
        min: 0,
      },
      valueSources: ['value'],
      preferWidgets: ['number'],
    },
    price: {
      label: 'Price',
      type: 'number',
      valueSources: ['value'],
      fieldSettings: {
        min: 10,
        max: 100,
      },
      preferWidgets: ['slider', 'rangeslider'],
    },
    name: {
      label: 'Name',
      type: 'text',
    },
    color: {
      label: 'Color',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'yellow', title: 'Yellow' },
          { value: 'green', title: 'Green' },
          { value: 'orange', title: 'Orange' }
        ],
      }
    },
    is_promotion: {
      label: 'Promo?',
      type: 'boolean',
      operators: ['equal'],
      valueSources: ['value'],
    },
  }
};


const queryValue: JsonGroup = { id: QbUtils.uuid(), type: "group" };

export const queryBuilderSettings = new SchemaSettings({
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

export function useQueryBuilderBlockProps() {
  const fieldSchema = useFieldSchema();
  return fieldSchema.parent?.['x-decorator-props']?.[BlockNameLowercase]
}

export const queryBuilderSchema: ISchema = {
    type: 'void',
    'x-component': 'CardItem',
    'x-settings': queryBuilderSettings.name,
    'x-component-props': {
      [BlockNameLowercase]: {},
    },
    properties: {
      [BlockNameLowercase]: {
        type: 'void',
        'x-component': BlockName,
        'x-use-component-props': 'useQueryBuilderBlockProps',
      }
    }
}

export const queryBuilderInitializerItem: SchemaInitializerItemType = {
  type: 'item',
  name: BlockNameLowercase,
  icon: 'PlayCircleOutlined',
  useComponentProps() {
    const { insert } = useSchemaInitializer();
    const t = useT();
    return {
      title: t(BlockName),
      onClick: () => {
        insert(queryBuilderSchema);
      },
    };
  },
}


export class QueryBuilder extends React.Component {
  state = {
    tree: QbUtils.loadTree(queryValue),
    config: config
  };

  render = () => (
    <div>
      <Query
        {...config}
        value={this.state.tree}
        onChange={this.onChange}
        renderBuilder={this.renderBuilder}
      />
      {this.renderResult(this.state)}
    </div>
  )

  renderBuilder = (props) => (
    <div className="query-builder-container" style={{padding: '10px'}}>
      <div className="query-builder qb-lite">
        <Builder {...props} />
      </div>
    </div>
  )


  renderResult = ({tree: immutableTree, config}) => (
    <div className="query-builder-result">
      <div>Query string: <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre></div>
      <div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
      <div>SQL where: <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre></div>
      <div>JsonLogic: <pre>{JSON.stringify(QbUtils.jsonLogicFormat(immutableTree, config))}</pre></div>
    </div>
  )

  onChange = (immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `packages/examples/src/demo`
    this.setState({tree: immutableTree, config: config});

    const jsonTree = QbUtils.getTree(immutableTree);
    console.log(jsonTree);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  }
}
