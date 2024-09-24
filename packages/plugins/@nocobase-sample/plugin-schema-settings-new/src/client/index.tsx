import { Plugin } from '@nocobase/client';
import { ImageV2 } from './component';
import { useImageV2Props } from './schema';
import { imageInitializerItem } from './initializer';
import { imageSettings } from './settings';
import * as React from 'react';

export class PluginSchemaSettingsNewClient extends Plugin {
  async load() {
    this.app.addComponents({ ImageV2 })
    this.app.addScopes({ useImageV2Props })

    this.app.schemaSettingsManager.add(imageSettings)
    this.app.schemaInitializerManager.addItem('page:addBlock', `otherBlocks.${imageInitializerItem.name}`, imageInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:addNew:addBlock', `otherBlocks.${imageInitializerItem.name}`, imageInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${imageInitializerItem.name}`, imageInitializerItem)


    this.app.router.add('admin.image-component',{
      path:'/admin/image-component',
      Component:()=> {
        return (
          <>
          <div style={{ marginTop:20, marginBottom:20}}>
            <ImageV2/>
          </div>

          <div style={{ marginTop:20, marginBottom:20}}>
            <ImageV2 src={{ url:'https://picsum.photos/1200/500'}}height={200}/>
          </div>

          <div style={{ marginTop:20, marginBottom:20}}>
            <ImageV2 src={{ url:'https://picsum.photos/1200/500'}}objectFit='contain'/>
          </div>

          <div style={{ marginTop:20, marginBottom:20}}>
            <ImageV2 src={{ url:'https://picsum.photos/1200/500'}}lazy/>
          </div>
        </>
        )
      }
    });
  }
}

export default PluginSchemaSettingsNewClient;
