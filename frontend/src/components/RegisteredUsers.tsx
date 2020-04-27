import React from 'react'
import styled from 'styled-components'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Paper from '@material-ui/core/Paper'

import {User} from '../utils/User'

interface RegisteredUsersProps {
  users: User[];
}

const Wrapper = styled.div`
  max-width: 400px;
`

const RegisteredUsers: React.FC<RegisteredUsersProps> = ({users}) => (
  <Wrapper>
    <TableContainer component={Paper}>
      <Table>
        <colgroup>
          <col width="60px" />
        </colgroup>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Username</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>
                <span role="img" aria-label="Check mark">✅</span>
              </TableCell>
              <TableCell>{user.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Wrapper>
)

export default RegisteredUsers