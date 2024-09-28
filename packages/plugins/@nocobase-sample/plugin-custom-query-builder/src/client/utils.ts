import { removeGridFormItem } from '@nocobase/client/es/schema-initializer/utils';
import {
  SchemaInitializerItemType,
  useActionContext,
  useCollection_deprecated,
  useCollectionManager_deprecated,
} from '@nocobase/client';
import { useForm } from '@formily/react';

export const useInheritsFormItemInitializerFields = (options?) => {
  const { name } = useCollection_deprecated();
  const { getInterface, getInheritCollections, getCollection, getParentCollectionFields } =
    useCollectionManager_deprecated();
  const inherits = getInheritCollections(name);
  const { snapshot } = useActionContext();
  const form = useForm();

  return inherits?.map((v) => {
    const fields = getParentCollectionFields(v, name);
    const { readPretty = form.readPretty, block = 'Form', component = 'CollectionField' } = options || {};
    const targetCollection = getCollection(v);
    return {
      [targetCollection?.title]: fields
        ?.filter((field) => field?.interface)
        ?.map((field) => {
          const interfaceConfig = getInterface(field.interface);
          const targetCollection = getCollection(field.target);
          // const component =
          //   field.interface === 'o2m' && targetCollection?.template !== 'file' && !snapshot
          //     ? 'TableField'
          //     : 'CollectionField';
          const schema = {
            type: 'string',
            name: field.name,
            title: field?.uiSchema?.title || field.name,
            // 'x-designer': 'FormItem.Designer',
            'x-toolbar': 'FormItemSchemaToolbar',
            'x-settings': 'fieldSettings:FormItem',
            'x-component': component,
            'x-decorator': 'FormItem',
            'x-collection-field': `${name}.${field.name}`,
            'x-component-props': {},
            'x-read-pretty': field?.uiSchema?.['x-read-pretty'],
          };
          return {
            name: field?.uiSchema?.title || field.name,
            type: 'item',
            title: field?.uiSchema?.title || field.name,
            Component: 'CollectionFieldInitializer',
            remove: removeGridFormItem,
            schemaInitialize: (s) => {
              interfaceConfig?.schemaInitialize?.(s, {
                field,
                block,
                readPretty,
                targetCollection,
              });
            },
            schema,
          } as SchemaInitializerItemType;
        }),
    };
  });
};
