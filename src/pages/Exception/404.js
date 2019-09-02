import React from 'react';
import Link from 'umi/link';
import {Exception} from 'ant-design-pro';

const Exception404 = () => (
  <Exception
    type="404"
    desc={'404'}
    linkElement={Link}
    backText={'返回首页'}
  />
);

export default Exception404;
