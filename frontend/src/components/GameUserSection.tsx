import React from 'react'
import styled, {css} from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import {User} from '../utils/User'
import {PlayerColor} from '../utils/PlayerColor'
import stringToColour from '../utils/stringToColour'

const UserIcon = styled(
  ({ children, ...rest }: { color: string; children: string }) =>
    <div {...rest}>{children}</div>
)(({ color, theme }) => css`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 28px;
  background-color: ${color || '#eee'};
  color: #333;
  border-radius: 8px;
  margin-right: ${theme.spacing(2)}px;
`
)

interface GameUserSectionProps {
  user: User;
  color: PlayerColor;
  isTop?: boolean;
}

const GameUserSection: React.FC<GameUserSectionProps> = ({
  user,
  color,
  isTop = false
}) => {
  const userColor = stringToColour(user.name)
  return (
    <Box mt={isTop ? 0 : 2} mb={isTop ? 2 : 0} display="flex">
      <UserIcon color={userColor}>{user.name[0]}</UserIcon>
      <Typography variant="subtitle1">{user.name}</Typography>
    </Box>
  )
}

export default React.memo(GameUserSection)