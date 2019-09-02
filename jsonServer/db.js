let Mock = require('mockjs');

const titles = [
	'Alipay',
	'Angular',
	'Ant Design',
	'Bootstrap',
	'React',
	'Vue',
];
const desc = [
	'那是一种内在的东西， 他们到达不了，也无法触及的',
	'希望是一个好东西，也许是最好的，好东西是不会消亡的',
	'生命就像一盒巧克力，结果往往出人意料',
	'城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
	'那时候我只会想自己想要什么，从不想自己拥有什么',
	'凛冬将至',
];
const user = [
	'付小小',
	'曲丽丽',
	'林东东',
	'周星星',
	'吴加好',
	'朱偏右',
];
const mem = [
	'科学搬砖组',
	'全组都是吴彦祖',
	'中二少女团',
	'程序员日常',
	'高逼格设计天团',
	'骗你来学计算机'
]
module.exports = function () {
	var data = {
		tableList: [],//评测机构基本信息
	}

	for (var i = 0; i <= 6; i++) {
		data.tableList.push({
			id: i + 1,
			name: user[i],
			title: titles[i],
			description: desc[i],
			updatedAt: new Date(),
			member: mem[i],
		})
	}
	return data
}