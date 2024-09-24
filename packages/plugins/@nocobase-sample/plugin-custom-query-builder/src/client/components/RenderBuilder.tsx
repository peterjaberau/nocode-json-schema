import * as React from 'react';

import {
  Application,
  Plugin,
  SchemaComponent,
  SchemaInitializer,
  useSchemaInitializer,
  useSchemaInitializerRender,
} from '@nocobase/client';
import { useFieldSchema } from '@formily/react';

/*
  - SchemaComponentProvider
      - SchemaComponent
          - SchemaInitializer
              - useSchemaInitializer
                  - useSchemaInitializerRender
                      - Hello
                          - HelloInitializer
*/


const Hello = (props) => {
  return (
    <div>
      {props.children}
      <HelloInitializer />
    </div>
  )
}

const HelloInitializer = () => {
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer']);
  return render();
}

const myInitializer = new SchemaInitializer({
  name: 'myInitializer',
  title: 'Add block',
  items: [
    {
      name: 'helloBlock',
      type: 'item',
      useComponentProps() {
        const { insert } = useSchemaInitializer();
        return {
          title: 'Hello',
          onClick: () => {
            insert({
              type: 'void',
              'x-decorator': 'CardItem',
              'x-component': 'h1',
              'x-content': 'Hello, world!',
            });
          },
        };
      },
    },
  ],
});


const HomePage = () => {
  return (
    <SchemaComponent
      schema={{
        name: 'root',
        type: 'void',
        'x-component': 'Hello',
        'x-initializer': 'myInitializer',
      }}
    />
  );
};




