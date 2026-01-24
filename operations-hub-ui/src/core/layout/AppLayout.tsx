import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

type AppLayoutProps = {
  children: ReactNode;
};

const drawerWidth = 260;
const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 44;
const PAGE_MAX_WIDTH = 1600;

const navItems = [
  { label: "Overview", to: "/", icon: <DashboardOutlinedIcon fontSize="small" /> },
  { label: "Users", to: "/users", icon: <GroupOutlinedIcon fontSize="small" /> },
  { label: "Audit", to: "/audit", icon: <ReceiptLongOutlinedIcon fontSize="small" /> },
];

const sx = {
  root: {
    display: "flex",
    height: "100dvh",
    overflow: "hidden",      // ключ
    bgcolor: "background.default",
  },
  sidebar: {
    width: drawerWidth,
    flexShrink: 0,
    borderRight: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    px: 3,
    py: 5.5,
    height: HEADER_HEIGHT,
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "divider",
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 1.5,
    bgcolor: "primary.main",
    color: "primary.contrastText",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
    userSelect: "none",
  },
  navBlock: {
    px: 1.5,
    py: 1.5,
  },
  navLabel: {
    textTransform: "uppercase",
    letterSpacing: 0.12,
    fontSize: 11,
    mb: 0.75,
    display: "block",
  },
  navBtn: {
    borderRadius: 1.5,
    mb: 0.5,
    px: 1.25,
    "&:hover": {
      bgcolor: "action.hover",
    },
    "&.Mui-selected": {
      bgcolor: "action.selected",
    },
    "&.Mui-selected:hover": {
      bgcolor: "action.selected",
    },
  },
  navIcon: (selected: boolean) => ({
    minWidth: 34,
    color: selected ? "primary.main" : "text.secondary",
  }),
  profile: {
    px: 2,
    py: 1.5,
    // borderTop: "1px solid",
    // borderColor: "divider",
  },
  main: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  header: {
    height: HEADER_HEIGHT,
    borderBottom: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    px: 3,
    gap: 1,
  },
  content: {
    flexGrow: 1,
    overflow: "auto",
    px: 3,
    py: 3,
  },
  contentInner: {
    maxWidth: PAGE_MAX_WIDTH,
    mx: "auto",
  },
  footer: {
    height: FOOTER_HEIGHT,
    borderTop: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 3,
    py: 1.5,
    fontSize: 12,
    color: "text.secondary",
  },
} as const;

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={sx.root}>
      {/* SIDEBAR */}
      <Box component="aside" sx={sx.sidebar}>
        <Box sx={sx.sidebarHeader}>
          <Box sx={sx.logo}>OH</Box>

          <Box sx={{margin: 1.7}}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>
              Operations Hub
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
              Internal tools demo
            </Typography>
          </Box>
        </Box>

        <Box sx={sx.navBlock}>
          <Typography variant="caption" color="text.secondary" sx={sx.navLabel}>
            Main
          </Typography>

          <List disablePadding>
            {navItems.map((item) => {
              const selected = location.pathname === item.to;

              return (
                <ListItemButton
                  key={item.to}
                  selected={selected}
                  onClick={() => navigate(item.to)}
                  sx={sx.navBtn}
                  aria-current={selected ? "page" : undefined}
                >
                  <ListItemIcon sx={sx.navIcon(selected)}>{item.icon}</ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: selected ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={sx.profile}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ width: 38, height: 38 }}>OV</Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.2 }} noWrap>
                Oleksii Vlasiuk
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* MAIN AREA */}
      <Box sx={sx.main}>
{/*         
        <Box component="header" sx={sx.header}>
        //later: Notifications + ProfileMenu
        </Box> 
*/}


        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: "hidden", // ← ВАЖНО
            px: 3,
            py: 3,
          }}
        >
          <Box
            sx={{
              maxWidth: PAGE_MAX_WIDTH,
              mx: "auto",
              height: "100%",          // ← ВАЖНО
              display: "flex",
              flexDirection: "column",
            }}
          >
            {children}
          </Box>
        </Box>


        <Box component="footer" sx={sx.footer}>
            <span></span>
          <span>© 2025 Operations Hub - Demo</span>
          
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
