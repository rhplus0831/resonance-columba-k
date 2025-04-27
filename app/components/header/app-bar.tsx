"use client";

import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import TableViewIcon from "@mui/icons-material/TableView";
import { IconButton, Menu, MenuItem, ThemeProvider, createTheme } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MuiLink from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { grey, orange } from "@mui/material/colors";
import Link from "next/link";
import { useState } from "react";
import LogoSvgIcon from "./logo-icon";
export default function HeaderAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const theme = createTheme({
    palette: {
      mode: "light",
      primary: {
        main: grey[900],
      },
      secondary: {
        main: grey[300],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" sx={{ backgroundColor: orange[300] }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: "52px !important", maxHeight: "52px !important" }}>
            <Typography fontSize="3em" lineHeight="0" className="fill-black mr-2">
              <LogoSvgIcon />
            </Typography>

            <MuiLink href="/route" variant="h6" underline="none" component={Link} noWrap className="mr-4 ">
              Columba
            </MuiLink>

            <Box className="grow" />

            {/* Desktop Nav Menu */}
            <Box className="grow-0 hidden min-[852px]:flex ">
              <Link href="/prices" className="ml-2">
                <Button variant="text" className=" px-0" startIcon={<TableViewIcon />}>
                  데이터
                </Button>
              </Link>
              <Link href="/route" className="ml-2">
                <Button variant="text" className=" px-0" startIcon={<RouteOutlinedIcon />}>
                  루트
                </Button>
              </Link>
              <Link href="/formula" className="ml-2">
                <Button variant="text" className=" px-0" startIcon={<PrecisionManufacturingIcon />}>
                  제조
                </Button>
              </Link>
              <Link href="/about" className="ml-2">
                <Button variant="text" className=" px-0" startIcon={<InfoOutlinedIcon />}>
                  정보
                </Button>
              </Link>

              <Link href="https://res.ujoygames.com/" className="ml-2" target="_blank">
                <Button variant="outlined" sx={{ color: "black" }} color="error">
                레조넌스 공식 홈페이지
                </Button>
              </Link>
            </Box>

            {/* Mobile Nav Menu */}
            <Box className="grow-0 flex min-[852px]:hidden">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                className="block"
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href="/prices" className="mx-auto">
                    <Button variant="text" className="" startIcon={<TableViewIcon />}>
                      데이터
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href="/route" className="mx-auto">
                    <Button variant="text" className="" startIcon={<RouteOutlinedIcon />}>
                      루트
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href="/formula" className="mx-auto">
                    <Button variant="text" className="" startIcon={<PrecisionManufacturingIcon />}>
                      제조
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href="/discussion" className="mx-auto">
                    <Button variant="text" className="" startIcon={<ChatBubbleOutlineRoundedIcon />}>
                      토론
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href="/about" className="mx-auto">
                    <Button variant="text" className="" startIcon={<InfoOutlinedIcon />}>
                      정보
                    </Button>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link href="https://res.ujoygames.com/" className="mx-auto" target="_blank">
                    <Button variant="outlined" className="" color="error">
                      레조넌스 공식 홈페이지
                    </Button>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}
