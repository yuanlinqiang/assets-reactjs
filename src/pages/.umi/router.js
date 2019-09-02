import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": require('../../layouts/BasicLayout').default,
    "routes": [
      {
        "path": "/index.html",
        "redirect": "/sp-asset",
        "exact": true
      },
      {
        "path": "/",
        "redirect": "/sp-asset",
        "exact": true
      },
      {
        "path": "/sp-asset",
        "name": "资产管理",
        "icon": "gold",
        "routes": [
          {
            "path": "/sp-asset",
            "redirect": "/sp-asset/assettype",
            "exact": true
          },
          {
            "path": "/sp-asset/assettype",
            "name": "资产类别",
            "icon": "appstore",
            "component": require('../AssetManage/AssetTypeList').default,
            "exact": true
          },
          {
            "path": "/sp-asset/assetinfo",
            "name": "资产信息",
            "icon": "bank",
            "component": require('../AssetManage/AssetInfo').default,
            "exact": true
          },
          {
            "path": "/sp-asset/reserveasset",
            "name": "预备资产",
            "icon": "block",
            "component": require('../AssetManage/ReserveAssetInfo').default,
            "exact": true
          },
          {
            "path": "/sp-asset/assettag",
            "name": "资产标签",
            "icon": "tag",
            "component": require('../AssetManage/AssetTagInfo').default,
            "exact": true
          },
          {
            "component": () => React.createElement(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": () => React.createElement(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('H:/pingtaikaifannews/sp_assets_font/sp-assets/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
