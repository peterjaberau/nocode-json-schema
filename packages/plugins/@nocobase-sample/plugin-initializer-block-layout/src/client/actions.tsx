import React from 'react';
import { App as AntdApp } from 'antd';
import { ActionProps, ISchema, SchemaComponent, Plugin } from '@nocobase/client';


function useActionProps(): ActionProps {
  const { message } = AntdApp.useApp();

  return{
    confirm: {
      // confirm props
      title: 'Delete',
      content: 'Are you sure you want to delete it?',
    },
    onClick(){
      // after confirm ok
      message.success('Deleted!');
    },
  };
}
const schema : ISchema = {
  type:'void',
  name:'test',
  'x-component':'Action',
  title: 'Delete',
  'x-use-component-props': 'useActionProps',
}
