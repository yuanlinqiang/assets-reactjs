import React from 'react';
import Link from 'umi/link';
import {Exception} from 'ant-design-pro';

const Exception403 = () => (
  <Exception
    type="403"
    desc={'403'}
    linkElement={Link}
    backText={'返回首页'}
  />
);

export default Exception403;
