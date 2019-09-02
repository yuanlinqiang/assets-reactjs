import React, { PureComponent } from 'react';
import Link from 'umi/link';
import RightContent from '../GlobalHeader/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
import styles from './index.less';

export default class TopNavHeader extends PureComponent {
  state = {
    maxWidth: undefined,
  };

  static getDerivedStateFromProps(props) {
    return {
      maxWidth: (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) - 280 - 165 - 40,
    };
  }

  render() {
    const { theme, contentWidth, menuData, logo, hasLogo } = this.props;
    const { maxWidth } = this.state;
    const flatMenuKeys = getFlatMenuKeys(menuData);
    return (
      <div className={`${styles.head} ${theme === 'light' ? styles.light : ''}`}>
        <div
          ref={ref => {
            this.maim = ref;
          }}
          className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}
        >
          <div className={styles.left}>
            {
              hasLogo ? (
                <div className={styles.logo} key="logo" id="logo">
                  <Link to="/">
                    <img src={logo} alt="logo" />
                    <h1>态势感知</h1>
                  </Link>
                </div>
              ) : null 
            }
            <div
              style={{
                maxWidth,
              }}
            >
              <BaseMenu {...this.props} flatMenuKeys={flatMenuKeys} className={styles.menu} isSpread={false} />
            </div>
          </div>
          <RightContent {...this.props} />
        </div>
      </div>
    );
  }
}
