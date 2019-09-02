import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'global', ...(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/src/models/global.js').default) });
app.model({ namespace: 'menu', ...(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/src/models/menu.js').default) });
app.model({ namespace: 'setting', ...(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/src/models/setting.js').default) });
app.model({ namespace: 'assetInfo', ...(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/src/pages/AssetManage/models/assetInfo.js').default) });
app.model({ namespace: 'assetTagGroupModel', ...(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/src/pages/AssetManage/models/assetTagGroupModel.js').default) });
app.model({ namespace: 'assetTypeModel', ...(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/src/pages/AssetManage/models/assetTypeModel.js').default) });
app.model({ namespace: 'reserveAssetModel', ...(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/src/pages/AssetManage/models/reserveAssetModel.js').default) });
