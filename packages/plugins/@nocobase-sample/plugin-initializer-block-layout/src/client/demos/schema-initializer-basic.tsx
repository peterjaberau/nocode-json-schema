import { Field } from '@formily/core';
import { observer, useField, useFieldSchema } from '@formily/react';
import {
  Application,
  Plugin,
  SchemaComponent,
  SchemaInitializer,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaInitializerRender,
} from '@nocobase/client';
import * as React from 'react';

interface SchemaBasicComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}


export const SchemaBasicComponent: React.FC<SchemaBasicComponentProps>  = ({ children, ...rest }) => {
  return (
    <div style={{ marginBottom: 20, padding: '0 20px', height: 50, lineHeight: '50px', background: '#f1f1f1' }}>
      {'SchemaBasicComponent'}
    </div>
  );
}

export const SchemaInitializerBasic: React.FC<SchemaBasicComponentProps>  = ({ children, ...rest }) => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const handleClick = () => {
    insert({
      type: 'void',
      'x-decorator' : 'BlockItem',
      'x-component': 'SchemaBasicComponent'
    });
  };
  return <SchemaInitializerItem {...itemConfig} onClick={handleClick} />;
}



