import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Menu, Icon } from 'antd';
import { connect } from 'dva'
import Link from 'umi/link';
import router from 'umi/router';
import { urlToList } from '../_utils/pathTools';
import { getMenuMatches } from './SiderMenuUtils';
import { isUrl } from '@/utils/utils';
import styles from './index.less';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

@connect ( ( {menu}  ) => ({
  menu,
}) )
export default class BaseMenu extends PureComponent {

  constructor() {
    super();
    this.state = {
      isFullScreen: false,
      activeIndex:0,
    }
  }

  componentDidMount = () => {
    this.watchFullScreen();
  }

  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData,isSpread, parent) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map((item,index) => this.getSubMenuOrItem(item,index,isSpread, parent))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    const { flatMenuKeys } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(flatMenuKeys, itemPath).pop());
  };

  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = (item,index,isSpread) => {
    if( isSpread ){
        // doc: add hideChildrenInMenu
      if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
        const { name } = item;
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{name}</span>
                </span>
              ) : (
                name
              )
            }
            key={item.path}
          >
            {this.getNavMenuItems(item.children,isSpread)}
          </SubMenu>
        );
      }
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item,index,isSpread)}</Menu.Item>;
    }else{
      return <Menu.Item style={{fontSize:16}} key={item.path}>{this.getMenuItemPath(item,index,isSpread)}</Menu.Item>;
    }
    
  };

  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = (item, index,isSpread) => {
    const { name } = item;
    let IPath = item.path ;
    if( !isSpread ){
      IPath = item.children[0].path;
    }
    const itemPath = this.conversionPath(IPath)
    const icon = getIcon(item.icon);
    const { target } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    const { location, isMobile, onCollapse, dispatch } = this.props;
    if( !isSpread ){
      return (
        <Link
          to={itemPath}
          target={target}
          replace={itemPath === location.pathname}
          onClick={
            isMobile
              ? () => {
                  onCollapse(true);
                }
              : () => { this.handleSliderSwitch( item,index ) }
          }
        >
          {icon}
          <span>{name}</span>
        </Link>
      );
    }else{
      return (
        <Link
          to={itemPath}
          target={target}
          replace={itemPath === location.pathname}
          onClick={
            isMobile
              ? () => {
                  onCollapse(true);
                }
              : undefined
          }
        >
          {icon}
          <span>{name}</span>
        </Link>
      );
    }
  };

  handleSliderSwitch = (item,index) => {
    const SiderMenu = item
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getSiderMenuData',
      payload: { SiderMenu }
    })
    this.setState({
      activeIndex:index
    })
  }

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  fullScreen = () => {
    if (!this.state.isFullScreen) {
      this.requestFullScreen();
    } else {
      this.exitFullscreen();
    }
  };

  //进入全屏
  requestFullScreen = () => {
    var de = document.documentElement;
    if (de.requestFullscreen) {
      de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
      de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
      de.webkitRequestFullScreen();
    }
  };

  //退出全屏
  exitFullscreen = () => {
    var de = document;
    if (de.exitFullscreen) {
      de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
      de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
      de.webkitCancelFullScreen();
    }
  };

  //监听fullscreenchange事件
  watchFullScreen = () => {
    const _self = this;
    document.addEventListener(
      "webkitfullscreenchange",
      function () {
        _self.setState({
          isFullScreen: document.webkitIsFullScreen
        });
      },
      false
    );
  };

  render() {
    const {
      openKeys,
      theme,
      mode,
      location: { pathname },
      className,
      collapsed,
    } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys(pathname);
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys && !collapsed) {
      props = {
        openKeys: openKeys.length === 0 ? [...selectedKeys] : openKeys,
      };
    }
    const { handleOpenChange, style, menuData, isSpread } = this.props;
    const cls = classNames(className, {
      'top-nav-menu': mode === 'horizontal',
    });

    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        className={cls}
        {...props}
      >
        {this.getNavMenuItems(menuData, isSpread)}
      </Menu>
    );
  }
}
