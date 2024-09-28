import React from 'react'
import { Plugin } from '@nocobase/client';

import { useCollectionFn } from './datasources/useCollection';
import {
  JsonViewer,
  useJsonViewerProps,
  jsonViewerSettings,
  jsonViewerInitializerItem
} from './components/JsonViewer';


export class PluginJsonViewerClient extends Plugin {
  async load() {
    this.app.addComponents({ JsonViewer });
    this.app.addScopes({ useJsonViewerProps });
    this.app.schemaSettingsManager.add(jsonViewerSettings);
    this.app.schemaInitializerManager.addItem('page:addBlock', `otherBlocks.${jsonViewerInitializerItem.name}`, jsonViewerInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:addNew:addBlock', `otherBlocks.${jsonViewerInitializerItem.name}`, jsonViewerInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${jsonViewerInitializerItem.name}`, jsonViewerInitializerItem)
  }
}

export default PluginJsonViewerClient;
