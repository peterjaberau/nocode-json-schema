import React from 'react'
import { Plugin } from '@nocobase/client';

import { useCollectionFn } from './datasources/useCollection';
import { JsonViewerSchema, JsonViewer, jsonViewerInitializerItem, jsonViewerSettings, JsonViewerProps} from './components/JsonViewer';


export class PluginJsonViewerClient extends Plugin {
  async load() {
    this.app.addComponents({ JsonViewer });
    this.app.addScopes({ useCollectionFn });
    this.app.schemaSettingsManager.add(jsonViewerSettings);
    this.app.schemaInitializerManager.addItem('page:addBlock', `dataBlocks.${jsonViewerInitializerItem.name}`, jsonViewerInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:addNew:addBlock', `dataBlocks.${jsonViewerInitializerItem.name}`, jsonViewerInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `dataBlocks.${jsonViewerInitializerItem.name}`, jsonViewerInitializerItem)
  }
}

export default PluginJsonViewerClient;
