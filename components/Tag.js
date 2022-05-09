import React from "react";
import { Box, Button, Text } from "grommet";
import { Close } from "grommet-icons";

const Tag = ({
  label,
  onClick,
  removable = false,
  onRemove,
  background = "accent-4",
  color = "dark-1",
  ...otherProps
}) => (
  <Box
    background={background}
    alignSelf="start"
    direction="row"
    align="center"
    round="2px"
    pad="2px 8px"
    gap="small"
    {...otherProps}
  >
    <Box onClick={onClick}>
      <Text
        size="12px"
        weight="bold"
        color={color}
        style={{
          fontFamily: '"Inknut Antiqua", serif',
          textShadow: ".5px .5px 1px #e7f5d61a",
          textTransform: "uppercase",
        }}
      >
        {label && label}
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
