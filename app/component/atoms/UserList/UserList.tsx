import React from 'react';
import { getInitial, getRandomColor } from '../../../utils/helper';
import { Flex } from '../Basic';
import { Text } from '../Text';

interface UserListTypes {
  list: Array<{ name: string }>;
}
const UserLists = ({ list }: UserListTypes) => (
  <>
    {list.map(({ name }, index) => (
      <Flex
        m="0 -5px 0 0"
        w="20px"
        h="20px"
        b={`1px solid ${getRandomColor()}`}
        br="50%"
        p="5px"
        key={index}
        j="center"
        a="center"
        bg="white"
      >
        <Text variant="small">{getInitial(name)}</Text>
      </Flex>
    ))}
  </>
);

export const MemoizedUserList = React.memo(UserLists);
