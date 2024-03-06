import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button
} from '@mui/material'

export const Menu = ({ padding, user }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/">
          home
        </Button>
        <Button color="inherit" component={Link} to="/notes">
          notes
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {user
          ? <em>{user} logged in</em>
          : <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        }
      </Toolbar>
    </AppBar >)
}
