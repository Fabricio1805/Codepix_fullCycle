import { AppBar, Box, ListItemText, Toolbar, Typography } from "@mui/material";
import { cookies } from "next/headers";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { NavBarBankAccount } from "./NavBarBankAccount";


export function NavBar() {
  const cookiesStore = cookies();
  const bankAccountId = cookiesStore.get("bankAccountId")?.value;
  return (
    <AppBar position="fixed">
      <Toolbar sx={{ backgroundColor: "primary" }}>
        <AccountBalanceIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap component="div">
          <ListItemText
            primary={process.env.NEXT_PUBLIC_BANK_NAME}
            secondary={process.env.NEXT_PUBLIC_BANK_CODE}
            secondaryTypographyProps={{color: "text.main"}}
          />
        </Typography>

        <Box flexGrow={1} />
        <Box>
          <div>
            {
              bankAccountId && (
                <NavBarBankAccount bankAccountId={bankAccountId}/>
              )
            }
            </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}