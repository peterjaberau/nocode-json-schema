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
import { BlockPlusName, BlockPlusNameLowercase } from '../constants';
import 'react-querybuilder/dist/query-builder.css';

import { Field, QueryBuilder as QueryBuilderPlus, RuleGroupType } from 'react-querybuilder';
import { QueryBuilderAntD } from '@react-querybuilder/antd';
import { useFieldSchema } from '@formily/react';


export interface QueryBuilderPlusProps {
  [key: string]: any;
}


export const queryBuilderPlusSettings = new SchemaSettings({
  name: `blockSettings:${BlockPlusNameLowercase}`,
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

export function QueryBuilderPlusSchema() {
  return {
    type: 'void',
    'x-component': 'CardItem',

    'x-decorator-props': {
      [BlockPlusNameLowercase]: {},
    },
    'x-settings': queryBuilderPlusSettings.name,
    properties: {
      [BlockPlusNameLowercase]: {
        type: 'void',
        'x-component': BlockPlusName,
      }
    }
  }
}

export const queryBuilderPlusInitializerItem: SchemaInitializerItemType = {
  name: BlockPlusNameLowercase,
  useComponentProps() {
    const { insert } = useSchemaInitializer();
    const t = useT();
    return {
      title: t(BlockPlusName),
      icon: <CodeOutlined />,
      onClick: () => {
        insert(QueryBuilderPlusSchema())
      }
    };
  },
}
const fields: any[] = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
];


export const QueryBuilderPlusComponent: React.FC<QueryBuilderPlusProps> = withDynamicSchemaProps((props) => {

  const [query, setQuery] = React.useState<RuleGroupType>({
    combinator: 'and',
    rules: [
      { field: 'firstName', operator: '=', value: 'Steve' },
      { field: 'lastName', operator: '=', value: 'Vai' },
    ],
  });


  const app = useApp();

  return (
    <QueryBuilderAntD>
      <QueryBuilderPlus fields={fields} query={query} onQueryChange={setQuery}/>
    </QueryBuilderAntD>
  )

})
