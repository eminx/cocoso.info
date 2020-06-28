import React from 'react';
import { Box, Button, Text } from 'grommet';
import { Close } from 'grommet-icons';

const Tag = ({
  label,
  onClick,
  removable = false,
  onRemove,
  background = 'accent-4',
  color = 'dark-1',
  ...otherProps
}) => (
  <Box
    background={background}
    alignSelf="start"
    direction="row"
    align="center"
    round="2px"
    pad="2px 4px"
    gap="small"
    {...otherProps}
  >
    <Box onClick={onClick}>
      <Text
        size="12px"
        weight="bold"
        color={color}
        style={{ textShadow: '0 .5px 2px #fff' }}
      >
        {label && label.toUpperCase()}
      </Text>
    </Box>
    {removable && (
      <Button
        plain
        onClick={onRemove}
        icon={<Close color="dark-2" size="small" />}
      />
    )}
  </Box>
);

export default Tag;
