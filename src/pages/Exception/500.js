import React from 'react';
import Link from 'umi/link';
import {Exception} from 'ant-design-pro';

const Exception500 = () => (
  <Exception
    type="500"
    desc={'500'}
    linkElement={Link}
    backText={'返回首页'}
  />
);

export default Exception500;
