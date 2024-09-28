import React from 'react'
import { Plugin } from '@nocobase/client';

import {
  QueryBuilder,
  queryBuilderInitializerItem,
  queryBuilderSettings
} from './components/QueryBuilder';

import {
  FilterBuilder,
  filterBuilderSchemaInitializerItem,
} from './components/FilterBuilder';

import {
  Playground,
  playgroundInitializerItem,
  playgroundSettings,
  usePlaygroundProps,
} from './components/Playground';
import {
  PlaygroundRecord,
  playgroundRecordInitializerItem,
  playgroundRecordSettings,
  usePlaygroundRecordProps,
} from './components/PlaygroundRecord';


import {
  PlaygroundDetails,
  playgroundDetailsInitializerItem,
  playgroundDetailsSettings,
  usePlaygroundDetailsProps,
} from './components/PlaygroundDetails';



export class PluginCustomQueryBuilderClient extends Plugin {
  async load() {
    this.app.addComponents({ QueryBuilder, FilterBuilder, Playground, PlaygroundRecord, PlaygroundDetails });

    this.app.schemaSettingsManager.add(queryBuilderSettings);
    this.app.schemaSettingsManager.add(playgroundSettings);
    this.app.schemaSettingsManager.add(playgroundRecordSettings);
    this.app.schemaSettingsManager.add(playgroundDetailsSettings);


    this.app.addScopes({ usePlaygroundProps });
    this.app.addScopes({ usePlaygroundRecordProps });
    this.app.addScopes({ usePlaygroundDetailsProps });

    this.app.schemaInitializerManager.addItem('page:addBlock', `otherBlocks.${playgroundDetailsInitializerItem.name}`, playgroundDetailsInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${playgroundDetailsInitializerItem.name}`, playgroundDetailsInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:common:addBlock', `otherBlocks.${playgroundDetailsInitializerItem.name}`, playgroundDetailsInitializerItem)


    this.app.schemaInitializerManager.addItem('page:addBlock', `otherBlocks.${playgroundRecordInitializerItem.name}`, playgroundRecordInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:common:addBlock', `otherBlocks.${playgroundRecordInitializerItem.name}`, playgroundRecordInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${playgroundRecordInitializerItem.name}`, playgroundRecordInitializerItem)



    this.app.schemaInitializerManager.addItem('page:addBlock', `otherBlocks.${playgroundInitializerItem.name}`, playgroundInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:common:addBlock', `otherBlocks.${playgroundInitializerItem.name}`, playgroundInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${playgroundInitializerItem.name}`, playgroundInitializerItem)

    this.app.schemaInitializerManager.addItem('page:addBlock', `otherBlocks.${queryBuilderInitializerItem.name}`, queryBuilderInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:addNew:addBlock', `otherBlocks.${queryBuilderInitializerItem.name}`, queryBuilderInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${queryBuilderInitializerItem.name}`, queryBuilderInitializerItem)


    this.app.schemaInitializerManager.addItem('page:addBlock', `dataBlocks.${filterBuilderSchemaInitializerItem.name}`, filterBuilderSchemaInitializerItem)
    this.app.schemaInitializerManager.addItem('popup:addNew:addBlock', `dataBlocks.${filterBuilderSchemaInitializerItem.name}`, filterBuilderSchemaInitializerItem)
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `dataBlocks.${filterBuilderSchemaInitializerItem.name}`, filterBuilderSchemaInitializerItem)


    // this.app.schemaInitializerManager.addItem('page:addBlock', `otherBlocks.${queryBuilderPlusInitializerItem.name}`, queryBuilderPlusInitializerItem)
    // this.app.schemaInitializerManager.addItem('popup:addNew:addBlock', `otherBlocks.${queryBuilderPlusInitializerItem.name}`, queryBuilderPlusInitializerItem)
    // this.app.schemaInitializerManager.addItem('mobilePage:addBlock', `otherBlocks.${queryBuilderPlusInitializerItem.name}`, queryBuilderPlusInitializerItem)

  }
}

export default PluginCustomQueryBuilderClient;
