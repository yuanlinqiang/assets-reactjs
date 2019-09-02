export default [
	{
		path: '/',
		component: '../layouts/BasicLayout',
		routes: [
			{ path: '/', redirect: '/sp-asset' },
			{
				path:'/sp-asset',
				name:'资产管理',
				icon: 'gold',
				routes:[
					{ path: '/sp-asset', redirect:'/sp-asset/assettype' },
					 {
					 	path:'/sp-asset/assettype',
					 	name:'资产类别',  
					 	icon: 'appstore',
						 component: './AssetManage/AssetTypeList'
					 }
					,
					{
						path:'/sp-asset/assetinfo',
						name:'资产信息',
						icon: 'bank',
						component: './AssetManage/AssetInfo'
					}
					,
					{
						path:'/sp-asset/reserveasset',
						name:'预备资产',
						icon: 'block',
						component: './AssetManage/ReserveAssetInfo'
					},
					{
						path:'/sp-asset/assettag',
						name:'资产标签',
						icon: 'tag',
						component: './AssetManage/AssetTagInfo'
					}
				]
			},
			// {
			// 	path: '/exception/403',
			// 	component: './Exception/403'
			// },
			// {
			// 	path: '/exception/404',
			// 	component: './Exception/404'
			// },
			// {
			// 	path: '/exception/500',
			// 	component: './Exception/500'
			// },
		]
	}
]
